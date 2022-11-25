import type { CommandData } from './@types';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import logger from '@note-dev-org/service-logger';

export const registerCommands = async (commands: CommandData[]) => {
  if (process.env.REGISTER_COMMANDS !== 'true') {
    logger.warn(
      `Commands registration disabled. REGISTER_COMMANDS = ${process.env.REGISTER_COMMANDS}`,
      {
        at: 'registerCommands',
      }
    );
    return;
  }
  logger.info(`Registering application commands...`, {
    at: 'registerCommands',
  });
  if (process.env.TOKEN == undefined) {
    throw new Error('No token set in .env');
  }

  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
  const body = commands.map(command => command.toJSON());

  const t1 = Date.now();

  try {
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID as string),
      {
        body,
      }
    );
  } catch (error) {
    logger.error(
      `Could not register application commands: ${JSON.stringify(error)}`,
      {
        at: 'registerCommands.catch-put',
      }
    );
  }
  logger.info(`Registered application commands in ${Date.now() - t1}ms`, {
    at: 'registerCommands',
  });
};
