import { ButtonInteractionHandler, InteractionEventHandler } from '../@types';

import logger from '@note-dev-org/service-logger';

export const handleButtonEvent: InteractionEventHandler<
  ButtonInteractionHandler
> = async (interaction, buttonInteractions) => {
  if (!interaction.isButton()) return;

  const { customId } = interaction;
  const parentCmd = customId.split('_')[0];
  const btnInteraction = buttonInteractions.get(parentCmd);

  logger.info(`${customId} by @${interaction.user.id}: `, {
    at: `interactions.events.handle.button.${parentCmd}`,
  });
  console.log(interaction.toJSON());

  if (!btnInteraction) {
    const errMsg = 'Unknown button interaction';
    logger.warn('Unknown button interaction', {
      at: `interactions.events.handle.button.${parentCmd}`,
    });
    if (interaction.replied || interaction.deferred) {
      await interaction.editReply(errMsg);
    } else {
      await interaction.reply(errMsg);
    }
    return;
  }

  try {
    await btnInteraction.execute(interaction);
  } catch (error) {
    logger.warn(`latest ${parentCmd}.btn.${customId}.execute error:`);
    console.error(error);
  }
};
