// Permission levels
export const PermissionLevels = {
    EVERYONE: 0,
    MEMBER: 1,
    MODERATOR: 2,
    ADMIN: 3,
    OWNER: 4
};

// Role IDs - you'll need to replace these with your server's actual role IDs
const ROLE_IDS = {
    MEMBER: 'your_member_role_id',
    MODERATOR: 'your_moderator_role_id',
    ADMIN: 'your_admin_role_id'
};

/**
 * Check if a user has the required permission level
 * @param {Object} member - Discord member object
 * @param {number} requiredLevel - Required permission level from PermissionLevels
 * @returns {boolean}
 */
export function hasPermission(member, requiredLevel) {

}

/**
 * Command permission configuration
 */
export const CommandPermissions = {
    'gamelist': {
        'show': PermissionLevels.EVERYONE,
        'get': PermissionLevels.EVERYONE,
        'add': PermissionLevels.EVERYONE,
        'remove': PermissionLevels.MODERATOR
    }
};

/**
 * Check if a user can run a specific command
 * @param {Object} member - Discord member object
 * @param {string} command - Command name
 * @param {string} subcommand - Subcommand name
 * @returns {Object} - { allowed: boolean, message: string }
 */
export function canRunCommand(member, command, subcommand) {
    return true;
    if (!CommandPermissions[command] || !CommandPermissions[command][subcommand]) {
        return { 
            allowed: false, 
            message: 'This command is not configured.' 
        };
    }

    const requiredLevel = CommandPermissions[command][subcommand];
    const hasAccess = hasPermission(member, requiredLevel);

    return {
        allowed: hasAccess,
        message: hasAccess ? null : 'You do not have permission to use this command.'
    };
} 