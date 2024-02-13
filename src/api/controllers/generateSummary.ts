const getSubtitles = require("youtube-captions-scraper").getSubtitles;
const OpenAI = require("openai");
const openai = new OpenAI();
const {examplePrompt} =require('../helpers/data/examplePrompt')
const {summary} = require('../helpers/data/summary')   
// const { Request, Response } = require("express"); 
import { Request, Response } from "express";

interface RequestBody {
    body:{
        videoId: string
    }
}

const generateSummary = async (req:RequestBody & Request , res:Response): Promise<void> => {

    try {
    const videoId = req.body.videoId;
    console.log("videoId", videoId);
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

  const shorterCaptionTrack: String = captionTrack
    .split(" ")
    .slice(0, 3000)
    .join(" ");


    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that summarizes youtube video transcripts and provide meaningful notes.",
        },
        { role: "user", content: `${examplePrompt}` },
        { role: "assistant", content: `${summary}` },
        { role: "user", content: `${shorterCaptionTrack}` },
      ],
      model: "gpt-3.5-turbo",
      // model: 'gpt-4',
    });

    const finalSummary = completion.choices[0].message.content;
    res.json({message: finalSummary} )

    console.log("summary", completion.choices[0].message.content);
  } catch (err) {
    console.error("Failed to generate summary", err);
  }


}

module.exports= generateSummary;