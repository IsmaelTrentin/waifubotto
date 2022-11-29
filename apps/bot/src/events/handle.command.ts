import { CommandInteractionHandler, InteractionEventHandler } from '../@types';

import { handleCommandError } from '../utils/commands';
import logger from '@note-dev-org/service-logger';

export const handleCommandEvent: InteractionEventHandler<
  CommandInteractionHandler
> = async (interaction, commands) => {
  if (!interaction.isChatInputCommand()) return;

  const cmd = commands.get(interaction.commandName);
  logger.info(`@${interaction.user.id} ${interaction.toString()}`, {
    at: `interactions.events.handle.command.${interaction.commandId}`,
  });
  console.log(interaction.toJSON());

  if (!cmd) {
    const errMsg = 'Unknown command interaction';
    logger.warn(errMsg, {
      at: `interactions.events.handle.command.${interaction.commandId}`,
    });
    if (interaction.replied || interaction.deferred) {
      await interaction.editReply(errMsg);
    } else {
      await interaction.reply(errMsg);
    }
    return;
  }

  try {
    await cmd.execute(interaction);
  } catch (error) {
    logger.warn('latest cmd.execute error:');
    console.error(error);
    await handleCommandError(error, interaction);
  }
};
