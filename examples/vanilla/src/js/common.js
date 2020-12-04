import { SCOPE_BOUNDARY } from 'epicenter';
import { config } from 'epicenter';
import * as epicenter from 'epicenter';

console.log('%c !!M!!M', 'font-size: 20px; color: #FB15B9FF;', epicenter, SCOPE_BOUNDARY);

if (config.isLocal()) {
    /* For Production Site */
    // config.accountShortName = 'forio-dev';
    // config.projectShortName = 'epi-v3';

    /* For Development Site (dev 2) */
    config.accountShortName = 'test';
    config.projectShortName = 'epi-v3';
    config.apiHost = 'epicenter-dev-2.forio.com';
}
