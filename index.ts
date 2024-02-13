
const express = require('express')
const app = express()
const { databaseConnection } = require('./config/database')

require('dotenv').config()
databaseConnection(process.env.URL,()=>{
    console.log("mongodb connected....")
})

app.listen(4000,()=>{
    console.log("server listening on 4000")
})

const getSubtitles = require("youtube-captions-scraper").getSubtitles;
const OpenAI = require("openai");
const openai = new OpenAI();
const { examplePrompt } = require("./data/examplePrompt");
const { summary } = require("./data/summary");

const extractSubtitles = async () => {
  let captionTrack = "";
  const captions = await getSubtitles({
    videoID: "-mDcL314lFI", // youtube video id
    lang: "en", // default: `en`
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

  try {
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

    console.log("summary", completion.choices[0].message.content);
  } catch (err) {
    console.error("Failed to generate summary", err);
  }
};

extractSubtitles();

