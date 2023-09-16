const { Interaction, Client, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');

module.exports = {
  deleted: true,
  name: 'ban',
  description: 'Strikes down the banhammer on some poor fool (which I pity)!',
  // devOnly: Boolean,
  // testOnly: Boolean,
  options: [
    {
      name: 'target-user',
      description: 'The user to ban.',
      required: true,
      type: ApplicationCommandOptionType.Mentionable,
    },
    {
      name: 'reason',
      description: 'The reason for banning.',
      type: ApplicationCommandOptionType.String,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.BanMembers],
  botPermissions: [PermissionFlagsBits.BanMembers],

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
      await interaction.editReply("You can't ban that user, because they have the same or higher privliges as you.");
      return;
    }

    if (targetUserRolePosition >= botRolePosition) {
      await interaction.editReply("I can't ban that user, because they have the same or higher privliges as me.");
      return;
    }

    // Ban the user.
    try {
      await targetUser.ban({ reason });
      await interaction.editReply(`User ${targetUser} was succesfully banned\nReason: ${reason}`);
    } catch (error) {
      console.log(`There was an error with the ban command: ${error}`);
    }

  },
};
