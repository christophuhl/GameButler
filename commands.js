import 'dotenv/config';
import { InstallGlobalCommands, GetGlobalCommands } from './utils.js';

// Command containing options
const GAMELIST_COMMAND = {
  name: 'gamelist',
  type: 1,
  description: 'Show the gamelist',
  options: [
    {
      type: 4,  // INTEGER type for limit
      name: 'limit',
      description: 'The number of games to show (default is 25)',
      required: false,
      min_value: 1,
      max_value: 100
    },
    {
      type: 3,  // STRING type for sort
      name: 'sort',
      description: 'Sort the games by price or average score',
      required: false,
      choices: [
        { name: 'Price', value: 'price' },
        { name: 'Score', value: 'score' }
      ]
    },
    {
      type: 3,  // STRING type for order
      name: 'order',
      description: 'Order the games by ascending or descending',
      required: false,
      choices: [
        { name: 'Ascending', value: 'asc' },
        { name: 'Descending', value: 'desc' }
      ]
    }
  ],
  integration_types: [0, 1],
  contexts: [0, 1, 2]
};

const GAMES_COMMAND = {
  name: 'games',
  type: 1,
  description: 'Manage games in gamelist',
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
        },
        {
          type: 10,
          name: 'price',
          description: 'The price of the game in dollars (e.g., 29.99)',
          required: true,
          min_value: 0,
          max_value: 999
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
      name: 'update',
      description: 'Update a game in the wishlist',
      options: [
        {
          type: 3,
          name: 'game',
          description: 'The game to update in the wishlist',
          required: true
        },
        {
          type: 10,
          name: 'price',
          description: 'The price of the game in dollars (e.g., 29.99)',
          required: true,
          min_value: 0,
          max_value: 999
        }
      ]
    }
  ],
  integration_types: [0, 1],
  contexts: [0, 1, 2]
};

const RATE_COMMAND = {
  name: 'rate',
  type: 1,
  description: 'Rate a game',
  options: [
    {
      type: 3,
      name: 'game',
      description: 'The game to rate',
      required: true
    },
    {
      type: 10,
      name: 'score',
      description: 'The score to give the game',
      required: true,
      min_value: 0,
      max_value: 10
    }
  ],
  integration_types: [0, 1],
  contexts: [0, 1, 2]
};

const RATINGS_COMMAND = {
  name: 'ratings',
  type: 1,
  description: 'Get game ratings',
  options: [
    {
      type: 1,  // SUB_COMMAND
      name: 'game',
      description: 'Get ratings for a specific game',
      options: [
        {
          type: 3,  // STRING
          name: 'name',
          description: 'The game to get ratings for',
          required: true
        },
        {
          type: 4,  // INTEGER
          name: 'limit',
          description: 'The number of ratings to show (default is 25)',
          required: false,
          min_value: 1,
          max_value: 100
        }
      ]
    },
    {
      type: 1,  // SUB_COMMAND
      name: 'user',
      description: 'Get ratings from a specific user',
      options: [
        {
          type: 3,  // STRING
          name: 'name',
          description: 'The username to get ratings for',
          required: true
        },
        {
          type: 4,  // INTEGER
          name: 'limit',
          description: 'The number of ratings to show (default is 25)',
          required: false,
          min_value: 1,
          max_value: 100
        }
      ]
    }
  ],
  integration_types: [0, 1],
  contexts: [0, 1, 2]
};

// // Role command
// const ROLES_COMMAND = {
//   name: 'roles',
//   description: 'Access this server\'s roles',
//   type: 1,
//   options: [
//     {
//       type: 1,
//       name: 'get',
//       description: 'Get a role from the server',
//       options: [
//         {
//           type: 3,
//           name: 'username',
//           description: 'The username to get role info for',
//           required: true
//         }
//       ]
//     },
//     {
//       type: 1,
//       name: 'add',
//       description: 'Add a role to a user',
//       options: [
//         {
//           type: 3,
//           name: 'username',
//           description: 'The username to add a role to',
//           required: true
//         },
//         {
//           type: 3,
//           name: 'role',
//           description: 'The role to add to the user',
//           required: true
//         }
//       ]
//     }
//   ]
// };

const ALL_COMMANDS = [GAMELIST_COMMAND, RATE_COMMAND, GAMES_COMMAND, RATINGS_COMMAND];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);
GetGlobalCommands(process.env.APP_ID);
