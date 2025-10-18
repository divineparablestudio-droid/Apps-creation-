import { GoogleGenAI, Modality, Chat, Part, GenerateContentResponse } from "@google/genai";
import type { UploadedImage } from '../types';

const imageModel = 'gemini-2.5-flash-image';

const fileToGenerativePart = (image: UploadedImage): Part => {
  return {
    inlineData: {
      data: image.base64,
      mimeType: image.mimeType,
    },
  };
};

export const startChat = (): Chat => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
    return ai.chats.create({ 
        model: imageModel,
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });
};

export const sendMessage = async (chat: Chat, prompt: string, images: UploadedImage[]): Promise<string> => {
    try {
        const parts: Part[] = [];
        const hasText = prompt && prompt.trim();

        images.forEach(image => {
            parts.push(fileToGenerativePart(image));
        });
        
        // The gemini-2.5-flash-image model requires a text instruction when an image is provided.
        // If the user doesn't supply a prompt, we add a minimal one to prevent an API error.
        if (images.length > 0 && !hasText) {
            parts.push({ text: ' ' }); // Use a single space to fulfill the requirement.
        }
        
        if (hasText) {
            parts.push({ text: prompt });
        }

        if (parts.length === 0) {
            throw new Error("Cannot send an empty message with no prompt or image.");
        }

        const result: GenerateContentResponse = await chat.sendMessage({ message: parts });
        
        const candidate = result.candidates?.[0];
        if (candidate?.content?.parts) {
            for (const part of candidate.content.parts) {
                if (part.inlineData) {
                    return part.inlineData.data;
                }
            }
        }
        
        const finishReason = candidate?.finishReason;
        if (finishReason && finishReason !== 'STOP') {
            throw new Error(`Image generation failed due to: ${finishReason}. Please revise your prompt.`);
        }

        throw new Error("No image data found in the response");
    } catch (error) {
        console.error("Gemini API error in sendMessage:", error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error("Failed to send message. Please check the console for details.");
    }
};


export const removeImageBackground = async (image: UploadedImage): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
    try {
        const parts: Part[] = [
            fileToGenerativePart(image),
            { text: 'Remove the background from this image, making it transparent. The subject should be perfectly preserved.' }
        ];

        const response = await ai.models.generateContent({
            model: imageModel,
            contents: { parts },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        const candidate = response.candidates?.[0];
        if (candidate?.content?.parts) {
            for (const part of candidate.content.parts) {
                if (part.inlineData) {
                    return part.inlineData.data;
                }
            }
        }
        
        const finishReason = candidate?.finishReason;
        if (finishReason && finishReason !== 'STOP') {
            throw new Error(`Background removal failed due to: ${finishReason}.`);
        }

        throw new Error("No image data found in the response for background removal.");
    } catch (error) {
        console.error("Gemini API error in removeImageBackground:", error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error("Failed to remove background. Please check the console for details.");
    }
};

export const retouchImage = async (image: UploadedImage): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
    try {
        const parts: Part[] = [
            fileToGenerativePart(image),
            { text: 'Perform a professional-grade skin retouching on this portrait. Smooth the skin texture, remove blemishes, acne, and minor imperfections. Reduce wrinkles subtly. Ensure the result looks natural and retains the subject\'s key features and skin tone.' }
        ];

        const response = await ai.models.generateContent({
            model: imageModel,
            contents: { parts },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        const candidate = response.candidates?.[0];
        if (candidate?.content?.parts) {
            for (const part of candidate.content.parts) {
                if (part.inlineData) {
                    return part.inlineData.data;
                }
            }
        }
        
        const finishReason = candidate?.finishReason;
        if (finishReason && finishReason !== 'STOP') {
            throw new Error(`Image retouching failed due to: ${finishReason}.`);
        }

        throw new Error("No image data found in the response for skin retouching.");
    } catch (error) {
        console.error("Gemini API error in retouchImage:", error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error("Failed to retouch image. Please check the console for details.");
    }
};

export const restoreImage = async (image: UploadedImage): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
    try {
        const parts: Part[] = [
            fileToGenerativePart(image),
            { text: 'Restore this old or damaged photo. Enhance clarity and detail, fix scratches, tears, or discoloration, improve colors and lighting, and reduce noise or grain. The goal is a clean, revitalized, and natural-looking version of the original image.' }
        ];

        const response = await ai.models.generateContent({
            model: imageModel,
            contents: { parts },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        const candidate = response.candidates?.[0];
        if (candidate?.content?.parts) {
            for (const part of candidate.content.parts) {
                if (part.inlineData) {
                    return part.inlineData.data;
                }
            }
        }
        
        const finishReason = candidate?.finishReason;
        if (finishReason && finishReason !== 'STOP') {
            throw new Error(`Image restoration failed due to: ${finishReason}.`);
        }

        throw new Error("No image data found in the response for image restoration.");
    } catch (error) {
        console.error("Gemini API error in restoreImage:", error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error("Failed to restore image. Please check the console for details.");
    }
};