import { CharacterSchema } from 'shared-types';
import { Command } from '../@types';
import { EmbedBuilder } from '@discordjs/builders';
import { SlashCommandBuilder } from 'discord.js';
import { User } from '../models/user';
import { buildCharacterInfoEmbed } from '../utils/info.embed';
import { hasProfile } from '../utils/interactions';
import logger from '@note-dev-org/service-logger';
import { wapu } from '../services/wapu';

const dailyGacha: Command = {
  data: new SlashCommandBuilder()
    .setName('dailygacha')
    .setDescription('Grab your daily character'),
  execute: async interaction => {
    const dsid = interaction.user.id;
    let [isRegistered, user] = await hasProfile(dsid);

    if (!isRegistered || user == null) {
      const profileModel = new User({
        dsid,
      });
      user = await profileModel.save();
    }

    if (user.claimedDailyGacha) {
      const date = new Date();
      const seconds = (59 - date.getSeconds()).toString().padStart(2, '0');
      const minutes = (59 - date.getMinutes()).toString().padStart(2, '0');
      const hours = (23 - date.getHours()).toString().padStart(2, '0');
      const diff = `${hours}:${minutes}:${seconds}`;
      const embed = new EmbedBuilder()
        .setTitle('AWO!?')
        .setDescription('You have already claimed your daily gacha reward!')
        .addFields({
          name: `Come back in:\t\`${diff}\``,
          value: '\u200B',
        });

      await interaction.reply({ embeds: [embed] });
      return;
    }

    await interaction.reply('Rolling random character...');

    let character: CharacterSchema | null = null;
    while (character == null) {
      const randId = Math.round(Math.random() * 200000) + 1;
      character = await wapu.getCharacter(randId);
    }

    user.characters.push({
      id: character._id,
      affection: 0,
      // what if too big???
      localId: user.characters.length,
    });
    user.$set('claimedDailyGacha', true);
    user = await user.save();

    const embed = buildCharacterInfoEmbed(character, interaction);

    await interaction.editReply({
      content: "Here's what you got:",
      embeds: [embed],
    });
  },
};

export default dailyGacha;
