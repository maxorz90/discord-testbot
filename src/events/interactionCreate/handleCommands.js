const { devs, testServer } = require('../../../config.json');
const getLocalCommands = require('../../utils/getLocalCommands.js');

module.exports = async (client, interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const localCommands = getLocalCommands();

  try {
    const commandObject = localCommands.find((cmd) => cmd.name === interaction.commandName);

    if (!commandObject) return;

    // Check if only developers are allowed to run the command.
    if (commandObject.devOnly) {
      if (!devs.includes(interaction.member.id)) {
        interaction.reply({
          content: 'Only developers are allowed to run this command',
          ephemeral: true,
        });
        return;
      }
    }

    // Check if only a test server is allowed to run this command
    if (commandObject.testOnly) {
      if (!(interaction.guild.id === testServer)) {
        interaction.reply({
          content: 'This command cannot be ran here',
          ephemeral: true,
        });
        return;
      }
    }

    // Check if the user has the required permissions (if they are needed)
    if (commandObject.permissionsRequired?.length) {
      for (const permission of commandObject.permissionsRequired) {
        if (!interaction.member.permissions.has(permission)) {
          interaction.reply({
            content: 'Not enough permissions.',
            ephemeral: true,
          });
          break;
        }
      }
    }

    // Check if the bot has the permissions required to handle the command 
    if (commandObject.botPermissions?.length) {
      for (const permission of commandObject.botPermissions) {
        const bot = interaction.guild.members.me;

        if (!bot.permissions.has(permission)) {
          interaction.reply({
            content: "I Don't have enough permissions",
            ephemeral: true,
          });
          break;
        }
      }
    }

    await commandObject.callback(client, interaction);

  } catch (error) {

    console.log(`There was an error runnig this command: ${error}`);

  }

}
