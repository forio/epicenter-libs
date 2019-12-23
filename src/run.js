import Router from './router';
import { LOCK_TYPE, SCOPE_BOUNDARY, RITUALS, prefix } from './utility';


export async function create(model, scope, optionals = {}) {
    const { scopeBoundary, scopeKey, pseudonymKey } = scope;
    const {
        accountShortName, projectShortName, readLock, writeLock,
        morphology, ephemeral, trackingKey, modelContext, executionContext,
    } = optionals;

    const defaultLock = scopeBoundary === SCOPE_BOUNDARY.WORLD ?
        LOCK_TYPE.PARTICIPANT :
        LOCK_TYPE.USER;

    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .post('/run', {
            body: {
                scope: {
                    scopeBoundary,
                    scopeKey,
                    pseudonymKey,
                },
                permit: {
                    readLock: readLock || defaultLock,
                    writeLock: writeLock || defaultLock,
                },
                morphology,
                trackingKey,
                modelFile: model,
                modelContext: modelContext || {/* Is not recorded for clone. Overrides model ctx2 file. */},
                executionContext: executionContext || {/* Affected by clone. Carries arguments for model file worker on model initialization */},
                ephemeral,
            },
        });
}

export async function clone(runKey, optionals = {}) {
    const {
        accountShortName, projectShortName, ephemeral,
        trackingKey, modelContext = {}, executionContext = {},
    } = optionals;
    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .post(`/run/clone/${runKey}`, {
            body: {
                trackingKey,
                modelContext,
                executionContext,
                ephemeral,
            },
        });
}

export async function restore(runKey, optionals = {}) {
    const {
        accountShortName, projectShortName, ephemeral,
        modelContext = {}, executionContext = {},
    } = optionals;
    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .post(`/run/restore/${runKey}`, {
            body: {
                modelContext,
                executionContext,
                ephemeral,
            },
        });
}

export async function rewind(runKey, steps, optionals = {}) {
    const {
        accountShortName, projectShortName,
        ephemeral, modelContext = {},
    } = optionals;
    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .post(`/run/rewind/${runKey}`, {
            body: {
                rewindCount: steps,
                modelContext,
                ephemeral,
            },
        });
}

export async function update(runKey, update, optionals = {}) {
    const { readLock, writeLock, trackingKey, marked, hidden, closed } = update;
    const { accountShortName, projectShortName } = optionals;
    const hasMultiple = Array.isArray(runKey) && runKey.length > 1;
    const uriComponent = hasMultiple ? '' : `/${runKey.length === 1 ? runKey[0] : runKey}`;

    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .withSearchParams(hasMultiple ? { runKey } : '')
        .patch(`/run${uriComponent}`, {
            body: {
                readLock,
                writeLock,
                trackingKey,
                marked,
                hidden,
                closed,
            },
        });
}

export async function remove(runKey, optionals = {}) {
    const { accountShortName, projectShortName } = optionals;
    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .delete(`/run/${runKey}`);
}

export async function get(runKey, optionals = {}) {
    const { accountShortName, projectShortName } = optionals;
    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .get(`/run/${runKey}`);
}

const MAX_URL_LENGTH = 2048;
export async function query(model, scope, optionals = {}) {
    const { scopeBoundary, scopeKey } = scope;
    const {
        filter, sort, first, max, timeout, projections,
        accountShortName, projectShortName,
    } = optionals;

    const query = {
        filter: [
            ...(filter.variables || []).map((statement) => prefix('var.', statement)),
            ...(filter.metadata || []).map((statement) => prefix('meta.', statement)),
        ].join(';'),
        sort: sort.join(';'),
        first,
        max,
        timeout,
        projections: [
            ...(projections.variables || []).map((name) => prefix('var.', name)),
            ...(projections.metadata || []).map((name) => prefix('meta.', name)),
        ].join(';'),
    };
    const uriComponent = `/run/${scopeBoundary}/${scopeKey}/${model}`;
    const router = new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .withSearchParams(query);

    const url = await router.getURL(uriComponent);
    return encodeURI(url.toString()).length > MAX_URL_LENGTH ?
        [/* Use the POST variant */] :
        await router.get(uriComponent);
}

export async function introspect(model, optionals = {}) {
    const { accountShortName, projectShortName } = optionals;
    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .get(`/run/introspect/${model}`);
}

export async function operation(runKey, name, args, optionals = {}) {
    const { accountShortName, projectShortName, timeout, ritual } = optionals;
    const hasMultiple = Array.isArray(runKey) && runKey.length > 1;
    const uriComponent = hasMultiple ? '' : `/${runKey.length === 1 ? runKey[0] : runKey}`;
    const searchParams = hasMultiple ? { runKey, timeout } : { ritual, timeout };

    if (ritual !== RITUALS.EXORCISE && hasMultiple) {
        console.warn(`Detected ritual: ${ritual} usage with multiple runKeys; this not allowed. Defaulting to ritual: EXORCISE`);
    }

    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .withSearchParams(searchParams)
        .post(`/run/operation${uriComponent}`, {
            body: { name, arguments: args },
        });
}

export async function getVariables(runKey, variables, optionals) {
    const { accountShortName, projectShortName, timeout, ritual } = optionals;
    const include = variables.join(';');
    const hasMultiple = Array.isArray(runKey) && runKey.length > 1;
    const uriComponent = hasMultiple ? '' : `/${runKey.length === 1 ? runKey[0] : runKey}`;
    const searchParams = hasMultiple ? { runKey, timeout, include } : { ritual, timeout, include };

    if (ritual !== RITUALS.EXORCISE && hasMultiple) {
        console.warn(`Detected ritual: ${ritual} usage with multiple runKeys; this not allowed. Defaulting to ritual: EXORCISE`);
    }

    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .withSearchParams(searchParams)
        .get(`/run/variable${uriComponent}`);
}

export async function getVariable(runKey, variable, optionals = {}) {
    const { accountShortName, projectShortName, timeout, ritual } = optionals;

    if (Array.isArray(runKey) || Array.isArray(variable)) {
        const variables = Array.isArray(variable) ? variable : [variable];
        return getVariables(runKey, variables, optionals);
    }

    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .withSearchParams({ timeout, ritual })
        .get(`/run/variable/${runKey}/${variable}`);
}

export async function updateVariables(runKey, update, optionals = {}) {
    const { accountShortName, projectShortName, timeout, ritual } = optionals;
    const hasMultiple = Array.isArray(runKey) && runKey.length > 1;
    const uriComponent = hasMultiple ? '' : `/${runKey.length === 1 ? runKey[0] : runKey}`;
    const searchParams = hasMultiple ? { runKey, timeout } : { ritual, timeout };

    if (ritual !== RITUALS.EXORCISE && hasMultiple) {
        console.warn(`Detected ritual: ${ritual} usage with multiple runKeys; this not allowed. Defaulting to ritual: EXORCISE`);
    }

    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .withSearchParams(searchParams)
        .patch(`/run/variable${uriComponent}`, { body: update });
}

export async function getMetadata(runKey, variables, optionals = {}) {
    const { accountShortName, projectShortName, timeout, ritual } = optionals;
    const include = variables.join(';');
    const hasMultiple = Array.isArray(runKey) && runKey.length > 1;
    const uriComponent = hasMultiple ? '' : `/${runKey.length === 1 ? runKey[0] : runKey}`;
    const searchParams = hasMultiple ? { runKey, timeout, include } : { ritual, timeout, include };

    if (ritual !== RITUALS.EXORCISE && hasMultiple) {
        console.warn(`Detected ritual: ${ritual} usage with multiple runKeys; this not allowed. Defaulting to ritual: EXORCISE`);
    }

    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .withSearchParams(searchParams)
        .get(`/run/meta${uriComponent}`);
}

export async function updateMetadata(runKey, update, optionals = {}) {
    const { accountShortName, projectShortName, timeout, ritual } = optionals;
    const hasMultiple = Array.isArray(runKey) && runKey.length > 1;
    const uriComponent = hasMultiple ? '' : `/${runKey.length === 1 ? runKey[0] : runKey}`;
    const searchParams = hasMultiple ? { runKey, timeout } : { ritual, timeout };

    if (ritual !== RITUALS.EXORCISE && hasMultiple) {
        console.warn(`Detected ritual: ${ritual} usage with multiple runKeys; this not allowed. Defaulting to ritual: EXORCISE`);
    }

    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .withSearchParams(searchParams)
        .patch(`/run/meta${uriComponent}`, { body: update });
}

export async function action(runKey, actionList, optionals = {}) {
    const { accountShortName, projectShortName, timeout, ritual } = optionals;
    const hasMultiple = Array.isArray(runKey) && runKey.length > 1;
    const uriComponent = hasMultiple ? '' : `/${runKey.length === 1 ? runKey[0] : runKey}`;
    const searchParams = hasMultiple ? { runKey, timeout } : { ritual, timeout };

    if (ritual !== RITUALS.EXORCISE && hasMultiple) {
        console.warn(`Detected ritual: ${ritual} usage with multiple runKeys; this not allowed. Defaulting to ritual: EXORCISE`);
    }

    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .withSearchParams(searchParams)
        .post(`/run/action${uriComponent}`, { body: actionList });
}
