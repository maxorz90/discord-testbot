const { testServer } = require('../../../config.json');
const getApplicationCommands = require('../../utils/getApplicationCommands');
const getLocalCommands = require('../../utils/getLocalCommands')
const areCommandsDifferent = require('../../utils/areCommandsDifferent')

module.exports = async (client) => {
  const localCommands = getLocalCommands();

  try {
    const localCommands = getLocalCommands();
    const applicationCommands = await getApplicationCommands(client, testServer);

    for (const localCommand of localCommands) {
      const { name, desciption, options } = localCommand;
      const existingCommand = await applicationCommands.cache.find(
        (cmd) => cmd.name === name
      );

      if (existingCommand) {
        if (localCommand.deleted) {
          await applicationCommands.delete(existingCommand.id)
          console.log(`Deleted command "${name}".`);
          continue;
        }

        if (areCommandsDifferent(existingCommand, localCommand)) {
          await applicationCommands.edit(existingCommand.id, {
            desciption,
            options,
          });
          console.log(`Edited command "${name}".`)
        }
      } else {
        if (localCommand.deleted) {
          console.log(`Skipping registering command "${name}" as it's set to delete.`)
          continue;
        }

        await applicationCommands.create({
          name,
          desciption,
          options,
        })

        console.log(`Registed command "${name}."`);
      }
    }
  } catch (error) {
    console.log(`There was an error: ${error}`);
  }
}
