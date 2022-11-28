import type { CharacterSchema } from 'shared-types';
import { Command } from '../@types';
import { SlashCommandBuilder } from '@discordjs/builders';
import { buildCharacterInfoEmbed } from '../utils/info.embed';
import { handleRequestError } from '../utils/interactions';
import { wapu } from '../services/wapu';

const info: Command = {
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
    const malid = interaction.options.getInteger('malid', true);

    let characterData: CharacterSchema | undefined;
    let isNew = true;

    try {
      const result = await wapu.getCharacterAndCreated(malid || 1);
      if (result == null) {
        await interaction.reply({
          content: `Character ${malid} not found`,
          ephemeral: true,
        });
        return;
      }
      characterData = result.character;
      isNew = result.created;
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

export default info;
