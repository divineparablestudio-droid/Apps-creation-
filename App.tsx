import React, { useState, useCallback, useEffect } from 'react';
import type { Chat } from '@google/genai';
import { Header } from './components/Header';
import { ImageUpload } from './components/ImageUpload';
import { ChatDisplay } from './components/ChatDisplay';
import { sendMessage, startChat, removeImageBackground, retouchImage, restoreImage } from './services/geminiService';
import type { UploadedImage, ChatMessage, TextPosition, DesignTemplate, AspectRatio, AppMode, TextOverlayConfig } from './types';
import { ImageAdjustments } from './components/ImageAdjustments';
import { HomePage } from './components/HomePage';
import { DesignTemplates } from './components/DesignTemplates';
import { templates } from './templates';
import { ModeSelector } from './components/ModeSelector';
import { TextOverlayControls } from './components/TextOverlayControls';
import { ExportControls } from './components/ExportControls';


type OutputFormat = 'png' | 'jpeg';

const WandIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 4V2" /> <path d="M15 10V8" /> <path d="M12.5 7.5L11 6" /> <path d="M18 13l-1.5-1.5" /> <path d="M20 2v2" /> <path d="M18.5 4.5L17 6" /> <path d="m22 12-2 0" /> <path d="m17 17-1.5 1.5" /> <path d="M9 6H2l3 3-3 3h7" /> <path d="M9 18H2l3-3-3-3h7" />
    </svg>
);

const EditIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
);

const App: React.FC = () => {
  const [showHomePage, setShowHomePage] = useState(true);
  const [activeMode, setActiveMode] = useState<AppMode>('textToImage');
  
  const [prompt, setPrompt] = useState<string>('');
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  
  const [isRemovingBackground, setIsRemovingBackground] = useState<boolean>(false);
  const [isRetouching, setIsRetouching] = useState<boolean>(false);
  const [isRestoring, setIsRestoring] = useState<boolean>(false);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);

  const [selectedTemplate, setSelectedTemplate] = useState<DesignTemplate | null>(null);

  const [outputFormat, setOutputFormat] = useState<OutputFormat>('png');
  const [jpegQuality, setJpegQuality] = useState<number>(0.92);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  
  const [textConfig, setTextConfig] = useState<TextOverlayConfig>({
      content: '',
      color: '#FFFFFF',
      size: 48,
      x: 50,
      y: 50,
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [templateError, setTemplateError] = useState<string | null>(null);

  useEffect(() => {
    setChatSession(startChat());
  }, []);

  const isBusy = isLoading || isRemovingBackground || isRetouching || isRestoring;
  const hasGeneratedContent = chatHistory.some(msg => msg.role === 'model' && msg.image);

  const resetAdjustments = () => {
      setBrightness(100);
      setContrast(100);
      setSaturation(100);
  };

  const resetAllStateForModeChange = () => {
    setPrompt('');
    setUploadedImages([]);
    setSelectedTemplate(null);
    resetAdjustments();
    setError(null);
    setTemplateError(null);
    // Don't reset chat history
  };
  
  const handleModeChange = (mode: AppMode) => {
    resetAllStateForModeChange();
    setActiveMode(mode);
  };
  
  const handleUseImageAsInput = (base64: string) => {
    // Manually reset relevant states for a clean slate, but keep chat history
    setPrompt('');
    setUploadedImages([]); // Clear any existing images
    setSelectedTemplate(null);
    resetAdjustments();
    setError(null);
    setTemplateError(null);
    
    const newImage: UploadedImage = {
        id: `re-edit-${Date.now()}`,
        base64,
        mimeType: 'image/png', // Generated images are PNGs from canvas
        name: 'generated-image.png',
    };

    setUploadedImages([newImage]); // Now add the new image
    setActiveMode('imageEditing'); // Switch to the correct mode
    
    // Scroll to the top of the main element to show the controls
    document.querySelector('main')?.scrollIntoView({ behavior: 'smooth' });
};


  const handleTemplateSelect = (template: DesignTemplate | null) => {
      setSelectedTemplate(template);
      if (template) {
          setPrompt(template.prompt);
          setAspectRatio(template.aspectRatio);
      } else {
          setPrompt('');
          setAspectRatio('1:1');
      }
      setError(null);
      setTemplateError(null);
  };

  const fileToBase64 = (file: File): Promise<{ base64: string; mimeType: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve({ base64, mimeType: file.type });
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleFilesChange = async (files: FileList) => {
    const maxImages = activeMode === 'imageEditing' ? 1 : 5;
    if (uploadedImages.length + files.length > maxImages) {
        setError(`You can upload a maximum of ${maxImages} image(s) in this mode.`);
        setTimeout(() => setError(null), 3000);
        return;
    }

    try {
      const newImagesPromises = Array.from(files).map(async (file) => {
        const { base64, mimeType } = await fileToBase64(file);
        return { id: `img-${Date.now()}-${Math.random()}`, base64, mimeType, name: file.name };
      });
      const newImages = await Promise.all(newImagesPromises);
      setUploadedImages(prev => [...prev, ...newImages]);
      if(activeMode === 'imageEditing') resetAdjustments();
    } catch (err) {
      console.error("Error converting file to base64", err);
      setError("Failed to load one or more images.");
    }
  };

  const handleRemoveImage = (idToRemove: string) => {
    setUploadedImages(prev => prev.filter(img => img.id !== idToRemove));
  };

  const applyImageProcess = async (
      processFn: (image: UploadedImage) => Promise<string>, 
      setLoading: (loading: boolean) => void
    ) => {
      if (uploadedImages.length === 0) return;
      const imageToProcess = uploadedImages[0];
      setLoading(true);
      setError(null);
      try {
          const newBase64 = await processFn(imageToProcess);
          setUploadedImages([{ ...imageToProcess, base64: newBase64 }]);
      } catch (err: any) {
          setError(err.message);
      } finally {
          setLoading(false);
      }
  };

  const handleRemoveBackground = () => applyImageProcess(removeImageBackground, setIsRemovingBackground);
  const handleRetouchImage = () => applyImageProcess(retouchImage, setIsRetouching);
  const handleRestoreImage = () => applyImageProcess(restoreImage, setIsRestoring);

  const rotateImage = (base64: string, mimeType: string, degrees: number): Promise<string> => {
      return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              if (!ctx) return reject('Could not get canvas context');
              
              if (degrees === 90 || degrees === -90) {
                  canvas.width = img.height;
                  canvas.height = img.width;
              } else {
                  canvas.width = img.width;
                  canvas.height = img.height;
              }

              ctx.translate(canvas.width / 2, canvas.height / 2);
              ctx.rotate(degrees * Math.PI / 180);
              ctx.drawImage(img, -img.width / 2, -img.height / 2);
              
              resolve(canvas.toDataURL(mimeType).split(',')[1]);
          };
          img.onerror = reject;
          img.src = `data:${mimeType};base64,${base64}`;
      });
  };

  const handleRotate = async (idToRotate: string, degrees: 90 | -90) => {
      const imageToRotate = uploadedImages.find(img => img.id === idToRotate);
      if (!imageToRotate) return;
      try {
          const rotatedBase64 = await rotateImage(imageToRotate.base64, imageToRotate.mimeType, degrees);
          setUploadedImages(prev => prev.map(img => img.id === idToRotate ? { ...img, base64: rotatedBase64 } : img));
      } catch (e) {
          console.error(`Failed to rotate image by ${degrees} degrees`, e);
          setError('Failed to rotate image.');
      }
  };

  const handleGenerate = async () => {
    if (activeMode === 'graphicDesign' && selectedTemplate) {
        if (prompt.includes('[') && prompt.includes(']')) {
            setTemplateError('Please fill in all the details in the brackets [] before generating.');
            return;
        }
    }
    setTemplateError(null);

    if (!chatSession) {
      setError("Chat session not initialized. Please refresh the page.");
      return;
    }

    setError(null);
    setIsLoading(true);

    const userMessageId = `user-${Date.now()}`;
    const userMessage: ChatMessage = {
      id: userMessageId,
      role: 'user',
      text: prompt,
      image: uploadedImages.length > 0 ? uploadedImages[0].base64 : undefined,
    };

    const modelMessageId = `model-${Date.now()}`;
    const modelMessage: ChatMessage = {
      id: modelMessageId,
      role: 'model',
      isLoading: true,
    };

    setChatHistory(prev => [...prev, userMessage, modelMessage]);
    
    const imagesToProcess = [...uploadedImages];
    // Clear state for next interaction
    setPrompt('');
    setUploadedImages([]);
    
    try {
      const resultBase64 = await sendMessage(chatSession, userMessage.text || '', imagesToProcess);
      
      setChatHistory(prev => prev.map(msg => 
        msg.id === modelMessageId 
          ? { ...msg, isLoading: false, image: resultBase64 } 
          : msg
      ));
    } catch (err: any) {
      const errorMessage = err.message || "An unexpected error occurred.";
      setError(errorMessage);
      setChatHistory(prev => prev.map(msg => 
        msg.id === modelMessageId 
          ? { ...msg, isLoading: false, text: `Error: ${errorMessage}` } 
          : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const isGenerateDisabled = isBusy ||
    (activeMode === 'textToImage' && !prompt.trim() && uploadedImages.length === 0) ||
    (activeMode === 'imageEditing' && (uploadedImages.length === 0 || !prompt.trim())) ||
    (activeMode === 'graphicDesign' && !prompt.trim());

  const buttonContent = () => {
    if (isLoading) {
        return (
            <>
                <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                <span>Generating...</span>
            </>
        );
    }
    if (activeMode === 'imageEditing') {
        return (
            <>
                <EditIcon className="w-5 h-5" />
                <span>Edit with AI</span>
            </>
        );
    }
    return (
        <>
            <WandIcon className="w-5 h-5" />
            <span>Generate Image</span>
        </>
    );
  };


  return (
    <div className="bg-slate-900 text-white min-h-screen font-sans">
      {showHomePage ? (
        <HomePage onStart={() => setShowHomePage(false)} />
      ) : (
        <main className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
          <Header />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mt-6">
            <div className="flex flex-col gap-6">
                <ModeSelector activeMode={activeMode} onModeChange={handleModeChange} isDisabled={isBusy} />
                
                {activeMode === 'graphicDesign' && (
                    <DesignTemplates 
                        templates={templates}
                        selectedTemplate={selectedTemplate}
                        onSelectTemplate={handleTemplateSelect}
                        isDisabled={isBusy}
                    />
                )}
                
                {(activeMode === 'imageEditing' || activeMode === 'graphicDesign' || activeMode === 'textToImage') &&
                    <ImageUpload
                        uploadedImages={uploadedImages}
                        onFilesChange={handleFilesChange}
                        onRemoveImage={handleRemoveImage}
                        onRemoveBackground={() => uploadedImages.length > 0 && handleRemoveBackground()}
                        isRemovingBackground={isRemovingBackground}
                        onRetouchImage={() => uploadedImages.length > 0 && handleRetouchImage()}
                        isRetouching={isRetouching}
                        onRestoreImage={() => uploadedImages.length > 0 && handleRestoreImage()}
                        isRestoring={isRestoring}
                        isDisabled={isBusy}
                        showEditingTools={activeMode === 'imageEditing'}
                        onRotate={handleRotate}
                        brightness={brightness}
                        contrast={contrast}
                        saturation={saturation}
                        maxImages={activeMode === 'imageEditing' ? 1 : 5}
                    />
                }
                
                { activeMode === 'imageEditing' && uploadedImages.length > 0 && (
                    <ImageAdjustments 
                        brightness={brightness}
                        onBrightnessChange={setBrightness}
                        contrast={contrast}
                        onContrastChange={setContrast}
                        saturation={saturation}
                        onSaturationChange={setSaturation}
                        onReset={resetAdjustments}
                        isDisabled={isBusy}
                    />
                )}
                
                <div className="space-y-4">
                  <textarea
                    value={prompt}
                    onChange={(e) => {
                        setPrompt(e.target.value);
                        if(templateError) setTemplateError(null);
                    }}
                    placeholder={
                        activeMode === 'graphicDesign' 
                            ? "Fill in the template details and describe your vision..."
                            : "Describe what you want to create or edit..."
                    }
                    rows={activeMode === 'graphicDesign' ? 8 : 4}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition disabled:opacity-50"
                    disabled={isBusy}
                  />
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerateDisabled}
                    className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                   {buttonContent()}
                  </button>
                  {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                  {templateError && <p className="text-amber-400 text-sm text-center">{templateError}</p>}
                </div>

                {hasGeneratedContent && (
                    <div className="space-y-6 pt-6 border-t border-slate-800">
                        <TextOverlayControls
                            textConfig={textConfig}
                            onTextConfigChange={(newConfig) => setTextConfig(prev => ({...prev, ...newConfig}))}
                            isDisabled={isBusy}
                        />
                        <ExportControls
                            outputFormat={outputFormat}
                            setOutputFormat={setOutputFormat}
                            jpegQuality={jpegQuality}
                            setJpegQuality={setJpegQuality}
                            isDisabled={isBusy}
                        />
                    </div>
                )}
            </div>
            
            <div className="lg:h-[calc(100vh-10rem)]">
                <ChatDisplay 
                    chatHistory={chatHistory}
                    outputFormat={outputFormat}
                    jpegQuality={jpegQuality}
                    aspectRatio={aspectRatio}
                    textConfig={textConfig}
                    onTextConfigChange={(newConfig) => setTextConfig(prev => ({...prev, ...newConfig}))}
                    onUseImageAsInput={handleUseImageAsInput}
                />
            </div>
          </div>
        </main>
      )}
    </div>
  );
};

export default App;