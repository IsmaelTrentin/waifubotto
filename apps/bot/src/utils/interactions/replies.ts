import { CacheType, ChatInputCommandInteraction } from 'discord.js';

/**
 * @deprecated
 */
export const replyNoProfile = async (
  interaction: ChatInputCommandInteraction<CacheType>
) => {
  const body = {
    content:
      "It looks like you don't have a profile 😥\nRun `/profile show` to create it",
    ephemeral: true,
  };
  if (interaction.replied || interaction.deferred) {
    await interaction.editReply(body);
    return;
  }
  await interaction.reply(body);
};
