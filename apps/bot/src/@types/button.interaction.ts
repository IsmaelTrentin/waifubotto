import { ButtonInteraction, CacheType } from 'discord.js';

export type ButtonInteractionData = {
  parent: string;
};

export type ButtonInteractionExecute = (
  interaction: ButtonInteraction<CacheType>
) => Promise<void>;
