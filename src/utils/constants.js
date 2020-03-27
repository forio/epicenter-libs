export const BROWSER_STORAGE_TYPE = {
    COOKIE: 'COOKIE',
    SESSION: 'SESSION',
};


/**
 * Scope boundaries are values associated with runs. They help to define the *default* user permissions used when a run is created, althought further permission configuration can be done with {@link #LOCK_TYPE lock types}. Scopes also provide an index that in which a run can be queried for.
 * @enum {string}
 */
export const SCOPE_BOUNDARY = {
    /**
     * Runs scoped by project, users and facilitators are allowed access so long as they are a user in a group on the project.
     * @constant
     * @type {string}
     */
    PROJECT: 'PROJECT',
    /**
     * Runs scoped by group, users and facilitators are allowed access only if they are in the associated group
     * @constant
     * @type {string}
     */
    GROUP: 'GROUP',
    /**
     * Runs scoped by episode, not sure what this one is permission-wise
     * @constant
     * @type {string}
     */
    EPISODE: 'EPISODE',
    /**
     * Runs scoped by world, users are only allowed access to the if they are assigned to the associated world. Facilitators need only to belong on the group that created the world
     * @constant
     * @type {string}
     */
    WORLD: 'WORLD',
    /**
     * Run scoped runs are only accessible to the user who created the run, and facilitators that exist in the same group as that user.
     * @constant
     * @type {string}
     */
    RUN: 'RUN',
};

/**
 * Rituals are used to define the way in which the Epicenter stores a run while running actions like getting variables, saving meta data, and call model operations. Runs can exist in-memory for a certain amount of time before expiring, and requiring their revival again before use.
 * @enum {string}
 */
export const RITUAL = {
    /**
     * ???
     * @constant
     * @type {string}
     */
    NONE: 'NONE',
    /**
     * ???
     * @constant
     * @type {string}
     */
    INTER: 'INTER',
    /**
     * A run with this ritual will be pulled into memory as needed, and will stay in memory until it's lifespan (defined in your project Settings) has expired.
     * @constant
     * @type {string}
     */
    REANIMATE: 'REANIMATE',
    /**
     * A run with this ritual will be pulled into memory as needed, and removed from memory afterwards.
     * @constant
     * @type {string}
     */
    EXORCISE: 'EXORCISE',
};

/**
 * Push categories are pre-defined channels types in which one might use to receive push channel updates
 * @enum {string}
 */
export const PUSH_CATEGORY = {
    /**
     * Used for messaging users, (isn't this somewhat general?)
     * @constant
     * @type {string}
     */
    CHAT: 'CHAT',
    /**
     * Used for the {@link https://github.com/forio Consensus API}
     * @constant
     * @type {string}
     */
    CONSENSUS: 'CONSENSUS',
    /**
     * No idea what this is for...
     * @constant
     * @type {string}
     */
    CONTROL: 'CONTROL',
    /**
     * Used for the {@link https://github.com/forio Presence API}
     * @constant
     * @type {string}
     */
    PRESENCE: 'PRESENCE',
    /**
     * Used for the {@link https://github.com/forio Run API}
     * @constant
     * @type {string}
     */
    RUN: 'RUN',
    /**
     * Send help..
     * @constant
     * @type {string}
     */
    SYSTEM: 'SYSTEM',
};

/**
 * Lock types are used to define permissions in runs. They define which roles have which specific privileges associated with the run.
 * @enum {string}
 */
export const LOCK_TYPE = {
    /**
     * System?
     * @constant
     * @type {string}
     */
    SYSTEM: 'SYSTEM',
    /**
     * No idea
     * @constant
     * @type {string}
     */
    MONITER: 'MONITER',
    /**
     * Author
     * @constant
     * @type {string}
     */
    AUTHOR: 'AUTHOR',
    /**
     * Team Members
     * @constant
     * @type {string}
     */
    SUPPORT: 'SUPPORT',
    /**
     * Facilitators
     * @constant
     * @type {string}
     */
    FACILITATOR: 'FACILITATOR',
    /**
     * Reviewers
     * @constant
     * @type {string}
     */
    REVIEWER: 'REVIEWER',
    /**
     * Users
     * @constant
     * @type {string}
     */
    USER: 'USER',
    /**
     * Leader
     * @constant
     * @type {string}
     */
    LEADER: 'LEADER',
    /**
     * Participant
     * @constant
     * @type {string}
     */
    PARTICIPANT: 'PARTICIPANT',
    /**
     * Anonymous
     * @constant
     * @type {string}
     */
    ANONYMOUS: 'ANONYMOUS',
};