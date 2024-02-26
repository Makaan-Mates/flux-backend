// @ts-ignore
import { getSubtitles } from "youtube-captions-scraper";
import OpenAI from "openai";
const openai = new OpenAI();
import { examplePrompt } from "../helpers/data/examplePrompt.js";
import { summary } from "../helpers/data/summary.js";
import { Request, Response } from "express";
import Notes from "../models/notes.model.js";
import User from "../models/user.model.js";
// @ts-ignore
import getYoutubeTitle from "get-youtube-title";

interface RequestBody {
  body: {
    videoId: string;
  };
}

const generateSummary = async (
  req: RequestBody & Request,
  res: Response
): Promise<void> => {
  try {
    const videoId = req.body.videoId;
    console.log("videoId", videoId);

    const email = req.body.email;
    const user = await User.findOne({ email: email });

    // console.log("userId", user);

    const notesExist = await Notes.findOne({
      videoId: videoId,
      authorId: user?._id,
    });
    if (notesExist) {
      res.json({ message: notesExist });
      return;
    }

    const title = await new Promise((resolve, reject) => {
      getYoutubeTitle(videoId.toString(), (err: any, title: string) => {
        if (err) {
          reject(err);
        } else {
          resolve(title);
        }
      });
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

    console.log(captionTrack.split(" ").length);

    const shorterCaptionTrack: String = captionTrack
      .split(" ")
      .slice(0, 3000)
      .join(" ");

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that summarizes youtube video transcripts and provide meaningful notes in bullet points. Be little creative while making notes, make sure the reader enjoys and understands them well and give bullet points for each notes that are descriptive, and don't use the word transcript in the notes instead use videos for referring to the content. Also, make sure the notes are detailed and long and not too short.",
        },
        { role: "user", content: `${examplePrompt}` },
        { role: "assistant", content: `${summary}` },
        { role: "user", content: `${shorterCaptionTrack}` },
      ],
      model: "gpt-3.5-turbo",
    });

    const finalSummary = completion.choices[0].message.content;

    const newFlux = new Notes({
      title: title,
      description: finalSummary,
      videoId: videoId,
      authorId: user?._id,
    });

    await newFlux.save();
    res.json({ message: finalSummary });
  } catch (err) {
    console.error("Failed to generate summary", err);
  }
};

export default generateSummary;
