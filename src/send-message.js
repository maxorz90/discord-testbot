const { Client, IntentsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
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

const roles = [
  {
    id: '1139630887923875911',
    label: 'Master'
  },
  {
    id: '1139630987513446492',
    label: 'Regular'
  },
  {
    id: '1139631073601523762',
    label: 'Guest'
  },
];

// console log when the client is logged in
client.on('ready', async (c) => {
  try {
    const channel = await client.channels.cache.get('1138892560304177164');
    if (!channel) return;
    const row = new ActionRowBuilder();

    roles.forEach((role) => {
      row.components.push(
        new ButtonBuilder()
          .setCustomId(role.id)
          .setLabel(role.label)
          .setStyle(ButtonStyle.Primary)
      )
    });

    await channel.send({
      content: 'Claim or remove your roles below:',
      components: [row],
    });
    process.exit();

  } catch (error) {
    console.log(error);
  }
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

  // Simple command to make a simple addition
  if (interaction.commandName === 'add') {
    const num1 = interaction.options.get('first-number').value;
    const num2 = interaction.options.get('second-number').value;

    interaction.reply(`The sum is ${num1 + num2}`);
  }

  // Simple embed example
  if (interaction.commandName === 'embed') {
    const embed = new EmbedBuilder()
      .setTitle('This is a title yo!')
      .setDescription('This is a description')
      .setColor(0xFF0000)
      .addFields({
        name: 'additional field',
        value: 'just some text',
      });

    interaction.reply({ embeds: [embed] });
  }

  console.log(interaction.commandName);
});

// login with the client to Discord
client.login(process.env.DISCORD_TOKEN);;
