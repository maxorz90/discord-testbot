const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
	name: "timestampify",
	description: "generate a timestamp to use in messages.",
	testOnly: false,
	devOnly: false,
	deleted: false,

	options: [
		{
			name: "date",
			description: "The date you want a timestamp for. Format: dd/mm/yyyy",
			required: true,
			type: ApplicationCommandOptionType.String,
		},
		{
			name: "server-time",
			description:
				"The time you want a timestamp for, based on Server Time. Format: hh:mm",
			required: true,
			type: ApplicationCommandOptionType.String,
		},
	],

	callback: async (client, interaction) => {
		await interaction.deferReply({ ephemeral: true });

		const inputDate = interaction.options.get("date").value;
		const inputTime = interaction.options.get("server-time").value;

		const dateParts = inputDate.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
		if (!dateParts) {
			await interaction.editReply("Invalid date format. Use dd/mm/yyyy.");
			return;
		}

		const timeParts = inputTime.match(/^(\d{2}):(\d{2})$/);
		if (!timeParts) {
			await interaction.editReply("Invalid time format. Use hh:mm");
		}

		const day = parseInt(dateParts[1], 10);
		const month = parseInt(dateParts[2], 10) - 1; // Month is zero-based
		const year = parseInt(dateParts[3], 10);

		const hours = parseInt(timeParts[1], 10);
		const minutes = parseInt(timeParts[2], 10);

		const date = new Date(Date.UTC(year, month, day, hours, minutes));

		const timestamp = date.getTime() / 1000;

		await interaction.editReply(`Date: ${inputDate}, time: ${inputTime}\nTimestamps: 
        \\<t:${timestamp}> = <t:${timestamp}>\n
        \\<t:${timestamp}:t> = <t:${timestamp}:t>\n
        \\<t:${timestamp}:T> = <t:${timestamp}:T>\n
        \\<t:${timestamp}:d> = <t:${timestamp}:d>\n
        \\<t:${timestamp}:D> = <t:${timestamp}:D>\n
        \\<t:${timestamp}:f> = <t:${timestamp}:f>\n
        \\<t:${timestamp}:F> = <t:${timestamp}:F>\n
        \\<t:${timestamp}:R> = <t:${timestamp}:R>
      `);
	},
};
