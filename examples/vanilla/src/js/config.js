import { config } from 'epicenter';

if (config.isLocal()) {
    /* For Production Site */
    config.accountShortName = 'forio-dev';
    config.projectShortName = 'epi-v3';

    /* For Development Site (dev 2) */
    // config.accountShortName = 'test';
    // config.projectShortName = 'epi-v3';
    config.apiHost = 'epicenter-dev-2.forio.com';
    config.tokenOverride = 'eyJ0eXAiOiJKV1QiLA0KICJhbGciOiJSUzI1NiJ9.IkFETUlOOjAwMDAwMTdjMmQ1M2NiOWE0ZmE4NGQ3YzU1MzQwNGJkODYyYyI.ZnoeZu2ObDUHIunctSLsw5d8RwmZbX0s4fIT4AMLs3bfOx30AilsgmU0VdJ2Uq5oCLBYBffoM4MWtMPNNPj6yvPVxNCeGSwzP4fer7fXytOK-GOB0dDIQMz2z9k0mN_dfvAeBbWZxzTZfkJjFG7IEez6H8W634mP1WsqQfd-BNsCeRXad91QHZcLXNmwEO2UpTQZp8Yg99_LY0Fsq76G9i55K36vhLvZJoMIwSLsZawIiETyOVkJdt6eOKUvOOvFS45oFdfqac1OIi-z4afT4bRRrqRVd5RkEdB9Mxq3HqP3bCQUQX-V3EO6tq373no4rtIV85WEAkPp6nrrD6zkXA';
}
