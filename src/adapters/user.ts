import { Router } from 'utils/index';

interface UploadOptions extends GenericAdapterOptions {
    groupKey?: string,
    overwrite?: boolean,
}

export async function uploadCSV(
    file: File,
    optionals: UploadOptions = {}
): Promise<void> {
    const {
        overwrite,
        accountShortName, projectShortName,
    } = optionals;

    const formdata = new FormData();
    formdata.append('file', file);

    return await new Router()
        .withAccountShortName(accountShortName)
        .withProjectShortName(projectShortName)
        .withSearchParams({ overwrite })
        .post('/user/upload', { body: formdata })
        .then(({ body }) => body);
}
