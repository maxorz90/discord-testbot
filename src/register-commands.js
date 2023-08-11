require('dotenv').config();
const { REST, Routes, ApplicationCommandOptionType } = require('discord.js');

const commands = [
  {
    name: 'add',
    description: 'adds two numbers.',
    options: [
      {
        name: 'first-number',
        description: 'The first number',
        type: ApplicationCommandOptionType.Number,
        choices: [
          {
            name: 'One',
            value: 1,
          },
          {
            name: 'Two',
            value: 2,
          }
        ],
        required: true,
      },
      {
        name: 'second-number',
        description: 'The second number',
        type: ApplicationCommandOptionType.Number,
        required: true,
      },
    ],
  },

  {
    name: 'embed',
    description: 'Create an embed',
  },
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.APP_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );
    console.log('Slash command were registered successfully');
  } catch (error) {
    console.log(`There was an error: ${error}`);
  }
})();
