import { Request, Response } from "express";
import express from "express";
import { Client, GatewayIntentBits, PresenceStatusData } from "discord.js";
import { Bot } from "./structs/Bot";



// Bot launch

const app = express();
const PORT = 3000;

export const bot = new Bot(
  new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.DirectMessages
    ]
  })
);

app.use(express.static("public"));
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, world!");
});

app.get("/uptime", (req: Request, res: Response) => {
  const uptime = process.uptime();
  res.send(`Bot uptime: ${uptime} seconds`);
});

app.listen(PORT, () => {
  console.log(`Bot is listening on port ${PORT}`);

  // Check if bot is ready
  bot.client.once("ready", () => {
    console.log("Bot is ready!");

    // Set bot status
    bot.setBotStatus("online"); // Change status to "online"

    
       // Set bot status
    bot.client.user?.setActivity("/help");

    // Set interval to check bot status every 5 minutes
    setInterval(() => {
      if (bot.client.ws.status !== 0) {
        console.error(`Bot is down: ${bot.client.ws.status}`);
        bot.setBotStatus("invisible"); // Change status to "invisible"
      } else {
        bot.setBotStatus("online"); // Change status to "online"
      }
    }, 300000);
  });
});
