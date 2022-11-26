import { CacheType, ChatInputCommandInteraction } from 'discord.js';

export const BLANK = '\u200B';

export const buildAuthor = (
  interaction: ChatInputCommandInteraction<CacheType>
) => {
  return {
    name: interaction.client.user.username || 'waifubotto',
    icon_url: interaction.client.user.avatarURL() || undefined,
  };
};

export const buildRequestedByFooter = (
  interaction: ChatInputCommandInteraction<CacheType>
) => {
  return {
    text: `Requested by ${interaction.user.username}`,
    icon_url: interaction.user.avatarURL() || undefined,
  };
};
