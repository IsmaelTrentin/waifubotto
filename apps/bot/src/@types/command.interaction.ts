import type { CacheType, ChatInputCommandInteraction } from 'discord.js';
import {
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from '@discordjs/builders';

export type CommandInteractionData =
  | SlashCommandBuilder
  | SlashCommandSubcommandsOnlyBuilder
  | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;

export type CommandInteractionExecute = (
  interaction: ChatInputCommandInteraction<CacheType>
) => Promise<void>;
