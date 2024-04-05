// @ts-ignore
import { getSubtitles } from "youtube-captions-scraper";
import OpenAI from "openai";
import { examplePrompt } from "../helpers/data/examplePrompt.js";
import { summary } from "../helpers/data/summary.js";
import { Request, Response } from "express";
import Notes from "../models/notes.model.js";
import User from "../models/user.model.js";
import dotenv from "dotenv";
dotenv.config();
import axios from "axios";
import CryptoJS from "crypto-js";

const YT_apiKey = process.env.YOUTUBE_API_KEY;

interface RequestBody {
  body: {
    videoId: string;
  };
}

const decryptKey = (encryptedKey: string): string => {
  const secretPassphrase = process.env.SECRET_PASSPHRASE;
  if (!secretPassphrase) {
    throw new Error("Decryption passphrase not set");
  }
  const bytes = CryptoJS.AES.decrypt(encryptedKey, secretPassphrase);
  const originalKey = bytes.toString(CryptoJS.enc.Utf8);
  return originalKey;
};

const generateSummary = async (
  req: RequestBody & Request,
  res: Response
): Promise<void> => {
  try {
    const videoId = req.body.videoId;
    const email = req.body.email;
    const user = await User.findOne({ email: email });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const notesExist = await Notes.findOne({
      videoId: videoId,
      authorId: user?._id,
    });
    if (notesExist) {
      res.json({ message: notesExist });
      return;
    }

    const title = await axios
      .get(
        `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet&key=${YT_apiKey}`
      )
      .then((response) => {
        const title = response.data.items[0].snippet.title;
        return title;
      })
      .catch((error) => {
        console.error("Error fetching video title:", error);
      });

    let captionTrack = "";
    const captions = await getSubtitles({
      videoID: videoId,
      lang: "en",
    });

    // console.log(captions);

    interface Caption {
      text: string;
    }

    captions.forEach((caption: Caption) => {
      captionTrack += caption.text + " ";
    });

    let gptModel = "gpt-3.5-turbo";
    const gptModelWordLimits: { [key: string]: number } = {
      "gpt-3.5-turbo": 3000,
      "gpt-4": 6500,
    };

    if (user.customGPTModel) {
      gptModel = user.customGPTModel;
      console.log("customModel", gptModel);
    }
    console.log("gptModel", gptModel);

    const maxWords = gptModelWordLimits[gptModel] || 3000;
    console.log(maxWords);

    const shorterCaptionTrack: String = captionTrack
      .split(" ")
      .slice(0, maxWords)
      .join(" ");

    let openaiApiKey = process.env.OPENAI_API_KEY;

    if (user.customOpenAIkey) {
      const decryptedOpenAIKey = decryptKey(user.customOpenAIkey);
      openaiApiKey = decryptedOpenAIKey;
    }

    const openai = new OpenAI({
      apiKey: openaiApiKey,
    });

    // console.log("openai", openai);

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that summarizes coding YouTube videos. Your task is to extract key concepts, explain them clearly, and provide relevant code examples in markdown format. Be creative and ensure the notes are engaging, detailed, and include bullet points for clarity. Avoid using the word 'transcript' and refer to the content as 'video'. Emphasize code examples by presenting them in code blocks to enhance readability and practical understanding.",
        },
        { role: "user", content: `${examplePrompt}` },
        { role: "assistant", content: `${summary}` },
        { role: "user", content: `${shorterCaptionTrack}` },
      ],
      model: `${gptModel}`,
    });

    const finalSummary = completion.choices[0].message.content;
    // console.log("finalSummary", finalSummary);

    const newFlux = new Notes({
      title: title,
      description: finalSummary,
      videoId: videoId,
      authorId: user?._id,
    });

    await newFlux.save();
    res.json({ message: finalSummary });
    // console.log(finalSummary?.toString())
  } catch (err) {
    console.error("Failed to generate flux.", err);
    res.status(201).json({ message: err });
  }
};

export default generateSummary;
