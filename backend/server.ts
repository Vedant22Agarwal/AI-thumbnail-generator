import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import connectDB from "./src/DB/index.js";
import session from "express-session";
import MongoStore from "connect-mongo";
declare module "express-session" {
  interface SessionData {
    isLoggedIn: Boolean;
    userId: String;
  }
}

await connectDB();
const app = express();

app.set("trust proxy", 1);

// Middleware
const allowedOrigins = [process.env.FRONTEND_URL!].filter(Boolean);
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
      secure: true,
      sameSite: "none",
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI as string,
      collectionName: "sessions",
    }),
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Server is Live!");
});

import userRoute from "./src/routes/user.routes.js";
import thumbnailRoute from './src/routes/thumbnail.routes.js';
app.use("/api/users",userRoute);
app.use("/api/thumbnails",thumbnailRoute);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});


