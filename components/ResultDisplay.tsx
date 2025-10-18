import React, { useRef, useEffect } from 'react';
import type { TextOverlayConfig } from '../types';

interface ResultDisplayProps {
  generatedImage: string | null;
  isLoading: boolean;
  error: string | null;
  outputFormat: 'png' | 'jpeg';
  jpegQuality: number;
  aspectRatio: '1:1' | '16:9' | '9:16';
  textConfig: TextOverlayConfig;
}

const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
);

const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center gap-4 text-center">
      <div className="w-12 h-12 border-4 border-t-transparent border-cyan-400 rounded-full animate-spin"></div>
      <p className="text-slate-300 font-medium">Generating your masterpiece...</p>
    </div>
  );

const Placeholder: React.FC = () => (
    <div className="text-center text-slate-500">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mx-auto mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            <path d="m18 13-1.42-1.42c-.45-.45-1.12-.6-1.77-.42l-1.61.49a.9.9 0 0 0-.59 1.48l1.3 2.1a.9.9 0 0 0 1.48.33l2.6-1.5a.9.9 0 0 0 .01-1.58z" />
        </svg>
      <h3 className="text-lg font-semibold text-slate-300">Your new image will appear here</h3>
      <p className="text-sm">Enter a prompt and click "Generate" to begin.</p>
    </div>
  );

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ 
    generatedImage, 
    isLoading, 
    error, 
    outputFormat, 
    jpegQuality, 
    aspectRatio,
    textConfig
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!generatedImage || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
        const [arW, arH] = aspectRatio.split(':').map(Number);
        const sourceRatio = img.naturalWidth / img.naturalHeight;
        const targetRatio = arW / arH;

        let sx = 0, sy = 0, sWidth = img.naturalWidth, sHeight = img.naturalHeight;

        if (sourceRatio > targetRatio) {
            sWidth = img.naturalHeight * targetRatio;
            sx = (img.naturalWidth - sWidth) / 2;
        } else {
            sHeight = img.naturalWidth / targetRatio;
            sy = (img.naturalHeight - sHeight) / 2;
        }
        
        // Use a consistent large size for better quality when possible
        const targetWidth = Math.min(sWidth, 1024);
        canvas.width = targetWidth;
        canvas.height = targetWidth / targetRatio;
        
        ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, canvas.width, canvas.height);
        
        if (textConfig.content) {
            // Adjust font size based on canvas size
            const fontSize = textConfig.size * (canvas.width / sWidth);
            ctx.font = `bold ${fontSize}px sans-serif`;
            ctx.fillStyle = textConfig.color;
            ctx.strokeStyle = 'black';
            ctx.lineWidth = fontSize / 16;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            const x = (textConfig.x / 100) * canvas.width;
            const y = (textConfig.y / 100) * canvas.height;
            
            ctx.strokeText(textConfig.content, x, y);
            ctx.fillText(textConfig.content, x, y);
        }
    };
    img.src = `data:image/png;base64,${generatedImage}`;

  }, [generatedImage, aspectRatio, textConfig]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const download = (href: string, fileName: string) => {
        const link = document.createElement('a');
        link.href = href;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    const baseFileName = `brosteve-ai-${aspectRatio.replace(':', 'x')}`;

    if (outputFormat === 'jpeg') {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        if (!tempCtx) return;

        tempCtx.fillStyle = '#FFFFFF';
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        tempCtx.drawImage(canvas, 0, 0);
        
        const jpegDataUrl = tempCanvas.toDataURL('image/jpeg', jpegQuality);
        download(jpegDataUrl, `${baseFileName}.jpeg`);
    } else {
        const pngDataUrl = canvas.toDataURL('image/png');
        download(pngDataUrl, `${baseFileName}.png`);
    }
  };

  const aspectRatioClasses = {
    '1:1': 'aspect-square',
    '16:9': 'aspect-video',
    '9:16': 'aspect-[9/16]',
  };

  return (
    <div className={`w-full ${aspectRatioClasses[aspectRatio]} bg-slate-800/50 border border-slate-700 rounded-lg flex items-center justify-center p-4 transition-all duration-300`}>
      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="text-center text-red-400">
          <h3 className="font-bold mb-2">An Error Occurred</h3>
          <p className="text-sm">{error}</p>
        </div>
      ) : generatedImage ? (
        <div className="relative group w-full h-full">
          <canvas
            ref={canvasRef}
            className="object-contain w-full h-full rounded-md"
          />
          <button
            onClick={handleDownload}
            className="absolute bottom-2 right-2 p-2 bg-slate-900/70 text-white rounded-full hover:bg-cyan-600/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-500 transition-all opacity-0 group-hover:opacity-100"
            aria-label="Download image"
          >
            <DownloadIcon className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <Placeholder />
      )}
    </div>
  );
};
