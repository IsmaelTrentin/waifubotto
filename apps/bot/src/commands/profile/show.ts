import { BLANK } from '../../utils/embeds';
import { CommandInteractionExecute } from '../../@types';
import { EmbedBuilder } from 'discord.js';
import { User } from '../../models/user';
import { hyperMalCharacterLink } from '../../utils/characters';
import { wapu } from '../../services/wapu';

export const profileShow: CommandInteractionExecute = async interaction => {
  await interaction.deferReply();

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
            ? hyperMalCharacterLink(favourite)
            : 'Run `/profile set favourite`\nto set your fav character!',
      },
    ]);

  if (favourite != null) {
    embed.setImage(favourite.image);
  }

  await interaction.editReply({ embeds: [embed] });
};
