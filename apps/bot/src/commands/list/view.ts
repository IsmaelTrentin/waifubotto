import { CommandInteractionExecute } from '../../@types';
import { buildLocalCharacterInfoEmbed } from '../../utils/embeds';
import { hasProfile } from '../../utils/interactions';
import { wapu } from '../../services/wapu';

export const listView: CommandInteractionExecute = async interaction => {
  // get local id
  // slash command build forces > 0 but better safe than sorry
  const localId = Math.max(
    interaction.options.getInteger('localid', true) - 1,
    0
  );

  // defer
  await interaction.deferReply();

  // get local character
  const [isRegistered, user] = await hasProfile(interaction.user.id);

  if (!isRegistered || user == null) {
    await interaction.editReply(
      'Oh no, you have no claimed characters. Go catch some waifus!'
    );
    return;
  }

  // fetch data
  const localCharacter = user.characters[localId];
  if (localCharacter == undefined) {
    await interaction.editReply(`Character #${localId} not found`);
    return;
  }

  const character = await wapu.getCharacter(localCharacter.id);
  if (character == undefined) {
    await interaction.editReply(
      `Character ${localCharacter.id} (#${localId}) not found`
    );
    return;
  }

  // reply with info embed
  const embed = buildLocalCharacterInfoEmbed(
    localCharacter,
    character,
    interaction
  );

  await interaction.editReply({
    embeds: [embed],
  });
};
