const { Client, IntentsBitField } = require("discord.js");
require("dotenv").config();

// Create new client object
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

// console log when the client is logged in
client.on('ready', (c) => {
  console.log(`Bot '${c.user.tag}' is online`);
});

// Reply to any non-bot message 
client.on('messageCreate', (message) => {
  if (message.author.bot) {
    return;
  }
  message.reply("understood!");
  console.log(message);
});

// @TODO
client.on('interactionCreate', (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  console.log(interaction);
});

// login with the client to Discord
client.login(process.env.DISCORD_TOKEN);;
