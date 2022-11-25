import type { ApiResponseError, CharacterSchema, Command } from '../@types';

import type { AxiosError } from 'axios';
import { SlashCommandBuilder } from '@discordjs/builders';
import axios from 'axios';
import { buildCharacterInfoEmbed } from '../utils/info.embed';
import serviceLogger from '@note-dev-org/service-logger';
import { wapu } from '../services/wapu';

export const info: Command = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Displays character infos')
    .addIntegerOption(option =>
      option
        .setName('malid')
        .setDescription("The character's MyAnimeList id")
        .setMinValue(1)
        .setRequired(true)
    ),
  execute: async interaction => {
    const id = interaction.options.getInteger('malid', true);

    let characterData: CharacterSchema | undefined;
    let isNew = true;

    try {
      const { character, created } = await wapu.getCharacterAndCreated(id || 1);
      characterData = character;
      isNew = created;
    } catch (error) {
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

      serviceLogger.error(error);
      await interaction.reply({
        content: 'error',
        ephemeral: true,
      });
      return;
    }

    if (isNew) {
      await interaction.reply('📥 Character added to DB!');
    } else {
      await interaction.reply('📜 Character details:');
    }

    const embed = buildCharacterInfoEmbed(characterData, interaction);

    const msg = await interaction.channel?.send({ embeds: [embed] });
    if (msg && isNew) {
      await msg.react('📥');
    }
  },
};
