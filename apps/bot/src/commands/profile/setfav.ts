import { handleRequestError, hasProfile } from '../../utils/interactions';

import { Command } from '../../@types';
import { replyNoProfile } from '../../utils/interaction.replies';
import { wapu } from '../../services/wapu';

export const profileSetFav: Command['execute'] = async interaction => {
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
};
