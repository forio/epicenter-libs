import {Router} from 'utils/index';

export async function google(humanKey: string) {
    return await new Router()
        .withAccountShortName('epicenter')
        .withProjectShortName('manager')
        .get(`/recaptcha/google/${humanKey}`)
        .then(({body}) => body);
}