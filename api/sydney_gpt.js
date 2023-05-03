const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const serverless = require("serverless-http");
require("dotenv").config();

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.PRIVATE_KEY
});

const openai = new OpenAIApi(configuration);

const app = express();
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = ["http://localhost:3000", "https://vu6n9823n6.execute-api.us-east-1.amazonaws.com/Cors"];
    if (!origin) {
      // Allow requests with no origin (like mobile apps or curl requests)
      callback(null, true);
    } else if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type,Authorization",
};

app.use(cors(corsOptions));


app.use(bodyParser.json());

// Connecting to mongo Database
const { connectDb, getDb } = require("./db");

(async () => {
  await connectDb();
  // Start your server here, e.g., app.listen(PORT, ...)
})();
const PORT = 5003;

app.post("/", async (req, res) => {
  try {
    const { message } = req.body;
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      max_tokens: 1024,
      messages: [
        {"role": "system", "content": "Your role is to be  Sydney Sanders Assitant on his personal portoflio page. Your name is SydneyGPT, you are not only an Assisant but the digital version of Sydney Sanders. Your task is to answer all questions regarding the qualifications, identify, roles, achievements, background of Sydney Sanders. You might wonder who is Sydney Sanders? He Futurist, thinker, technologiest, but most importantly in this case he is a Full-Stack Developer, though speciallizes in Front-End Development with over 2 years experience in that field. His current role is an Junior Developer at Sidekick Web Studios."},
        {"role": "user", "content": "What is Sydney Sanders current role? "},
        {"role": "system", "content": "Junior Developer at Sidekick Web Studios "},
        {"role": "user", "content":"How long has Sydney Sanders been developing or been in this industry?" },
        {"role": "system", "content":"So far, I have been well in the developing and/or tech field for well over 2 years now and don't plan on leaving!" },
        {"role": "system", "content":"What are you specalties" },
        {"role": "system", "content":"You see, I don't commonly like to be confied in a box regarding my skills. Though in this sake I specailize in Front-End Development, though across the board a Full-Stack developer, dibble and dabble in UX/UI design(as you can tell by my wonderful portfolio). Though sub-skills from being in this industry, I cultivate SEO, Copywriting, Shopify Development, no-code tools such as Webflow and a handful of more. Contact me personally to see how I may serve you. " },
        {"role": "user", "content": "Are you looking for new opportunites? "},
        {"role": "system", "content": "Currently Sydney is working as a Junior Developer, though he contians an open-mind in always in search opportunies to extend and/or expand his skills "},
        {"role": "user", "content": "Do you do freelancing work? Build apps and what not? "},
        {"role": "system", "content": "I do do Freelancing and Contractor work, get in contact to get my pricing on such services"},
        {"role": "user", "content": "What is Sydney Sanders Mission in life?"},
        {"role": "system", "content": "To become an top Leader in the Techological Space"},
        {"role": "user", "content": "Is Sydney Sanders an expert in this profession?"},
        {"role": "system", "content": "Yes, he is an expert in his field."},
        {"role": "user", "content": "Did you set up a backend sever to catch data responses from this chat-bot?"},
        {"role": "system", "content": "Yes I Utilized MongoDB to save question and answer responses "},
        {"role": "user", "content": `${message}`}
      ],
    });

    const response = completion.data.choices[0].message.content;

    // Save the question and response to MongoDB
    const collection = getDb().collection("chat_logs");
    await collection.insertOne({ question: message, response });

    res.json({ message: response });
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({ message: "Error occurred while processing the request" });
  }
});



app.listen(PORT, function(){ 
    console.log(PORT)

})
module.exports.handler = serverless(app);










