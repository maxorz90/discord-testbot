const { Interaction, Client, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');

module.exports = {
  deleted: false,
  name: 'kick',
  description: 'Strikes down the kickhammer on some poor fool (which I pity)!',
  // devOnly: Boolean,
  // testOnly: Boolean,
  options: [
    {
      name: 'target-user',
      description: 'The user to kick.',
      required: true,
      type: ApplicationCommandOptionType.Mentionable,
    },
    {
      name: 'reason',
      description: 'The reason for kicking.',
      type: ApplicationCommandOptionType.String,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.KickMembers],
  botPermissions: [PermissionFlagsBits.KickMembers],

  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */

  callback: async (client, interaction) => {
    const targetUserId = interaction.options.get('target-user').value;
    const reason = interaction.options.get('reason')?.value || 'no reason provided';

    await interaction.deferReply();
    const targetUser = await interaction.guild.members.fetch(targetUserId);

    if (!targetUser) {
      await interaction.editReply("That user doesn't exist in this server.");
      return;
    }

    if (targetUser.id === interaction.guild.ownerId) {
      await interaction.editReply("That user is the owner of the server dummy!")
      return;
    }

    const targetUserRolePosition = targetUser.roles.highest.position; // Highest role of the target user
    const requestUserRolePosition = interaction.member.roles.highest.position; //Highest role of the user running the command
    const botRolePosition = interaction.guild.members.me.roles.highest.position; // Highest role of the bot

    if (targetUserRolePosition >= requestUserRolePosition) {
      await interaction.editReply("You can't kick that user, because they have the same or higher privliges as you.");
      return;
    }

    if (targetUserRolePosition >= botRolePosition) {
      await interaction.editReply("I can't kick that user, because they have the same or higher privliges as me.");
      return;
    }

    // kick the user.
    try {
      await targetUser.kick(reason);
      await interaction.editReply(`User ${targetUser} was succesfully kicked\nReason: ${reason}`);
    } catch (error) {
      console.log(`There was an error with the kick command: ${error}`);
    }

  },
};

