import {
  CacheType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  hyperlink,
} from 'discord.js';
import { CharacterSchema, LocalCharacterSchema } from 'shared-types';
import { buildAuthor, buildClaimedByFooter } from './embed';

import { malCharacterLink } from '../characters';

export const buildLocalCharacterInfoEmbed = (
  localCharacter: LocalCharacterSchema,
  character: CharacterSchema,
  interaction: ChatInputCommandInteraction<CacheType>
) => {
  const characterUrl = malCharacterLink(character);
  const title = character.japaneseName
    ? `${character.name} | ${character.japaneseName}`
    : character.name;
  const descSliced = character.description.slice(0, 150);
  const idx = descSliced.indexOf('\n\n');
  const desc =
    descSliced.slice(0, idx) +
    '\n' +
    hyperlink('keep reading...', characterUrl);

  const embed = new EmbedBuilder({
    title,
    url: characterUrl,
    description: desc,
    author: buildAuthor(interaction),
    thumbnail: {
      url: interaction.user.avatarURL() || character.image,
    },
    image: { url: character.image },
    footer: buildClaimedByFooter(interaction),
    fields: [
      {
        name: 'Name',
        value: character.name,
        inline: true,
      },
      {
        name: 'Japanese name',
        value: character.japaneseName ?? '-',
        inline: true,
      },
      {
        name: '\u200B',
        value: '\u200B',
        inline: true,
      },
      {
        name: 'Local Id',
        value: (localCharacter.localId + 1).toString(),
        inline: true,
      },
      {
        name: 'MAL Id',
        value: localCharacter.id.toString(),
        inline: true,
      },
      {
        name: '\u200B',
        value: '\u200B',
        inline: true,
      },
      {
        name: 'Claim date',
        value: `TODO: implement claim date`,
      },
    ],
  });

  return embed;
};
