
import {
    GenerateContentConfig,
    HarmBlockThreshold,
    HarmCategory,
} from "@google/genai";
import { v2 as cloudinary } from "cloudinary";
import ai from "../DB/genai.js";



const stylePrompts = {
    "Bold & Graphic":
        "eye-catching thumbnail, bold typography, vibrant colors, expressive facial reaction, dramatic lighting, high contrast, click-worthy composition, professional style",

    "Tech/Futuristic":
        "futuristic thumbnail, sleek modern design, digital UI elements, glowing accents, holographic effects, cyber-tech aesthetic, sharp lighting, high-tech atmosphere",

    Minimalist:
        "minimalist thumbnail, clean layout, simple shapes, limited color palette, plenty of negative space, modern flat design, clear focal point",

    Photorealistic:
        "photorealistic thumbnail, ultra-realistic lighting, natural skin tones, candid moment, DSLR-style photography, lifestyle realism, shallow depth of field",

    Illustrated:
        "illustrated thumbnail, custom digital illustration, stylized characters, bold outlines, vibrant colors, creative cartoon or vector art style",
};

const colorSchemeDescriptions = {
    vibrant:
        "vibrant and energetic colors, high saturation, bold contrasts, eye-catching palette",

    sunset:
        "warm sunset tones, orange, pink and purple hues, soft gradients, cinematic glow",

    forest:
        "natural green tones, earthy colors, calm and organic palette, fresh atmosphere",

    neon: "neon glow effects, electric blues and pinks, cyberpunk lighting, high contrast glow",

    purple:
        "purple-dominant color palette, magenta and violet tones, modern and stylish mood",

    monochrome:
        "black and white color scheme, high contrast, dramatic lighting, timeless aesthetic",

    ocean:
        "cool blue and teal tones, aquatic color palette, fresh and clean atmosphere",

    pastel:
        "soft pastel colors, low saturation, gentle tones, calm and friendly aesthetic",
};

type GenerateThumbnailParams = {
    title: string;
    user_prompt: string;
    style: string;
    aspect_ratio: string;
    color_scheme: string;
    text_overlay: boolean;
};

export const generateThumbnailImage = async ({
    title,
    user_prompt,
    style,
    aspect_ratio,
    color_scheme,
    text_overlay,
}: GenerateThumbnailParams) => {

    const generationConfig: GenerateContentConfig = {
        maxOutputTokens: 32768,
        temperature: 1,
        topP: 0.95,
        responseModalities: ["IMAGE"],
        imageConfig: {
            aspectRatio: aspect_ratio,
            imageSize: "1K",
        },
        safetySettings: [
            {
                category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                threshold: HarmBlockThreshold.OFF,
            },
            {
                category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                threshold: HarmBlockThreshold.OFF,
            },
            {
                category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                threshold: HarmBlockThreshold.OFF,
            },
            {
                category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                threshold: HarmBlockThreshold.OFF,
            },
        ],
    };

    let prompt = `Create a ${stylePrompts[style as keyof typeof stylePrompts]
        } YouTube thumbnail for "${title}".`;

    prompt += ` Use a ${colorSchemeDescriptions[
        color_scheme as keyof typeof colorSchemeDescriptions
        ]
        } color scheme.`;

    if (user_prompt.trim()) {
        prompt += ` Additional details: ${user_prompt}.`;
    }

    if (text_overlay) {
        prompt += ` Include the text "${title}" prominently in the thumbnail.`;
    }

    prompt += ` The thumbnail should have an aspect ratio of ${aspect_ratio}.`;

    prompt +=
        " Make it highly engaging, visually stunning, professional, modern, and optimized for maximum YouTube click-through rate.";


    const response: any = await ai.models.generateContent({
        model: "gemini-3-pro-image",
        contents: [prompt],
        config: generationConfig,
    });

    const parts = response?.candidates?.[0]?.content?.parts;

    if (!parts) {
        throw new Error("Gemini returned an invalid response.");
    }

    let finalBuffer: Buffer | null = null;

    for (const part of parts) {
        if (part.inlineData?.data) {
            finalBuffer = Buffer.from(part.inlineData.data, "base64");
            break;
        }
    }

    if (!finalBuffer) {
        throw new Error("No image was returned by Gemini.");
    }

    const uploadResult: any = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "thumbnails",
                resource_type: "image",
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            },
        );

        stream.end(finalBuffer);
    });
    return {
        image_url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
        prompt_used: prompt,
    };
};
