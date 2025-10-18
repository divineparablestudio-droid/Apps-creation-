import React, { useRef, useEffect, memo, useState, useCallback } from 'react';
import type { ChatMessage, TextOverlayConfig } from '../types';

interface ChatDisplayProps {
  chatHistory: ChatMessage[];
  outputFormat: 'png' | 'jpeg';
  jpegQuality: number;
  aspectRatio: '1:1' | '16:9' | '9:16';
  textConfig: TextOverlayConfig;
  onTextConfigChange: (newConfig: Partial<TextOverlayConfig>) => void;
  onUseImageAsInput: (base64: string) => void;
}

const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
);

const PlusCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
);


const WandIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 4V2" /><path d="M15 10V8" /><path d="M12.5 7.5L11 6" /><path d="M18 13l-1.5-1.5" /><path d="M20 2v2" /><path d="M18.5 4.5L17 6" /><path d="m22 12-2 0" /><path d="m17 17-1.5 1.5" /><path d="M9 6H2l3 3-3 3h7" /><path d="M9 18H2l3-3-3-3h7" />
    </svg>
);

const ImageGenerationSkeleton: React.FC<{ aspectRatio: '1:1' | '16:9' | '9:16' }> = ({ aspectRatio }) => {
  const aspectRatioClasses = { '1:1': 'aspect-square', '16:9': 'aspect-video', '9:16': 'aspect-[9/16]' };
  return (
    <div className={`w-full ${aspectRatioClasses[aspectRatio]} bg-slate-700/50 rounded-lg flex flex-col items-center justify-center p-4 animate-pulse`}>
      <WandIcon className="w-12 h-12 text-slate-500 mb-3" />
      <h3 className="text-sm font-semibold text-slate-400">Conjuring your image...</h3>
      <p className="text-xs text-slate-500">The AI is hard at work.</p>
    </div>
  );
};

const Placeholder: React.FC = () => (
    <div className="text-center text-slate-500 m-auto">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mx-auto mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            <path d="m18 13-1.42-1.42c-.45-.45-1.12-.6-1.77-.42l-1.61.49a.9.9 0 0 0-.59 1.48l1.3 2.1a.9.9 0 0 0 1.48.33l2.6-1.5a.9.9 0 0 0 .01-1.58z" />
        </svg>
      <h3 className="text-lg font-semibold text-slate-300">Your conversation starts here</h3>
      <p className="text-sm">Enter a prompt or upload an image to begin.</p>
    </div>
);

const UserMessage: React.FC<{ message: ChatMessage }> = ({ message }) => (
  <div className="flex justify-end mb-4 animate-fade-in">
    <div className="mr-2 py-3 px-4 bg-cyan-800 rounded-l-xl rounded-t-xl text-white max-w-sm sm:max-w-md md:max-w-lg">
      {message.image && <img src={`data:image/png;base64,${message.image}`} alt="User upload" className="rounded-md mb-2 max-h-48" />}
      {message.text && <p className="whitespace-pre-wrap">{message.text}</p>}
    </div>
  </div>
);

const ModelMessage: React.FC<Omit<ChatDisplayProps, 'chatHistory'> & { message: ChatMessage; isLast: boolean }> = memo(({ message, isLast, outputFormat, jpegQuality, aspectRatio, textConfig, onTextConfigChange, onUseImageAsInput }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);
    const [interaction, setInteraction] = useState({ mode: 'none' as 'none' | 'dragging' | 'resizing', handle: null as 'tl' | 'tr' | 'bl' | 'br' | null, startPos: { x: 0, y: 0 }, startConfig: textConfig });
    
    const getTextBoundingBox = (ctx: CanvasRenderingContext2D, config: TextOverlayConfig) => {
        ctx.font = `bold ${config.size}px sans-serif`;
        const metrics = ctx.measureText(config.content);
        const x = (config.x / 100) * ctx.canvas.width;
        const y = (config.y / 100) * ctx.canvas.height;
        const width = metrics.width;
        const height = config.size;
        const handleSize = 10;
        return {
            x: x - width / 2,
            y: y - height / 2,
            width,
            height,
            handles: {
                tl: { x: x - width / 2 - handleSize, y: y - height / 2 - handleSize, size: handleSize * 2 },
                tr: { x: x + width / 2 - handleSize, y: y - height / 2 - handleSize, size: handleSize * 2 },
                bl: { x: x - width / 2 - handleSize, y: y + height / 2 - handleSize, size: handleSize * 2 },
                br: { x: x + width / 2 - handleSize, y: y + height / 2 - handleSize, size: handleSize * 2 },
            }
        };
    };

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        const image = imageRef.current;
        if (!canvas || !image || !image.complete) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        
        if (textConfig.content && isLast) { // Only draw text on the last image
            ctx.font = `bold ${textConfig.size}px sans-serif`;
            ctx.fillStyle = textConfig.color;
            ctx.strokeStyle = '#000000A0';
            ctx.lineWidth = Math.max(2, textConfig.size / 16);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const x = (textConfig.x / 100) * canvas.width;
            const y = (textConfig.y / 100) * canvas.height;
            ctx.strokeText(textConfig.content, x, y);
            ctx.fillText(textConfig.content, x, y);
            
            const box = getTextBoundingBox(ctx, textConfig);
            ctx.strokeStyle = 'rgba(0, 255, 255, 0.7)';
            ctx.lineWidth = 2;
            ctx.strokeRect(box.x, box.y, box.width, box.height);
            ctx.fillStyle = 'rgba(0, 255, 255, 0.7)';
            Object.values(box.handles).forEach(h => ctx.fillRect(h.x + h.size/4, h.y + h.size/4, h.size/2, h.size/2));
        }
    }, [textConfig, isLast]);

    useEffect(() => {
        const image = new Image();
        image.onload = () => {
            const canvas = canvasRef.current;
            if (canvas) {
                canvas.width = image.naturalWidth;
                canvas.height = image.naturalHeight;
                imageRef.current = image;
                draw();
            }
        };
        if(message.image) image.src = `data:image/png;base64,${message.image}`;
    }, [message.image, draw]);

    useEffect(() => { draw(); }, [textConfig, draw]);

    const getMousePos = (e: React.MouseEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!isLast || !textConfig.content) return;
        const pos = getMousePos(e);
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if(!ctx || !canvas) return;

        const box = getTextBoundingBox(ctx, textConfig);
        for(const [key, handle] of Object.entries(box.handles)) {
            if(pos.x > handle.x && pos.x < handle.x + handle.size && pos.y > handle.y && pos.y < handle.y + handle.size) {
                setInteraction({ mode: 'resizing', handle: key as any, startPos: pos, startConfig: textConfig });
                return;
            }
        }
        if(pos.x > box.x && pos.x < box.x + box.width && pos.y > box.y && pos.y < box.y + box.height) {
            setInteraction({ mode: 'dragging', handle: null, startPos: pos, startConfig: textConfig });
            return;
        }
    };
    
    const handleMouseMove = (e: React.MouseEvent) => {
        const canvas = canvasRef.current;
        if (!canvas || !isLast || !textConfig.content) return;
        const pos = getMousePos(e);
        
        if (interaction.mode === 'none') {
            const ctx = canvas.getContext('2d');
            if(!ctx) return;
            const box = getTextBoundingBox(ctx, textConfig);
            let newCursor = 'default';
            if(pos.x > box.x && pos.x < box.x + box.width && pos.y > box.y && pos.y < box.y + box.height) newCursor = 'grab';
            if( (pos.x > box.handles.tl.x && pos.x < box.handles.tl.x + box.handles.tl.size && pos.y > box.handles.tl.y && pos.y < box.handles.tl.y + box.handles.tl.size) || (pos.x > box.handles.br.x && pos.x < box.handles.br.x + box.handles.br.size && pos.y > box.handles.br.y && pos.y < box.handles.br.y + box.handles.br.size)) newCursor = 'nwse-resize';
            if( (pos.x > box.handles.tr.x && pos.x < box.handles.tr.x + box.handles.tr.size && pos.y > box.handles.tr.y && pos.y < box.handles.tr.y + box.handles.tr.size) || (pos.x > box.handles.bl.x && pos.x < box.handles.bl.x + box.handles.bl.size && pos.y > box.handles.bl.y && pos.y < box.handles.bl.y + box.handles.bl.size)) newCursor = 'nesw-resize';
            canvas.style.cursor = newCursor;
            return;
        }

        const dx = pos.x - interaction.startPos.x;
        const dy = pos.y - interaction.startPos.y;

        if (interaction.mode === 'dragging') {
            const newX = ((interaction.startConfig.x / 100) * canvas.width + dx) / canvas.width * 100;
            const newY = ((interaction.startConfig.y / 100) * canvas.height + dy) / canvas.height * 100;
            onTextConfigChange({ x: newX, y: newY });
        } else if (interaction.mode === 'resizing') {
            const startSize = interaction.startConfig.size;
            // A simplified, more intuitive resize logic
            const moveDelta = (interaction.handle?.includes('r') ? dx : -dx) + (interaction.handle?.includes('b') ? dy : -dy);
            const newSize = Math.max(12, startSize + moveDelta * 0.5);
            onTextConfigChange({ size: newSize });
        }
    };
    
    const handleMouseUp = () => setInteraction({ mode: 'none', handle: null, startPos: { x: 0, y: 0 }, startConfig: textConfig });

    const handleDownload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
  
      const downloadLink = (href: string, fileName: string) => {
          const link = document.createElement('a');
          link.href = href;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
      };
      
      const baseFileName = `brosteve-ai-art-${Date.now()}`;
      const fileName = `${baseFileName}.${outputFormat}`;
  
      if (outputFormat === 'jpeg') {
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = canvas.width;
          tempCanvas.height = canvas.height;
          const tempCtx = tempCanvas.getContext('2d');
          if (!tempCtx) {
              console.error("Could not get temporary canvas context for JPEG export.");
              return;
          }
  
          tempCtx.fillStyle = '#FFFFFF';
          tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
          tempCtx.drawImage(canvas, 0, 0);
          
          const jpegDataUrl = tempCanvas.toDataURL('image/jpeg', jpegQuality);
          downloadLink(jpegDataUrl, fileName);
      } else {
          const pngDataUrl = canvas.toDataURL('image/png');
          downloadLink(pngDataUrl, fileName);
      }
    };

    return (
        <div className="flex justify-start mb-4 animate-fade-in">
            <div className="relative group ml-2 p-2 bg-slate-700 rounded-r-xl rounded-t-xl text-white max-w-sm sm:max-w-md md:max-w-lg">
                {message.isLoading && <ImageGenerationSkeleton aspectRatio={aspectRatio} />}
                {message.image && (
                    <>
                        <canvas ref={canvasRef} className="max-w-full h-auto rounded-md" 
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                        />
                        <div className="absolute bottom-2 right-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                           <button 
                                onClick={() => onUseImageAsInput(message.image!)} 
                                className="p-2 bg-slate-900/70 text-white rounded-full hover:bg-cyan-600/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-500 transition-all transform hover:scale-110" 
                                aria-label="Use this image to edit"
                            >
                                <PlusCircleIcon className="w-5 h-5" />
                            </button>
                            <button 
                                onClick={handleDownload} 
                                className="p-2 bg-slate-900/70 text-white rounded-full hover:bg-cyan-600/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-500 transition-all transform hover:scale-110" 
                                aria-label="Download image"
                            >
                                <DownloadIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </>
                )}
                {message.text && !message.image && <p className="text-red-400 p-2">{message.text}</p>}
            </div>
        </div>
    );
});

export const ChatDisplay: React.FC<ChatDisplayProps> = (props) => {
  const { chatHistory } = props;
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatHistory]);

  const lastModelMessageIndex = chatHistory.map(m => m.role).lastIndexOf('model');

  return (
    <div className={`w-full h-[60vh] lg:h-full bg-slate-800/50 border border-slate-700 rounded-lg flex flex-col transition-all duration-300`}>
      <div className="flex-grow overflow-y-auto p-4">
        {chatHistory.length === 0 ? <Placeholder /> : (
           chatHistory.map((msg, index) => 
             msg.role === 'user'
               ? <UserMessage key={msg.id} message={msg} />
               : <ModelMessage key={msg.id} message={msg} isLast={index === lastModelMessageIndex} {...props} />
           )
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};