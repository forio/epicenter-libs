import { expect } from 'chai';
const { config } = epicenter;

describe('Initial Tests', () => {
    it('Should instantiate config with the default CookieStore', () => {
        expect(config.browserStorageType).to.equal('COOKIE');
    });

    it('Should instantiate config with the default CookieStore', () => {
        config.browserStorageType = 'SESSION';
        expect(config.browserStorageType).to.equal('SESSION');
    });
});
