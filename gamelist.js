import { InteractionResponseType } from 'discord-interactions';

// You might want to replace this with a database in the future
const gameWishlist = new Set();

export async function handleGamelistCommand(data) {
  const subcommand = data.options[0].name;
  const subcommandOptions = data.options[0].options?.[0]?.value; // optional chaining operator
  
  switch (subcommand) {
    case 'get':
      return handleGet(subcommandOptions);
    case 'add':
      return handleAdd(subcommandOptions);
    case 'remove':
      return handleRemove(subcommandOptions);
    case 'show':
      return handleShow();
    default:
      throw new Error('Unknown subcommand');
  }
}

async function handleGet(gameName) {
  if (gameWishlist.has(gameName)) {
    return {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: `${gameName} is in the wishlist!`
      }
    };
  }
  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: `${gameName} is not in the wishlist.`
    }
  };
}

async function handleAdd(gameName) {
  if (gameWishlist.has(gameName)) {
    return {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: `${gameName} is already in the wishlist!`
      }
    };
  }
  
  gameWishlist.add(gameName);
  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: `Added ${gameName} to the wishlist!`
    }
  };
}

async function handleRemove(gameName) {
  if (!gameWishlist.has(gameName)) {
    return {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: `${gameName} is not in the wishlist!`
      }
    };
  }
  
  gameWishlist.delete(gameName);
  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: `Removed ${gameName} from the wishlist!`
    }
  };
}

async function handleShow() {
  if (gameWishlist.size === 0) {
    return {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: 'The wishlist is empty!'
      }
    };
  }
  
  const gameList = Array.from(gameWishlist).join('\n• ');
  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: `Games in wishlist:\n• ${gameList}`
    }
  };
} 