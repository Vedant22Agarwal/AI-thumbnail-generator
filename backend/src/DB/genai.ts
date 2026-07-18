import { GoogleGenAI } from "@google/genai";

// const ai = new GoogleGenAI({
//     vertexai: true,
//     project: process.env.GOOGLE_CLOUD_PROJECT!,
//     location: "global",
// });
const ai = new GoogleGenAI({
  vertexai: true,
  project: process.env.GOOGLE_CLOUD_PROJECT!,
  location: "global",
  googleAuthOptions: {
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL!,
      private_key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
    },
  },
});

export default ai;

