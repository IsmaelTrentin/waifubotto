import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from 'discord.js';

import { CharacterSchema } from 'shared-types';
import { Command } from '../../@types';
import { User } from '../../models/user';
import { hasProfile } from '../../utils/interactions';
import { hyperMalCharacterLink } from '../../utils/characters';
import { wapu } from '../../services/wapu';

export const listAll: Command['execute'] = async interaction => {
  const dsid = interaction.user.id;
  let [isRegistered, user] = await hasProfile(dsid);

  if (!isRegistered || user == null) {
    const profileModel = new User({
      dsid,
    });
    user = await profileModel.save();
  }

  const samples = user.characters.slice(0, 20);
  const charactersData: CharacterSchema[] = [];

  for (const sample of samples) {
    const result = await wapu.getCharacter(sample.id);
    if (result) {
      charactersData.push(result);
    } else {
      charactersData.push({
        _id: sample.id,
        aliases: [],
        animeography: [],
        description: '',
        favorites: 0,
        image: '',
        mangaography: [],
        name: 'deleted character',
      });
    }
  }

  const username = interaction.user.username;
  const localIds = samples.map(c => c.localId + 1).join('\n');
  const names = charactersData.map(c => hyperMalCharacterLink(c)).join('\n');
  const malids = samples.map(c => c.id).join('\n');
  const embed = new EmbedBuilder()
    .setTitle(`${username}'s characters`)
    .setAuthor({
      name: username,
      iconURL: interaction.user.avatarURL() || undefined,
    })
    .setFields([
      {
        name: '#',
        value: localIds,
        inline: true,
      },
      {
        name: 'Name',
        value: names,
        inline: true,
      },
      {
        name: 'MAL ID',
        value: malids,
        inline: true,
      },
    ]);

  const rowOne = new ActionRowBuilder().setComponents(
    new ButtonBuilder()
      .setCustomId('row_0_btn_prev')
      .setStyle(ButtonStyle.Primary)
      .setLabel('⬅')
      .setDisabled(false)
  );
  await interaction.reply({
    embeds: [embed],
    components: [rowOne as any],
  });
};
