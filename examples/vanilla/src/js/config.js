import { config } from 'epicenter';

if (config.isLocal()) {
    /* For Production Site */
    config.accountShortName = 'forio-dev';
    config.projectShortName = 'epi-v3';

    /* For Development Site (dev 2) */
    // config.accountShortName = 'test';
    // config.projectShortName = 'epi-v3';
    // config.apiHost = 'epicenter-dev-2.forio.com';
    // config.tokenOverride = 'eyJ0eXAiOiJKV1QiLA0KICJhbGciOiJSUzI1NiJ9.IkFETUlOOjAwMDAwMTdjMmU3OWFhM2ZjZjNmN2IzYmM0MTc4Njk3ZGZmMCI.qLgHbaA7yYSYPlLTo4xuhoY3lOUaH0p8hLBALzeMus147uI7DU3-VvqqBJSUrtqHgmZGWhHimYi2bpeXCF16XK9YaJYAuO-ogdHMD55HWb1bDwiFfW0OqS2ICx4ewrN-QSFQbFibCTstqmUS41ySdzJOsMa9riDKOGU0iG0F9EigUYVNnpBIPVRLWsToMVBrmnG09yg9gBmE-DkBxTkvdm-G3RNgPLBvK-W2Vg_ym31g3SzQ7rUTx5aF00Es7xBCgH4vUhTb25K9U4bpMgZD-wVmllgNA-t6OHLzItZHBBp1wyVtbfE2wXMIZ9O8gV-6FeCgzNB7uOXBCPXp3fidfA';
}
