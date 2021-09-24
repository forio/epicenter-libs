import { config } from 'epicenter';

if (config.isLocal()) {
    /* For Production Site */
    config.accountShortName = 'forio-dev';
    config.projectShortName = 'epi-v3';

    /* For Development Site (dev 2) */
    // config.accountShortName = 'test';
    // config.projectShortName = 'epi-v3';
    config.apiHost = 'epicenter-dev-2.forio.com';
    config.tokenOverride = 'eyJ0eXAiOiJKV1QiLA0KICJhbGciOiJSUzI1NiJ9.IkFETUlOOjAwMDAwMTdjMTQ3MGVjODZlYTRkZGY0MzVhZWViYzVhYzQzMCI.LiWzXePNd85TJYvkjCRA9JjL_pdHfTX78pbhBZXOuls1Dx-IAAhQ5SygmT1VN28TfF6ggTtBmFMwQ3KAuQFs8gcEBkL3StCZ8frSDdwdZIbdMMZgBAy5Az5nwChl2Hjq9frNc5Dd7adWa9X7qsucFwz_Xe_aWK9Ycv6RNA3qjMuwY1NNfqGo5My0lH2Am9PPFPVOAcmyEVx0x7ntQAchvZATS1zLHjvsj0kXn2IWLe-PO-eVdUxzVJos5A7d-6yQ3mLPJ0TYopA11aBSAsoIpOOLuviu6h3AiRGDP0c-Bvq8psJR-6mzCj1MnTW_tV0FX0Wp3wwsxh94dRi_DBY8JQ';
}
