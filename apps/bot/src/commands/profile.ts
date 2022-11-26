import { EmbedBuilder, hyperlink } from '@discordjs/builders';
import { handleRequestError, hasProfile } from '../utils/interactions';

import { BLANK } from '../utils/embeds';
import { Command } from '../@types';
import { SlashCommandBuilder } from 'discord.js';
import { User } from '../models/user';
import { replyNoProfile } from '../utils/interaction.replies';
import { wapu } from '../services/wapu';

const profileShow: Command['execute'] = async interaction => {
  const { id, username } = interaction.user;
  let userProfile = await User.findOne({ dsid: id });
  let created = false;

  if (userProfile == null) {
    const profileModel = new User({
      dsid: id,
    });
    userProfile = await profileModel.save();
    created = true;
  }

  const { xp, points, waifuDust, characters, favouriteCharacterId } =
    userProfile.toObject();
  const favourite = favouriteCharacterId
    ? await wapu.getCharacter(favouriteCharacterId)
    : null;

  const embed = new EmbedBuilder()
    .setTitle(username)
    .setThumbnail(interaction.user.avatarURL())
    .setFooter({
      text: created ? "Here's your new profile!" : 'uwu senpai!',
    })
    .setFields([
      {
        name: '**Your stats:**',
        value: 'XP:\nWeeb points:\nWaifu dust:\nClaimed characters:',
        inline: true,
      },
      {
        name: BLANK,
        value: `${xp}\n${points}\n${waifuDust}\n${characters.length}`,
        inline: true,
      },
      {
        name: BLANK,
        value: BLANK,
        inline: true,
      },
      {
        name: '**Favourite character:**',
        value:
          favourite != null
            ? hyperlink(
                favourite.name,
                `https://myanimelist.net/character/${favourite._id}`
              )
            : 'Run `/profile set favourite`\nto set your fav character!',
      },
    ]);

  if (favourite != null) {
    embed.setImage(favourite.image);
  }

  await interaction.reply({ embeds: [embed] });
};

export const profile: Command = {
  data: new SlashCommandBuilder()
    .setName('profile')
    .setDescription('Profile related commands')
    .addSubcommand(sub =>
      sub.setName('show').setDescription('Take a look at your profile')
    )
    .addSubcommand(sub =>
      sub
        .setName('setfav')
        .setDescription('Set your favourite character')
        .addIntegerOption(opt =>
          opt
            .setName('malid')
            .setDescription('The character MAL id')
            .setMinValue(1)
            .setRequired(true)
        )
    ),
  execute: async interaction => {
    const cmd = interaction.options.getSubcommand();

    if (cmd === 'show') {
      await profileShow(interaction);
      return;
    } else if (cmd === 'setfav') {
      const malid = interaction.options.getInteger('malid', true);
      const [isRegistered, user] = await hasProfile(interaction.user.id);

      if (!isRegistered || user == null) {
        await replyNoProfile(interaction);
        return;
      }
      if (user.favouriteCharacterId == malid) {
        await interaction.reply({
          content:
            'This character is already your favourite. Yeah ok we KNOW you love them...',
          ephemeral: true,
        });
        return;
      }

      let characterData;
      try {
        characterData = await wapu.getCharacter(malid);
      } catch (error) {
        handleRequestError(error, interaction);
        return;
      }

      await interaction.reply(`Character found! ${characterData.name}`);
      await user.updateOne({
        $set: {
          favouriteCharacterId: characterData._id,
        },
      });

      await interaction.editReply(
        `Your favourite character has been set to **${characterData.name}** \`${characterData._id}\``
      );

      return;
    }
  },
};
