import { Router } from 'utils/index';

interface UploadOptions extends RoutingOptions {
    groupKey?: string,
    overwrite?: boolean,
}

export async function uploadCSV(
    file: File,
    optionals: UploadOptions = {}
): Promise<void> {
    const {
        overwrite,
        ...routingOptions
    } = optionals;

    const formdata = new FormData();
    formdata.append('file', file);

    return await new Router()
        .withSearchParams({ overwrite })
        .post('/user/upload', {
            body: formdata,
            ...routingOptions,
        })
        .then(({ body }) => body);
}
