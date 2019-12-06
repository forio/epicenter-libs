import Router from './router';
import { LOCK_TYPE, SCOPE_BOUNDARY, toQueryString } from './utility';

export async function create(options = {}) {
    const { scopeBoundary, scopeKey, trackingKey, model, pseudonymKey, readLock, writeLock, ...others } = options;
    const { accountShortName, projectShortName } = others;

    const defaultLock = scopeBoundary === SCOPE_BOUNDARY.WORLD ? LOCK_TYPE.PARTICIPANT : LOCK_TYPE.USER;

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
                trackingKey,
                modelFile: model,
                modelContext: {/* Overrides model ctx2 but not stored for clone.  */},
                executionContext: {/* Carries over for clones. Carries arguments for model file worker on model initialization */},
            },
        });
}

export async function clone(runKey, options = {}) {
    const { trackingKey, model, ...others } = options;
    const { accountShortName, projectShortName } = others;
    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .post(`/run/clone/${runKey}`, {
            body: {
                trackingKey,
                modelFile: model,
                modelContext: {},
                executionContext: {},
            },
        });
}

export async function restore(runKey, options = {}) {
    const { accountShortName, projectShortName } = options;
    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .post(`/run/restore/${runKey}`, {
            body: {
                modelContext: {},
                executionContext: {},
            },
        });
}

export async function rewind(runKey, steps, options = {}) {
    const { accountShortName, projectShortName } = options;
    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .post(`/run/rewind/${runKey}`, {
            body: {
                rewindCount: steps,
                modelContext: {},
            },
        });
}

export async function update(runKey, options = {}) {
    const { readLock, writeLock, trackingKey, marked, hidden, closed, ...others } = options;
    const { accountShortName, projectShortName } = others;
    const suffix = Array.isArray(runKey) ? toQueryString(runKey) : `/${runKey}`;

    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .patch(`/run${suffix}`, {
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

export async function remove(runKey, options = {}) {
    const { accountShortName, projectShortName } = options;
    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .delete(`/run/${runKey}`);
}

export async function get(runKey, options = {}) {
    const { accountShortName, projectShortName } = options;
    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .get(`/run/${runKey}`);
}

export async function query(options = {}) {
    const { scopeBoundary, scopeKey, model, accountShortName, projectShortName, ...others } = options;
    const { filter, sort, first, max, timeout, projections } = others;
    const queryString = toQueryString({ filter, sort, first, max, timeout, projections });

    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .get(`/run/${scopeBoundary}/${scopeKey}/${model}${queryString}`);

}

export async function introspect(model, options = {}) {
    const { accountShortName, projectShortName } = options;
    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .get(`/run/introspect/${model}`);
}

export async function operation(runKey, name, args, options = {}) {
    const { accountShortName, projectShortName, ...others } = options;
    const { timeout, ritual } = others;
    const queryString = Array.isArray(runKey) ?
        toQueryString({ runKey, timeout }) :
        toQueryString({ ritual, timeout });

    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .post(`/run/operation/${Array.isArray(runKey) ? '' : runKey}${queryString}`, {
            body: {
                name,
                arguments: args,
            },
        });
}

export async function getVariables(runKey, variables, options) {
    const { accountShortName, projectShortName, ...others } = options;
    const { timeout, ritual } = others;
    const include = variables.join(';');
    const suffix = Array.isArray(runKey) ?
        toQueryString({ runKey, timeout, include }) :
        `/${toQueryString({ ritual, timeout, include })}`;

    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .get(`/run/variable/${Array.isArray(runKey) ? '' : runKey}${suffix}`);
}

export async function getVariable(runKey, variable, options = {}) {
    const { accountShortName, projectShortName, ...others } = options;
    const { timeout, ritual } = others;

    if (Array.isArray(runKey) || Array.isArray(variable)) {
        const variables = Array.isArray(variable) ? variable : [variable];
        return getVariables(runKey, variables, options);
    }
    const queryString = toQueryString({ timeout, ritual });

    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .get(`/run/variable/${runKey}/${variable}${queryString}`);
}

export async function updateVariables(runKey, update, options = {}) {
    const { accountShortName, projectShortName, ...others } = options;
    const { timeout, ritual } = others;
    const suffix = Array.isArray(runKey) ?
        toQueryString({ runKey, timeout }) :
        `/${runKey}${toQueryString({ ritual, timeout })}`;

    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .patch(`/run/variable${suffix}`, { body: update });
}

export async function getMetaData(runKey, variables, options) {
    const { accountShortName, projectShortName, ...others } = options;
    const { timeout, ritual } = others;
    const include = variables.join(';');
    const suffix = Array.isArray(runKey) ?
        toQueryString({ runKey, timeout, include }) :
        `/${runKey}${toQueryString({ ritual, timeout, include })}`;

    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .get(`/run/operation/${runKey}${suffix}`);
}

export async function updateMetaData(runKey, update, options = {}) {
    const { accountShortName, projectShortName, ...others } = options;
    const { timeout, ritual } = others;
    const suffix = Array.isArray(runKey) ?
        toQueryString({ runKey, timeout }) :
        `/${runKey}${toQueryString({ ritual, timeout })}`;

    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .patch(`/run/meta${suffix}`, { body: update });
}

export async function action(runKey, actionList, options = {}) {
    const { accountShortName, projectShortName, ...others } = options;
    const { timeout, ritual } = others;
    const suffix = Array.isArray(runKey) ?
        toQueryString({ runKey, timeout }) :
        `/${runKey}${toQueryString({ ritual, timeout })}`;

    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .post(`/run/action${suffix}`, { body: actionList });
}
