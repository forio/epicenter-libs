

export enum BROWSER_STORAGE_TYPE {
    COOKIE = 'COOKIE',
    SESSION = 'SESSION',
}


/**
 * Scope boundaries are values associated with runs. They help to define the *default* user permissions used when a run is created, althought further permission configuration can be done with {@link #ROLE lock types}. Scopes also provide an index that in which a run can be queried for.
 *
 * Three parts -- boundary: level of hierarchy (ontology) that a piece of data belongs to. Specifically, a run, an asset, or a vault data
 * Boundary in which a piece of data (run, asset, vault) is ID-ed to (see scopeKey).
 *
 * psuedonymKey, goes in tandem w/ permit (lock types) --
 * Data lives and dies with scope, delete the scope, you lose the data and associated scopes
 * @enum {string}
 */
export enum SCOPE_BOUNDARY {
    /**
     * Runs scoped by project, users and facilitators are allowed access so long as they are a user in a group on the project.
     * @constant
     * @type {string}
     */
    PROJECT = 'PROJECT',
    /**
     * Runs scoped by group, users and facilitators are allowed access only if they are in the associated group
     * Groups are scoped by projects
     * @constant
     * @type {string}
     */
    GROUP = 'GROUP',
    /**
     * Runs scoped by episode, not sure what this one is permission-wise
     * Episodes are scoped by groups
     * @constant
     * @type {string}
     */
    EPISODE = 'EPISODE',
    /**
     * Runs scoped by world, users are only allowed access to the if they are assigned to the associated world. Facilitators need only to belong on the group that created the world
     * Worlds can be scoped by group or episode
     * @constant
     * @type {string}
     */
    WORLD = 'WORLD',
    /**
     * Runs scoped by world, users are only allowed access to the if they are assigned to the associated world. Facilitators need only to belong on the group that created the world
     * Worlds can be scoped by group or episode
     * @constant
     * @type {string}
     */
    RUN = 'RUN',
};

/**
 * Rituals are used to define the way in which the Epicenter stores a run while running actions like getting variables, saving meta data, and call model operations. Runs can exist in-memory for a certain amount of time before expiring, and requiring their revival again before use.
 * @enum {string}
 */
export enum RITUAL {
    /**
     * Allow GET action against archive, no revival of run
     * @constant
     * @type {string}
     */
    NONE = 'NONE',
    /**
     * A run with this ritual will be pulled into memory as needed, and will stay in memory until it's lifespan (defined in your project Settings) has expired.
     * @constant
     * @type {string}
     */
    REANIMATE = 'REANIMATE',
    /**
     * A run with this ritual will be pulled into memory as needed, and removed from memory afterwards.
     * @constant
     * @type {string}
     */
    EXORCISE = 'EXORCISE',
};

/**
 * Push categories are pre-defined channels types in which one might use to receive push channel updates
 * @enum {string}
 */
export enum PUSH_CATEGORY {
    /**
     * intended for messaging users
     * yes pub
     * @constant
     * @type {string} */
    CHAT = 'CHAT',
    /**
     * Used for the {@link https://github.com/forio Consensus API}
     * no pub
     * @constant
     * @type {string} */
    CONSENSUS = 'CONSENSUS',
    /**
     * intended for general non-chat, sim-level communication
     * yes pub
     * @constant
     * @type {string} */
    CONTROL = 'CONTROL',
    /**
     * Used for the {@link https://github.com/forio Presence API}
     * no pub
     * @constant
     * @type {string} */
    PRESENCE = 'PRESENCE',
    /**
     * intended for awaiting entering games
     * yes pub
     * @constant
     * @type {string} */
    LOBBY = 'LOBBY',
    /**
     * Used for the {@link https://github.com/forio Run API}
     * no pub
     * @constant
     * @type {string} */
    RUN = 'RUN',
    /**
     * Used for the {@link https://github.com/forio Vault API}
     * no pub
     * @constant
     * @type {string}
     */
    VAULT = 'VAULT',
    /**
     * Used for the {@link https://github.com/forio World API}
     * no pub
     * @constant
     * @type {string}
     */
    WORLD = 'WORLD',
    /**
     * internal
     * @constant
     * @type {string} */
    SYSTEM = 'SYSTEM',
};

/**
 * Roles are used to define permissions on resources in Epicenter.
 * @enum {string}
 */
export enum ROLE {
    /**
     * System -- Epicenter Manager
     * @constant
     * @type {string}
     */
    SYSTEM = 'SYSTEM',
    /**
     * System minus -- read-only system access, write for certain accounts; think Geromel
     * @constant
     * @type {string}
     */
    MONITOR = 'MONITOR',
    /**
     * Author -- Team Members (and node server API keys)
     * tied to one account (personal + current account)
     * @constant
     * @type {string}
     */
    AUTHOR = 'AUTHOR',
    /**
     * Author minus
     * @constant
     * @type {string}
     */
    SUPPORT = 'SUPPORT',
    /**
     * Facilitators
     * @constant
     * @type {string}
     */
    FACILITATOR = 'FACILITATOR',
    /**
     * Reviewers (weaker facilitator)
     * Facilitator minus
     * @constant
     * @type {string}
     */
    REVIEWER = 'REVIEWER',
    /**
     * Users -- psuedonymKey (userKey) required in scope
     * e.g., an avatar -- GROUP scope, PARTICIPANT read, USER write, userKey pseudonymKey
     * @constant
     * @type {string}
     */
    USER = 'USER',
    /**
     * Leader
     * Participant plus
     * @constant
     * @type {string}
     */
    LEADER = 'LEADER',
    /**
     * Participant
     * @constant
     * @type {string}
     */
    PARTICIPANT = 'PARTICIPANT',
    /**
     * Anonymous
     * @constant
     * @type {string}
     */
    ANONYMOUS = 'ANONYMOUS',
};