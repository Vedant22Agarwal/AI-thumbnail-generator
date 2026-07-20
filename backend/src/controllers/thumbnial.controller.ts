import { Request, Response } from "express";
import Thumbnail from "../models/thumbnail.models.js";
import {
  GenerateContentConfig,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/genai";
import ai from "../DB/genai.js";
import { v2 as cloudinary } from "cloudinary";
import { generateThumbnailImage } from "../utils/generateThumbnailImage.js";

// const stylePrompts = {
//   "Bold & Graphic":
//     "eye-catching thumbnail, bold typography, vibrant colors, expressive facial reaction, dramatic lighting, high contrast, click-worthy composition, professional style",

//   "Tech/Futuristic":
//     "futuristic thumbnail, sleek modern design, digital UI elements, glowing accents, holographic effects, cyber-tech aesthetic, sharp lighting, high-tech atmosphere",

//   Minimalist:
//     "minimalist thumbnail, clean layout, simple shapes, limited color palette, plenty of negative space, modern flat design, clear focal point",

//   Photorealistic:
//     "photorealistic thumbnail, ultra-realistic lighting, natural skin tones, candid moment, DSLR-style photography, lifestyle realism, shallow depth of field",

//   Illustrated:
//     "illustrated thumbnail, custom digital illustration, stylized characters, bold outlines, vibrant colors, creative cartoon or vector art style",
// };

// const colorSchemeDescriptions = {
//   vibrant:
//     "vibrant and energetic colors, high saturation, bold contrasts, eye-catching palette",

//   sunset:
//     "warm sunset tones, orange, pink and purple hues, soft gradients, cinematic glow",

//   forest:
//     "natural green tones, earthy colors, calm and organic palette, fresh atmosphere",

//   neon: "neon glow effects, electric blues and pinks, cyberpunk lighting, high contrast glow",

//   purple:
//     "purple-dominant color palette, magenta and violet tones, modern and stylish mood",

//   monochrome:
//     "black and white color scheme, high contrast, dramatic lighting, timeless aesthetic",

//   ocean:
//     "cool blue and teal tones, aquatic color palette, fresh and clean atmosphere",

//   pastel:
//     "soft pastel colors, low saturation, gentle tones, calm and friendly aesthetic",
// };
export const generateThumbnail = async (
  req: Request,
  res: Response,
): Promise<Response | void> => {
  let thumbnail: any = null;

  try {
    const { userId } = req.session;

    const {
      title,
      prompt: user_prompt = "",
      style,
      aspect_ratio = "16:9",
      color_scheme,
      text_overlay = true,
    } = req.body;

    if (!title || !style || !color_scheme) {
      return res.status(400).json({
        message: "Title, style and color scheme are required.",
      });
    }

    thumbnail = await Thumbnail.create({
      userId,
      title,
      prompt_used: "",
      user_prompt,
      style,
      aspect_ratio,
      color_scheme,
      text_overlay,
      isGenerating: true,
    });

    // const generationConfig: GenerateContentConfig = {
    //   maxOutputTokens: 32768,
    //   temperature: 1,
    //   topP: 0.95,
    //   responseModalities: ["IMAGE"],
    //   imageConfig: {
    //     aspectRatio: aspect_ratio,
    //     imageSize: "1K",
    //   },
    //   safetySettings: [
    //     {
    //       category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    //       threshold: HarmBlockThreshold.OFF,
    //     },
    //     {
    //       category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    //       threshold: HarmBlockThreshold.OFF,
    //     },
    //     {
    //       category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    //       threshold: HarmBlockThreshold.OFF,
    //     },
    //     {
    //       category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    //       threshold: HarmBlockThreshold.OFF,
    //     },
    //   ],
    // };

    // let prompt = `Create a ${
    //   stylePrompts[style as keyof typeof stylePrompts]
    // } YouTube thumbnail for "${title}".`;

    // prompt += ` Use a ${
    //   colorSchemeDescriptions[
    //     color_scheme as keyof typeof colorSchemeDescriptions
    //   ]
    // } color scheme.`;

    // if (user_prompt.trim()) {
    //   prompt += ` Additional details: ${user_prompt}.`;
    // }

    // if (text_overlay) {
    //   prompt += ` Include the text "${title}" prominently in the thumbnail.`;
    // }

    // prompt += ` The thumbnail should have an aspect ratio of ${aspect_ratio}.`;

    // prompt +=
    //   " Make it highly engaging, visually stunning, professional, modern, and optimized for maximum YouTube click-through rate.";

    // thumbnail.prompt_used = prompt;
    // await thumbnail.save();

    // const response: any = await ai.models.generateContent({
    //   model: "gemini-3-pro-image",
    //   contents: [prompt],
    //   config: generationConfig,
    // });

    // const parts = response?.candidates?.[0]?.content?.parts;

    // if (!parts) {
    //   throw new Error("Gemini returned an invalid response.");
    // }

    // let finalBuffer: Buffer | null = null;

    // for (const part of parts) {
    //   if (part.inlineData?.data) {
    //     finalBuffer = Buffer.from(part.inlineData.data, "base64");
    //     break;
    //   }
    // }

    // if (!finalBuffer) {
    //   throw new Error("No image was returned by Gemini.");
    // }

    // const uploadResult: any = await new Promise((resolve, reject) => {
    //   const stream = cloudinary.uploader.upload_stream(
    //     {
    //       folder: "thumbnails",
    //       resource_type: "image",
    //     },
    //     (error, result) => {
    //       if (error) return reject(error);
    //       resolve(result);
    //     },
    //   );

    //   stream.end(finalBuffer);
    // });

    // thumbnail.image_url = uploadResult.secure_url;
    // thumbnail.public_id = uploadResult.public_id;
    // thumbnail.isGenerating = false;

    // await thumbnail.save();

    const result = await generateThumbnailImage({
      title,
      user_prompt,
      style,
      aspect_ratio,
      color_scheme,
      text_overlay,
    });

    thumbnail.prompt_used = result.prompt_used;
    thumbnail.image_url = result.image_url;
    thumbnail.public_id = result.public_id;
    thumbnail.isGenerating = false;

    await thumbnail.save();

    return res.status(201).json({
      message: "Thumbnail generated successfully.",
      thumbnail,
    });
  } catch (error: any) {
    console.error(error);

    if (thumbnail) {
      try {
        thumbnail.isGenerating = false;
        await thumbnail.save();
      } catch { }
    }

    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

/* ============================================================
   UPDATE THUMBNAIL
============================================================ */

export const updateThumbnail = async (
  req: Request,
  res: Response,
): Promise<Response | void> => {
  let thumbnail: any = null;

  try {
    const { id } = req.params;
    const { userId } = req.session;

    thumbnail = await Thumbnail.findOne({
      _id: id,
      userId,
    });

    if (!thumbnail) {
      return res.status(404).json({
        message: "Thumbnail not found.",
      });
    }

    const {
      title,
      prompt: user_prompt = "",
      style,
      aspect_ratio = "16:9",
      color_scheme,
      text_overlay = true,
    } = req.body;

    if (!title || !style || !color_scheme) {
      return res.status(400).json({
        message: "Title, style and color scheme are required.",
      });
    }

    // Show loading state while regenerating
    thumbnail.isGenerating = true;
    await thumbnail.save();

    // Generate new thumbnail
    const result = await generateThumbnailImage({
      title,
      user_prompt,
      style,
      aspect_ratio,
      color_scheme,
      text_overlay,
    });

    // Delete previous Cloudinary image
    if (thumbnail.public_id) {
      await cloudinary.uploader.destroy(thumbnail.public_id);
    }

    // Update thumbnail document
    thumbnail.title = title;
    thumbnail.user_prompt = user_prompt;
    thumbnail.style = style;
    thumbnail.aspect_ratio = aspect_ratio;
    thumbnail.color_scheme = color_scheme;
    thumbnail.text_overlay = text_overlay;

    thumbnail.prompt_used = result.prompt_used;
    thumbnail.image_url = result.image_url;
    thumbnail.public_id = result.public_id;
    thumbnail.isGenerating = false;

    await thumbnail.save();

    return res.status(200).json({
      message: "Thumbnail updated successfully.",
      thumbnail,
    });
  } catch (error: any) {
    console.error(error);

    // Prevent thumbnail from getting stuck in generating state
    if (thumbnail) {
      try {
        thumbnail.isGenerating = false;
        await thumbnail.save();
      } catch {}
    }

    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

/* ============================================================
   DELETE THUMBNAIL
============================================================ */

export const deleteThumbnail = async (
  req: Request,
  res: Response,
): Promise<Response | void> => {
  try {
    const { id } = req.params;
    const { userId } = req.session;

    const thumbnail = await Thumbnail.findOne({
      _id: id,
      userId,
    });

    if (!thumbnail) {
      return res.status(404).json({
        message: "Thumbnail not found.",
      });
    }

    // Delete image from Cloudinary
    if (thumbnail.public_id) {
      await cloudinary.uploader.destroy(thumbnail.public_id);
    }

    // Delete document from MongoDB
    await thumbnail.deleteOne();

    return res.status(200).json({
      message: "Thumbnail deleted successfully.",
    });
  } catch (error: any) {
    console.error(error);

    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

/* ============================================================
   GET ALL THUMBNAILS
============================================================ */

export const getAllThumbnail = async (
  req: Request,
  res: Response,
): Promise<Response | void> => {
  try {
    const { userId } = req.session;

    const thumbnails = await Thumbnail.find({
      userId,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      count: thumbnails.length,
      thumbnails,
    });
  } catch (error: any) {
    console.error(error);

    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

/* ============================================================
   GET SINGLE THUMBNAIL
============================================================ */

export const getSingleThumbnail = async (
  req: Request,
  res: Response,
): Promise<Response | void> => {
  try {
    const { id } = req.params;
    const { userId } = req.session;

    const thumbnail = await Thumbnail.findOne({
      _id: id,
      userId,
    });

    if (!thumbnail) {
      return res.status(404).json({
        message: "Thumbnail not found.",
      });
    }

    return res.status(200).json({
      thumbnail,
    });
  } catch (error: any) {
    console.error(error);

    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};
