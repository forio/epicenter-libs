import { config } from 'epicenter';

if (config.isLocal()) {
    /* For Production Site */
    config.accountShortName = 'forio-dev';
    config.projectShortName = 'epi-v3';

    /* For Development Site (dev 2) */
    // config.accountShortName = 'test';
    // config.projectShortName = 'epi-v3';
    config.apiHost = 'epicenter-dev-2.forio.com';
    config.tokenOverride = 'eyJ0eXAiOiJKV1QiLA0KICJhbGciOiJSUzI1NiJ9.IkFETUlOOjAwMDAwMTdjMjZmNjU1MmY1NjdiMTllMzZhMjBiMmZhOGUyZSI.m2a1q8zGyih6JCJhmqJhqG-B4ZBqj0Zct8MM7T1MDWJSZRNI2eYu6DubxzIzuoh6Cgz2gKbRP82nIsSJyWrgcl4JjPWBQTFNDX_uMK9mvNYXHsLD6f92NV9inImfwMFCiC2HaIgi49gIXlQ5YbC3xx0mkGUwAW1-8EcvUm5JZo_6085wVd2Zod1YH5wcru2eYcmGkggOVKTFYQmVov_K8NdomZozzO03Divp-yC2kgUlnZfbTGJ9pV0iDHAbdcsUm2Ed_ot4is7zTbK2a78aSw7OuBLT8KhHYcWkHasjXEfLJ18IWs5iCOCgaPpio0yiRyYuIAvLbCD__-wB8dI6Vw';
}
