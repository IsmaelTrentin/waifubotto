import { ApiResponseError, UserSchema } from 'shared-types';
import { CacheType, ChatInputCommandInteraction } from 'discord.js';
import axios, { AxiosError } from 'axios';

import { User } from '../models/user';
import logger from '@note-dev-org/service-logger';

export const handleRequestError = async (
  error: unknown,
  interaction: ChatInputCommandInteraction<CacheType>
) => {
  if (axios.isAxiosError(error)) {
    // API error
    const { response, name } = error as AxiosError<ApiResponseError>;
    const content = response?.data.message ? response?.data.message : name;

    await interaction.reply({
      content,
      ephemeral: true,
    });
    return;
  }

  logger.error(error);
  await interaction.reply({
    content: 'An unknown error occured. Sorry!',
    ephemeral: true,
  });
  return;
};

export const hasProfile = async (dsid: string) => {
  const user = await User.findOne({ dsid });

  return [user != null, user] as const;
};
