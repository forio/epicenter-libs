import { Router } from 'utils/index';

export async function google(humanKey: string) {
    return await new Router()
        .withAccountShortName('epicenter')
        .withProjectShortName('manager')
        .post('/recaptcha/google', {
            body: { humanKey: humanKey },
        })
        .then(({ body }) => body);
}
