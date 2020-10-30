import { config } from 'epicenter';

if (config.isLocal()) {
    /* For Production Site */
    // config.accountShortName = 'forio-dev';
    // config.projectShortName = 'epi-v3';

    /* For Development Site (dev 2) */
    config.accountShortName = 'test';
    config.projectShortName = 'epi-v3';
    config.apiHost = 'epicenter-dev-2.forio.com';
}
