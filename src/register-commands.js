require('dotenv').config();
const { REST, Routes } = require('discord.js');

const commands = [
  {
    name: 'hey',
    desription: 'Replies is hey',
  },
];

const rest = new REST({ version: '10'}).setToken(process.env.TOKEN);

(async () => {
  try {

  } catch (error) {
    console.log(`There was an error: ${error}`);
  }
})();