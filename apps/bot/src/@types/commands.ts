import type { CacheType, ChatInputCommandInteraction } from 'discord.js';
import {
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from '@discordjs/builders';

export type CommandData =
  | SlashCommandBuilder
  | SlashCommandSubcommandsOnlyBuilder
  | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;

export interface Command {
  data: CommandData;
  execute: (
    interaction: ChatInputCommandInteraction<CacheType>
  ) => Promise<void>;
}
