import fetch from 'cross-fetch';
import config from './utils/config';
import { prefix } from './utils/helpers';


export const proxy = async(
    resource: string,
    options?: RequestInit,
): Promise<Response> => {
    const { accountShortName, projectShortName, isLocal } = config;
    let path = prefix('/', resource);
    if (!isLocal()) path = `/proxy/${accountShortName}/${projectShortName}${path}`;
    return fetch(path, options);
};