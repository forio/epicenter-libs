import Router from '../utils/router';

/**
 * Verifies a Google reCAPTCHA token
 * Base URL: POST `https://forio.com/api/v3/epicenter/manager/recaptcha/google`
 *
 * @example
 * import { recaptchaAdapter } from 'epicenter-libs';
 * const result = await recaptchaAdapter.google(token);
 *
 * @param humanKey  The reCAPTCHA token to verify
 * @returns promise that resolves to the verification result
 */
export async function google(humanKey: string) {
    return await new Router()
        .withAccountShortName('epicenter')
        .withProjectShortName('manager')
        .post('/recaptcha/google', {
            body: { humanKey: humanKey },
        })
        .then(({ body }) => body);
}
