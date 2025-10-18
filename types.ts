import React from 'react';

export interface UploadedImage {
  id: string;
  base64: string;
  mimeType: string;
  name: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text?: string;
  // A user can upload an image with their prompt, and the model responds with an image.
  image?: string; 
  isLoading?: boolean;
}

export interface TextOverlayConfig {
  content: string;
  color: string;
  size: number;
  x: number; // Position as a percentage from the left
  y: number; // Position as a percentage from the top
}

export type AppMode = 'textToImage' | 'imageEditing' | 'graphicDesign';
export type AspectRatio = '1:1' | '16:9' | '9:16';
export type TextPosition = 'topLeft' | 'topCenter' | 'topRight' | 'center' | 'bottomLeft' | 'bottomCenter' | 'bottomRight';

export interface DesignTemplate {
  name: string;
  prompt: string;
  aspectRatio: AspectRatio;
  icon: React.FC<{ className?: string }>;
}
