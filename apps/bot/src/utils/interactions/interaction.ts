import { CacheType, ChatInputCommandInteraction } from 'discord.js';
import axios, { AxiosError } from 'axios';

import { ApiResponseError } from 'shared-types';
import { User } from '../../models/user';
import logger from '@note-dev-org/service-logger';

export const handleRequestError = async (
  error: unknown,
  interaction: ChatInputCommandInteraction<CacheType>
) => {
  if (axios.isAxiosError(error)) {
    // API error
    const { response, name } = error as AxiosError<ApiResponseError>;
    const content = response?.data.message ? response?.data.message : name;
    const body = {
      content,
      ephemeral: true,
    };
    if (interaction.replied || interaction.deferred) {
      await interaction.editReply(body);
    } else {
      await interaction.reply(body);
    }
    return;
  }

  logger.error(error);
  const body = {
    content: 'An unknown error occured. Sorry!',
    ephemeral: true,
  };
  if (interaction.replied || interaction.deferred) {
    await interaction.editReply(body);
  } else {
    await interaction.reply(body);
  }
};

export const hasProfile = async (dsid: string) => {
  const user = await User.findOne({ dsid });

  return [user != null, user] as const;
};
