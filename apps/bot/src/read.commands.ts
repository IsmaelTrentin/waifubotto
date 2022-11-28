import { Collection } from 'discord.js';
import { Command } from './@types';
import fs from 'fs/promises';
import logger from '@note-dev-org/service-logger';
import path from 'path';

export const readCommands = async () => {
  const extFilter = process.env.NODE_ENV === 'production' ? '.js' : '.ts';
  const commands = new Collection<string, Command>();
  const commandsPath = path.join(__dirname, 'commands');

  let commandFiles: string[] = [];
  try {
    const commandDirs = await fs.readdir(commandsPath, { withFileTypes: true });
    commandFiles = commandDirs
      .filter(
        entry =>
          entry.isDirectory() ||
          (entry.isFile() &&
            !entry.name.includes('.d.ts') &&
            entry.name.endsWith(extFilter))
      )
      .map(entry => entry.name);
  } catch (error) {
    logger.error(error);
    return commands;
  }

  logger.info('Reading commands directory...', {
    at: 'readCommands',
  });

  const t1 = Date.now();
  for (const [i, file] of commandFiles.entries()) {
    const filePath = path.join(commandsPath, file);
    const module = require(filePath);

    const command = module['default'];

    // Set a new item in the Collection
    // With the key as the command name and the value as the exported module
    commands.set(command.data.name, command);
    logger.info(`[${i}] /${command.data.name} (${file})`, {
      at: 'readCommands',
    });
  }
  logger.info(`✅ Read ${commands.size} commands in ${Date.now() - t1}ms`, {
    at: 'readCommands',
  });

  return commands;
};
