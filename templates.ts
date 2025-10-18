import React from 'react';
import type { DesignTemplate } from './types';

// FIX: Replaced JSX with React.createElement because JSX syntax is not allowed in .ts files.
const PosterIcon: React.FC<{ className?: string }> = ({ className }) => (
    React.createElement('svg', {
        xmlns: "http://www.w3.org/2000/svg",
        className,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round"
    },
        React.createElement('path', { d: "M4.5 3h15A1.5 1.5 0 0 1 21 4.5v15A1.5 1.5 0 0 1 19.5 21h-15A1.5 1.5 0 0 1 3 19.5v-15A1.5 1.5 0 0 1 4.5 3z" }),
        React.createElement('path', { d: "M8 9h8" }),
        React.createElement('path', { d: "M8 12h8" }),
        React.createElement('path', { d: "M8 15h5" })
    )
);

// FIX: Replaced JSX with React.createElement because JSX syntax is not allowed in .ts files.
const FlyerIcon: React.FC<{ className?: string }> = ({ className }) => (
    React.createElement('svg', {
        xmlns: "http://www.w3.org/2000/svg",
        className,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round"
    },
        React.createElement('path', { d: "M11.7 13.5c-1.7 1.7-4.6 1.7-6.3 0s-1.7-4.6 0-6.3 4.6-1.7 6.3 0" }),
        React.createElement('path', { d: "M13 19.5V11l8.5-8.5" })
    )
);

// FIX: Replaced JSX with React.createElement because JSX syntax is not allowed in .ts files.
const BannerIcon: React.FC<{ className?: string }> = ({ className }) => (
    React.createElement('svg', {
        xmlns: "http://www.w3.org/2000/svg",
        className,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round"
    },
        React.createElement('rect', { x: "3", y: "6", width: "18", height: "12", rx: "2" }),
        React.createElement('path', { d: "M8 12h8" })
    )
);

// FIX: Replaced JSX with React.createElement because JSX syntax is not allowed in .ts files.
const BrochureIcon: React.FC<{ className?: string }> = ({ className }) => (
    React.createElement('svg', {
        xmlns: "http://www.w3.org/2000/svg",
        className,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round"
    },
        React.createElement('path', { d: "M3 3v18h18" }),
        React.createElement('path', { d: "M7 3v18" }),
        React.createElement('path', { d: "M12 3v18" }),
        React.createElement('path', { d: "M17 3v18" })
    )
);


export const templates: DesignTemplate[] = [
    {
        name: 'Poster',
        icon: PosterIcon,
        aspectRatio: '9:16',
        prompt: `Act as a professional graphic designer. Create an event poster for '[EVENT TITLE]'.

Theme: [Describe the theme, e.g., "modern tech conference", "summer music festival"].

Key Information to include:
- Date: [Date]
- Time: [Time]
- Location: [Venue/Address]
- Website: [URL]

AI Instructions:
- **Visuals**: If an image is provided by the user, feature it prominently and professionally. If not, generate a compelling, relevant graphic.
- **Layout**: Propose a clean, modern layout. Ensure text is legible.
- **Typography**: Select a professional and thematic font pairing.
- **Color Palette**: Generate a suitable color palette that matches the theme.`
    },
    {
        name: 'Flyer',
        icon: FlyerIcon,
        aspectRatio: '9:16',
        prompt: `Act as a professional graphic designer. Design an A5 flyer for '[BUSINESS/PRODUCT NAME]'.

Purpose: [e.g., "promoting a new product", "announcing a sale"].

Headline: [Catchy Headline]
Key Features:
- [Feature 1]
- [Feature 2]
- [Feature 3]
Call to Action: [e.g., "Visit Us Today!", "Scan for 20% Off!"]
Contact: [Website/Phone]

AI Instructions:
- **Visuals**: If the user uploads an image (e.g., a product photo), make it the centerpiece of the flyer. Otherwise, create a high-quality graphic that represents the business/product.
- **Branding**: The style should be [Describe brand style, e.g., "luxurious and minimal", "friendly and vibrant"].
- **Typography & Colors**: Choose fonts and a color scheme that align with the described branding.
- **Layout**: Arrange all elements for maximum impact and readability.`
    },
    {
        name: 'Web Banner',
        icon: BannerIcon,
        aspectRatio: '16:9',
        prompt: `Act as a professional graphic designer. Generate a wide web banner for a '[WEBSITE/CAMPAIGN NAME]'.

Headline: [Main Message, e.g., "Grand Opening Sale!"]
Sub-headline: [Secondary message, e.g., "Up to 50% Off Everything"]
Call to Action Button Text: [e.g., "Shop Now", "Learn More"]

AI Instructions:
- **Visuals**: If an image is provided, integrate it beautifully into the banner layout. If not, create a dynamic, abstract, or illustrative background that fits the campaign.
- **Style**: The banner should be clean, uncluttered, and professional.
- **Color Scheme**: Propose a color scheme that is both eye-catching and on-brand for [e.g., "a tech startup", "a fashion retailer"].
- **Composition**: Ensure there is a clear focal point and the call to action is highly visible.`
    },
    {
        name: 'Brochure',
        icon: BrochureIcon,
        aspectRatio: '9:16',
        prompt: `Act as a professional graphic designer. Design the front cover for a tri-fold brochure for '[COMPANY NAME]'.

Title: [Brochure Title, e.g., "Our Services", "Welcome Guide"]
Tagline: [Short, engaging tagline]

AI Instructions:
- **Key Visual**: If the user provides an image, use it as the main visual for the cover. Otherwise, generate an elegant and professional graphic or photo that represents the company's field (e.g., "real estate", "finance", "technology").
- **Branding**: The overall feel should be [e.g., "professional and trustworthy", "creative and inspiring"]. Use this to inform your choice of colors and fonts.
- **Layout**: Design a compelling cover layout that invites people to open the brochure. Leave a designated space for a company logo to be added later.`
    }
];