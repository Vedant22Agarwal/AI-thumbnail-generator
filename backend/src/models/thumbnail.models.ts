import mongoose, { Schema, model } from "mongoose";

const ThumbnailSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    style: {
      type: String,
      enum: [
        "Bold & Graphic",
        "Tech/Futuristic",
        "Minimalist",
        "Photorealistic",
        "Illustrated",
      ],
      required: true,
    },
    aspect_ratio: {
      type: String,
      enum: ["16:9", "1:1", "9:16"],
      default: "16:9",
    },
    color_scheme: {
      type: String,
      enum: [
        "vibrant",
        "sunset",
        "forest",
        "neon",
        "purple",
        "monochrome",
        "ocean",
        "pastel",
      ],
    },
    text_overlay: {
      type: Boolean,
      default: false,
    },
    image_url: {
      type: String,
      default: "",
    },
    public_id: {
      type: String,
      default: "",
    },
    prompt_used: {
      type: String,
    },
    user_prompt: {
      type: String,
    },
    isGenerating: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export type IThumbnail = mongoose.InferSchemaType<typeof ThumbnailSchema>;

const Thumbnail =
  mongoose.models.Thumbnail || model<IThumbnail>("Thumbnail", ThumbnailSchema);

export default Thumbnail;