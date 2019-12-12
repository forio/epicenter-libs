import { expect } from 'chai';
const { config, utility } = epicenter;

describe('Config', () => {
    it('Should properly set config browserStorageType', () => {
        expect(config.browserStorageType).to.equal('COOKIE');

        config.browserStorageType = 'SESSION';
        expect(config.browserStorageType).to.equal('SESSION');

        expect(() => config.browserStorageType = 'TEST').to.throw(utility.EpicenterError);
    });
});
