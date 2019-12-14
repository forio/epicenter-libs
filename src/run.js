import Router from './router';
import { LOCK_TYPE, SCOPE_BOUNDARY, toQueryString, prefix } from './utility';


export async function create(model, scope, optionals = {}) {
    const { scopeBoundary, scopeKey, pseudonymKey } = scope;
    const {
        accountShortName, projectShortName, readLock, writeLock,
        morphology, ephemeral, trackingKey,
        modelContext = {/* Is not recorded for clone. Overrides model ctx2 file. */},
        executionContext = {/* Affected by clone. Carries arguments for model file worker on model initialization */},
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
                modelContext,
                executionContext,
                ephemeral,
            },
        });
}

export async function clone(runKey, trackingKey, optionals = {}) {
    const {
        accountShortName, projectShortName, ephemeral,
        modelContext = {}, executionContext = {},
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
    const queryString = hasMultiple ? toQueryString({ runKey }) : '';

    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .patch(`/run${uriComponent}${queryString}`, {
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

    const queryString = toQueryString({
        filter: [
            ...filter.variables.map((statement) => prefix('var.', statement)),
            ...filter.metaData.map((statement) => prefix('meta.', statement)),
        ].join(';'),
        sort: sort.join(';'),
        first,
        max,
        timeout,
        projections: [
            ...projections.variables.map((name) => prefix('var.', name)),
            ...projections.metaData.map((name) => prefix('meta.', name)),
        ].join(';'),
    });
    const uriComponent = `/run/${scopeBoundary}/${scopeKey}/${model}${queryString}`;
    const router = new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName);

    const url = router.getURL(uriComponent);
    return encodeURI(url).length > MAX_URL_LENGTH ?
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
    const queryString = hasMultiple ?
        toQueryString({ runKey, timeout }) :
        toQueryString({ ritual, timeout });

    if (ritual && hasMultiple) {
        console.warn(`Warning: detected ritual: ${ritual} usage with multiple runKeys; this not allowed. Defaulting to ritual: EXORCISE`);
    }

    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .post(`/run/operation${uriComponent}${queryString}`, {
            body: { name, arguments: args },
        });
}

export async function getVariables(runKey, variables, optionals) {
    const { accountShortName, projectShortName, timeout, ritual } = optionals;
    const include = variables.join(';');
    const hasMultiple = Array.isArray(runKey) && runKey.length > 1;
    const uriComponent = hasMultiple ? '' : `/${runKey.length === 1 ? runKey[0] : runKey}`;
    const queryString = hasMultiple ?
        toQueryString({ runKey, timeout, include }) :
        toQueryString({ ritual, timeout, include });

    if (ritual && hasMultiple) {
        console.warn(`Warning: detected ritual: ${ritual} usage with multiple runKeys; this not allowed. Defaulting to ritual: EXORCISE`);
    }

    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .get(`/run/variable${uriComponent}${queryString}`);
}

export async function getVariable(runKey, variable, optionals = {}) {
    const { accountShortName, projectShortName, timeout, ritual } = optionals;

    if (Array.isArray(runKey) || Array.isArray(variable)) {
        const variables = Array.isArray(variable) ? variable : [variable];
        return getVariables(runKey, variables, optionals);
    }
    const queryString = toQueryString({ timeout, ritual });

    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .get(`/run/variable/${runKey}/${variable}${queryString}`);
}

export async function updateVariables(runKey, update, optionals = {}) {
    const { accountShortName, projectShortName, timeout, ritual } = optionals;
    const hasMultiple = Array.isArray(runKey) && runKey.length > 1;
    const uriComponent = hasMultiple ? '' : `/${runKey.length === 1 ? runKey[0] : runKey}`;
    const queryString = hasMultiple ?
        toQueryString({ runKey, timeout }) :
        toQueryString({ ritual, timeout });

    if (ritual && hasMultiple) {
        console.warn(`Warning: detected ritual: ${ritual} usage with multiple runKeys; this not allowed. Defaulting to ritual: EXORCISE`);
    }

    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .patch(`/run/variable${uriComponent}${queryString}`, { body: update });
}

export async function getMetaData(runKey, variables, optionals = {}) {
    const { accountShortName, projectShortName, timeout, ritual } = optionals;
    const include = variables.join(';');
    const hasMultiple = Array.isArray(runKey) && runKey.length > 1;
    const uriComponent = hasMultiple ? '' : `/${runKey.length === 1 ? runKey[0] : runKey}`;
    const queryString = hasMultiple ?
        toQueryString({ runKey, timeout, include }) :
        toQueryString({ ritual, timeout, include });

    if (ritual && hasMultiple) {
        console.warn(`Warning: detected ritual: ${ritual} usage with multiple runKeys; this not allowed. Defaulting to ritual: EXORCISE`);
    }

    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .get(`/run/meta${uriComponent}${queryString}`);
}

export async function updateMetaData(runKey, update, optionals = {}) {
    const { accountShortName, projectShortName, timeout, ritual } = optionals;
    const hasMultiple = Array.isArray(runKey) && runKey.length > 1;
    const uriComponent = hasMultiple ? '' : `/${runKey.length === 1 ? runKey[0] : runKey}`;
    const queryString = hasMultiple ?
        toQueryString({ runKey, timeout }) :
        toQueryString({ ritual, timeout });

    if (ritual && hasMultiple) {
        console.warn(`Warning: detected ritual: ${ritual} usage with multiple runKeys; this not allowed. Defaulting to ritual: EXORCISE`);
    }

    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .patch(`/run/meta${uriComponent}${queryString}`, { body: update });
}

export async function action(runKey, actionList, optionals = {}) {
    const { accountShortName, projectShortName, timeout, ritual } = optionals;
    const hasMultiple = Array.isArray(runKey) && runKey.length > 1;
    const uriComponent = hasMultiple ? '' : `/${runKey.length === 1 ? runKey[0] : runKey}`;
    const queryString = hasMultiple ?
        toQueryString({ runKey, timeout }) :
        toQueryString({ ritual, timeout });

    if (ritual && hasMultiple) {
        console.warn(`Warning: detected ritual: ${ritual} usage with multiple runKeys; this not allowed. Defaulting to ritual: EXORCISE`);
    }

    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .post(`/run/action${uriComponent}${queryString}`, { body: actionList });
}
