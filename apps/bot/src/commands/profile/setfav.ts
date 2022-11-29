import { handleRequestError, hasProfile } from '../../utils/interactions';

import { CommandInteractionExecute } from '../../@types';
import { User } from '../../models/user';
import { wapu } from '../../services/wapu';

export const profileSetFav: CommandInteractionExecute = async interaction => {
  await interaction.deferReply();

  const dsid = interaction.user.id;
  const malid = interaction.options.getInteger('malid', true);
  let [isRegistered, user] = await hasProfile(dsid);

  if (!isRegistered || user == null) {
    const profileModel = new User({
      dsid,
    });
    user = await profileModel.save();
  }

  if (user.favouriteCharacterId == malid) {
    await interaction.editReply({
      content:
        'This character is already your favourite. Yeah ok we KNOW you love them...',
    });
    return;
  }

  let characterData;
  try {
    characterData = await wapu.getCharacter(malid);
    if (characterData == null) {
      await interaction.editReply(`Character ${malid} not found`);
      return;
    }
  } catch (error) {
    handleRequestError(error, interaction);
    return;
  }

  await interaction.editReply(`Character found! ${characterData.name}`);
  await user.updateOne({
    $set: {
      favouriteCharacterId: characterData._id,
    },
  });

  await interaction.editReply(
    `Your favourite character has been set to **${characterData.name}** \`${characterData._id}\``
  );
};
