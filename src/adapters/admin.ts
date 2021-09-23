import { Router } from 'utils/index';


export async function getWithHandle(
    handle: string,
    optionals: GenericAdapterOptions = {}
): Promise<Admin> {
    const { server } = optionals;
    return await new Router()
        .withServer(server)
        .withAccountShortName('epicenter')
        .withProjectShortName('manager')
        .get(`/admin/with/${handle}`)
        .then(({ body }) => body);
}