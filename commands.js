import 'dotenv/config';
import { getRPSChoices } from './game.js';
import { capitalize, InstallGlobalCommands } from './utils.js';

// Get the game choices from game.js
function createCommandChoices() {
  const choices = getRPSChoices();
  const commandChoices = [];

  for (let choice of choices) {
    commandChoices.push({
      name: capitalize(choice),
      value: choice.toLowerCase(),
    });
  }

  return commandChoices;
}

// Simple test command
const TEST_COMMAND = {
  name: 'test',
  description: 'Basic command',
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
};

// Command containing options
const GAMELIST_COMMAND = {
  name: 'gamelist',
  description: 'Access this server\'s game wishlist',
  type: 1,
  options: [
    {
      type: 1,
      name: 'get',
      description: 'Get a game from the wishlist',
      options: [
        {
          type: 3,
          name: 'game',
          description: 'The game to get information about',
          required: true
        }
      ]
    },
    {
      type: 1,
      name: 'add',
      description: 'Add a game to the wishlist',
      options: [
        {
          type: 3,
          name: 'game',
          description: 'The game to add to the wishlist',
          required: true
        }
      ]
    },
    {
      type: 1,
      name: 'remove',
      description: 'Remove a game from the wishlist',
      options: [
        {
          type: 3,
          name: 'game',
          description: 'The game to remove from the wishlist',
          required: true
        }
      ]
    },
    {
      type: 1,
      name: 'show',
      description: 'Show all games in the wishlist'
    }
  ],
  integration_types: [0, 1],
  contexts: [0, 1, 2]
};

const ALL_COMMANDS = [TEST_COMMAND, GAMELIST_COMMAND];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);
