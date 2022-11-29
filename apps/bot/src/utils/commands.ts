import {
  CacheType,
  ChatInputCommandInteraction,
  DiscordAPIError,
} from 'discord.js';
import axios, { AxiosError } from 'axios';

import { ApiResponseError } from 'shared-types';
import logger from '@note-dev-org/service-logger';

export const handleCommandError = async (
  error: unknown,
  interaction: ChatInputCommandInteraction<CacheType>
) => {
  const body = {
    content: 'There was an unknown error while executing this command!',
    ephemeral: true,
  };

  if (axios.isAxiosError(error)) {
    body.content =
      (error as AxiosError<ApiResponseError>).response?.data?.message ||
      (error as AxiosError).name;
  } else {
    const err = error as DiscordAPIError;
    const { channel, commandName } = interaction;
    body.content =
      err.code === 50001
        ? `It appears i don't have the **required permission** for this command in this channel.\n**ChannelID**: \`${
            channel?.id || '?'
          }\`\n**Command**: \`${commandName}\``
        : err.toString();
  }

  try {
    if (interaction.replied || interaction.deferred) {
      await interaction.editReply(body);
    } else {
      await interaction.reply(body);
    }
  } catch (interactionError) {
    logger.warn(
      'Could not reply to interaction. Replied, deferred or Missing permissions?'
    );
    console.error(interactionError);
  }
};
