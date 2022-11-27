import type { CharacterSchema } from 'shared-types';
import { Command } from '../@types';
import { SlashCommandBuilder } from '@discordjs/builders';
import { buildCharacterInfoEmbed } from '../utils/info.embed';
import { handleRequestError } from '../utils/interactions';
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
      handleRequestError(error, interaction);
      return;
    }

    if (isNew) {
      await interaction.reply('📥 Character added to DB!');
    } else {
      await interaction.reply('📜 Character details:');
    }

    const embed = buildCharacterInfoEmbed(characterData, interaction);
    const msg = await interaction.editReply({
      content: '📜 Character details:',
      embeds: [embed],
    });
    if (msg && isNew) {
      await msg.react('📥');
    }
  },
};
