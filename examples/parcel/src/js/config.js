import { config, version } from 'epicenter-libs';

if (config.isLocal()) {
    /* For Production Site */
    // config.accountShortName = 'forio-dev';
    // config.projectShortName = 'epi-v3';

    /* For Development Site (dev 2) */
    config.accountShortName = 'forio-dev';
    config.projectShortName = 'libs-v3-test';
    config.apiHost = 'epicenter-dev-2.forio.com';
    // config.projectShortName = 'epi-v3';
    // config.authOverride = 'Bearer {{token}}';

    console.log('%c Here’s the version', 'font-size: 20px; color: #FB15B9FF;', version);
}

if (module.hot) {
    module.hot.accept(() => {
        window.location.reload();
    });
}
