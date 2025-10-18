import React, { useState } from 'react';
import type { UploadedImage } from '../types';

interface ImageUploadProps {
  uploadedImages: UploadedImage[];
  onFilesChange: (files: FileList) => void;
  onRemoveImage: (id: string) => void;
  onRemoveBackground: () => void;
  isRemovingBackground: boolean;
  onRetouchImage: () => void;
  isRetouching: boolean;
  onRestoreImage: () => void;
  isRestoring: boolean;
  isDisabled: boolean;
  showEditingTools: boolean;
  onRotate: (id: string, degrees: 90 | -90) => void;
  brightness: number;
  contrast: number;
  saturation: number;
  maxImages: number;
}

// Icons
const UploadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
);
const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
);
const ScissorsIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><line x1="20" y1="4" x2="8.12" y2="15.88" /><line x1="14.47" y1="14.48" x2="20" y2="20" /><line x1="8.12" y1="8.12" x2="12" y2="12" /></svg>
);
const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.9 5.8-5.8 1.9 5.8 1.9 1.9 5.8 1.9-5.8 5.8-1.9-5.8-1.9zM3 12l1.9-5.8M21 12l-1.9-5.8M12 21l1.9-5.8" /></svg>
);
const HistoryIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v5h5"/><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"/></svg>
);
const RotateCwIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>
);
const RotateCcwIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" /></svg>
);
const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);
const SmallSpinner: React.FC = () => <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>;
const MediumSpinner: React.FC = () => <div className="w-8 h-8 border-4 border-t-transparent border-white rounded-full animate-spin"></div>;

// Sub-component for individual image thumbnail
const ImageThumbnail: React.FC<Omit<ImageUploadProps, 'uploadedImages' | 'onFilesChange' | 'maxImages'> & { image: UploadedImage }> = ({
    image, onRemoveImage, onRemoveBackground, isRemovingBackground, onRetouchImage, isRetouching, onRestoreImage, isRestoring, isDisabled, showEditingTools, onRotate, brightness, contrast, saturation
}) => {
    const imageStyle = { filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)` };
    const isLoadingTools = isRemovingBackground || isRetouching || isRestoring;
    
    const loadingText = () => {
        if (isRemovingBackground) return 'Removing Background...';
        if (isRetouching) return 'Retouching Skin...';
        if (isRestoring) return 'Restoring Image...';
        return 'Processing...';
    };

    return (
        <div className="relative group aspect-square w-full">
            <img src={`data:${image.mimeType};base64,${image.base64}`} alt={image.name} className="w-full h-full object-cover rounded-lg border-2 border-slate-700" style={showEditingTools ? imageStyle : {}}/>
            {isLoadingTools && (
              <div className="absolute inset-0 bg-slate-900/80 rounded-lg flex flex-col items-center justify-center gap-4 animate-fade-in z-20">
                  <MediumSpinner />
                  <p className="font-semibold text-slate-200">
                      {loadingText()}
                  </p>
              </div>
            )}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4 rounded-lg z-10">
                <div className="flex items-center gap-3">
                    <button type="button" onClick={(e) => { e.preventDefault(); onRotate(image.id, -90); }} disabled={isDisabled} className="p-2 bg-slate-700/80 text-white rounded-full hover:bg-slate-600 disabled:cursor-not-allowed transition-all transform hover:scale-110" aria-label="Rotate counter-clockwise"><RotateCcwIcon className="w-5 h-5" /></button>
                    <button type="button" onClick={(e) => { e.preventDefault(); onRemoveImage(image.id); }} disabled={isDisabled} className="p-3 bg-red-600/80 text-white rounded-full hover:bg-red-500 disabled:cursor-not-allowed transition-all transform hover:scale-110" aria-label="Remove image"><TrashIcon className="w-6 h-6" /></button>
                    <button type="button" onClick={(e) => { e.preventDefault(); onRotate(image.id, 90); }} disabled={isDisabled} className="p-2 bg-slate-700/80 text-white rounded-full hover:bg-slate-600 disabled:cursor-not-allowed transition-all transform hover:scale-110" aria-label="Rotate clockwise"><RotateCwIcon className="w-5 h-5" /></button>
                </div>
                {showEditingTools && (
                    <div className="flex items-center flex-wrap justify-center gap-2">
                        <button type="button" onClick={(e) => { e.preventDefault(); onRemoveBackground(); }} disabled={isDisabled} className="flex items-center gap-2 px-3 py-1.5 bg-slate-700/80 text-white text-xs font-semibold rounded-full hover:bg-slate-600 disabled:cursor-not-allowed transition-all transform hover:scale-105">
                            {isRemovingBackground ? <SmallSpinner /> : <ScissorsIcon className="w-3 h-3" />}
                            <span>{isRemovingBackground ? 'Removing...' : 'Remove BG'}</span>
                        </button>
                        <button type="button" onClick={(e) => { e.preventDefault(); onRetouchImage(); }} disabled={isDisabled} className="flex items-center gap-2 px-3 py-1.5 bg-slate-700/80 text-white text-xs font-semibold rounded-full hover:bg-slate-600 disabled:cursor-not-allowed transition-all transform hover:scale-105">
                            {isRetouching ? <SmallSpinner /> : <SparklesIcon className="w-3 h-3" />}
                            <span>{isRetouching ? 'Retouching...' : 'Retouch Skin'}</span>
                        </button>
                        <button type="button" onClick={(e) => { e.preventDefault(); onRestoreImage(); }} disabled={isDisabled} className="flex items-center gap-2 px-3 py-1.5 bg-slate-700/80 text-white text-xs font-semibold rounded-full hover:bg-slate-600 disabled:cursor-not-allowed transition-all transform hover:scale-105">
                            {isRestoring ? <SmallSpinner /> : <HistoryIcon className="w-3 h-3" />}
                            <span>{isRestoring ? 'Restoring...' : 'Restore Image'}</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export const ImageUpload: React.FC<ImageUploadProps> = (props) => {
  const { uploadedImages, onFilesChange, isDisabled, maxImages } = props;
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const canUploadMore = uploadedImages.length < maxImages;
  const effectiveDisabled = isDisabled || !canUploadMore;

  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault(); e.stopPropagation();
    if (effectiveDisabled) return;
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault(); e.stopPropagation();
    if (effectiveDisabled) return;
    setIsDragging(false);
  };
  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => { e.preventDefault(); e.stopPropagation(); };
  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault(); e.stopPropagation();
    if (effectiveDisabled) return;
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) onFilesChange(files);
  };
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) onFilesChange(files);
    // Reset input value to allow re-uploading the same file
    if (e.target) e.target.value = '';
  };
  const triggerFileInput = () => {
    if (effectiveDisabled) return;
    fileInputRef.current?.click();
  };

  const gridColsClass = maxImages === 1 ? 'grid-cols-1' : 'grid-cols-2 sm:grid-cols-3';

  return (
    <div className="w-full">
      <label onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={handleDrop} className={`relative block transition-all duration-300 ${effectiveDisabled ? 'cursor-not-allowed' : ''}`}>
        <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/png, image/jpeg, image/webp" className="hidden" disabled={effectiveDisabled} multiple={maxImages > 1} />
        
        {uploadedImages.length > 0 ? (
          <div className={`grid ${gridColsClass} gap-2 p-2 bg-slate-800/50 rounded-lg border-2 border-dashed ${isDragging ? 'border-cyan-500' : 'border-slate-700'}`}>
            {uploadedImages.map(image => (<ImageThumbnail key={image.id} image={image} {...props} />))}
            {canUploadMore && maxImages > 1 && (
              <div onClick={triggerFileInput} className="flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed border-slate-600 rounded-lg p-2 text-center hover:border-cyan-500 hover:bg-slate-800/50 transition-colors cursor-pointer">
                  <PlusIcon className="w-8 h-8 text-slate-500 mb-1" />
                  <span className="font-semibold text-xs text-slate-400">Add more</span>
              </div>
            )}
          </div>
        ) : (
          <div onClick={triggerFileInput} className={`flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed rounded-lg p-4 text-center transition-colors ${effectiveDisabled ? 'opacity-50' : 'cursor-pointer hover:border-cyan-500 hover:bg-slate-800/50'} ${isDragging ? 'border-cyan-500 bg-slate-800/50' : 'border-slate-600'}`}>
            <UploadIcon className="w-10 h-10 text-slate-500 mb-2" />
            <p className="font-semibold text-slate-300">
              Upload image{maxImages > 1 ? 's' : ''}
              <span className="block font-normal text-xs text-slate-500">or drag and drop</span>
            </p>
          </div>
        )}
      </label>
    </div>
  );
};