

interface GenericScope {
    scopeBoundary: string,
    scopeKey: string,
}

interface GenericAdapterOptions {
    server?: string,
    accountShortName?: string,
    projectShortName?: string,
}

interface GenericAdapterQueryOptions extends GenericAdapterOptions {
    filter?: string[],
    sort?: string[],
    first?: number,
    max?: number,
}

interface FIXME {

}
