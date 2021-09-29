import {Router} from 'utils/index';

export interface Secret {
    password: string;
}

export interface AdminCreateView {
    handle: string;
    email: string;
    givenName?: string;
    familyName?: string;
    verified: true;
    active?: true;
}

export interface NativeAdminCreateView extends AdminCreateView {
    objectType: 'native';
    secret: Secret;
}

export async function createAdmin(view: AdminCreateView) {

    return await new Router()
        .withAccountShortName('epicenter')
        .withProjectShortName('manager')
        .post('/admin', {
            body: view,
        }).then(({body}) => body);
}

export async function getWithHandle(handle: string, optionals: GenericAdapterOptions = {}) {
    const {server} = optionals;
    return await new Router()
        .withServer(server)
        .withAccountShortName('epicenter')
        .withProjectShortName('manager')
        .get(`/admin/with/${handle}`, optionals)
        .then(({body}) => body);
}