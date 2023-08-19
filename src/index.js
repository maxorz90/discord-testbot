const { Client, IntentsBitField, EmbedBuilder, ActivityType } = require("discord.js");
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

  client.user.setActivity({
    name: "Testing operational parameters",
    type: ActivityType.Watching,
  })
});

// Reply to any non-bot message 
client.on('messageCreate', (message) => {
  if (message.author.bot) {
    return;
  }
  message.reply("understood!");
  console.log(message);
});

// Slash commands 
client.on('interactionCreate', async (interaction) => {
  try {
    // Simple command to make a simple addition
    if (interaction.commandName === 'add') {
      const num1 = interaction.options.get('first-number').value;
      const num2 = interaction.options.get('second-number').value;

      await interaction.reply(`The sum is ${num1 + num2}`);
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

      await interaction.reply({ embeds: [embed] });
    }

    await interaction.deferReply({ ephemeral: true });

    const role = interaction.guild.roles.cache.get(interaction.customId);
    if (!role) {
      interaction.reply({
        content: 'I could not find the role',
      })
      return;
    }

    const hasRole = interaction.member.roles.cache.has(role.id);
    if (hasRole) {
      await interaction.member.roles.remove(role);
      await interaction.editReply(`The role ${role} has been removed.`);
    } else {
      await interaction.member.roles.add(role);
      await interaction.editReply(`The role ${role} has been added to your account`);
    }

    console.log(interaction.commandName);

  } catch (error) {
    console.log(error);
  }
})

// login with the client to Discord
client.login(process.env.DISCORD_TOKEN);
