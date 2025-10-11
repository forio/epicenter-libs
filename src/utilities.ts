import fetch from 'cross-fetch';
import config from './utils/config';
import { prefix } from './utils/helpers';
import { parseFilterInput } from './utils/filter-parser';
import type { FilterGroup, FilterInput } from './utils/filter-parser';


export const proxy = async (
    resource: string,
    options?: RequestInit,
): Promise<Response> => {
    const { accountShortName, projectShortName, isLocal } = config;
    let path = prefix('/', resource);
    if (!isLocal()) path = `/proxy/${accountShortName}/${projectShortName}${path}`;
    return fetch(path, options);
};

// Export filter utilities for testing and advanced usage
export { parseFilterInput };
export type { FilterGroup, FilterInput };