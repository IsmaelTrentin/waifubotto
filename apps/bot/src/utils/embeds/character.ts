import {
  BaseInteraction,
  CacheType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  hyperlink,
} from 'discord.js';
import { CharacterSchema, LocalCharacterSchema } from 'shared-types';
import { buildAuthor, buildRequestedByFooter } from '.';

import { malCharacterLink } from '../characters';

export const buildCharacterInfoEmbed = (
  character: CharacterSchema,
  interaction: ChatInputCommandInteraction<CacheType>
) => {
  const characterUrl = malCharacterLink(character);
  const title = character.japaneseName
    ? `${character.name} | ${character.japaneseName}`
    : character.name;
  const aliases = (() => {
    const _ = character.aliases.join(', ');
    return _.length === 0 ? '-' : _;
  })();
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
      url: character.image,
    },
    image: { url: character.image },
    footer: buildRequestedByFooter(interaction),
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
        name: 'Aliases',
        value: aliases,
        inline: true,
      },
      {
        name: 'Favourites',
        value: character.favorites.toString(),
        inline: true,
      },
      {
        name: '\u200B',
        value: '\u200B',
        inline: true,
      },
      {
        name: 'Seen in',
        value: `**${character.animeography.length}** animes, **${character.mangaography.length}** mangas`,
      },
    ],
  });

  return embed;
};

export const buildCharactersListEmbed = (
  interaction: BaseInteraction<CacheType>,
  localCharacters: LocalCharacterSchema[],
  charactersData: CharacterSchema[],
  currentPage: number,
  maxPage: number
) => {
  const username = interaction.user.username;
  const iconURL = interaction.user.avatarURL();
  const localIds = localCharacters.map(c => c.localId + 1).join('\n');
  const names = charactersData.map(c => c.name).join('\n');
  const malids = localCharacters
    .map(c => hyperlink(c.id.toString(), malCharacterLink(c)))
    .join('\n');

  const embed = new EmbedBuilder()
    .setTitle(`${username}'s characters`)
    .setAuthor({
      name: username,
      iconURL: iconURL || undefined,
    });

  if (localCharacters.length > 0) {
    embed
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
      ])
      .setFooter({
        text: `Page ${currentPage} of ${maxPage}`,
      });
  } else {
    embed.setDescription("You haven't claimed any characters yet");
  }

  return embed;
};
