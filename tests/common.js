export const OK_CODE = 200;
export const CREATED_CODE = 201;
export const UNAUTHORIZED_CODE = 401;

export const ACCOUNT = 'forio-dev';
export const PROJECT = 'epi-v3';

export const SESSION_KEY = 'com.forio.epicenter.session';
export const SESSION = {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJncmVldGluZ3MiOiJ0aGlzIGlzIGEgZHVtbXkgdGVzdCB0b2tlbiBmb3IgRXBpY2VudGVyIEpTIGxpYnMifQ.5B8wdwycKfuRpFkHMLUajUdO6jpYt6mC_uTGJJ6ftK4',
    expires: true,
    timeoutMinutes: 240,
    groupRole: 'PARTICIPANT',
    loginMethod: { objectType: 'sso' },
    assignedWorldKeys: [],
    assignedWorldRoles: [],
    userHandle: 'myhandle',
    userKey: '00000168bad586135710e2d9104c12846820',
    displayName: 'My Display Name',
    accountShortName: 'acme',
    projectShortName: 'simulations',
    groupName: 'mygroupname',
    groupKey: '00000165ad4e6a3cd22b993340b963820239',
    objectType: 'user',
};

export const GENERIC_OPTIONS = {
    server: 'https://mydomain.com',
    accountShortName: 'myaccount',
    projectShortName: 'myproject',
};

// Helper function to create a fetch mock with common responses
export const createFetchMock = (additionalResponses = {}) => {
    const capturedRequests = [];

    const fetchStub = globalThis.mockFetch || globalThis.fetch;

    fetchStub.mockClear();

    // eslint-disable-next-line complexity
    fetchStub.mockImplementation((url, options = {}) => {
        // Normalize options and add missing properties for compatibility
        const normalizedOptions = {
            method: 'GET',
            headers: {},
            ...options,
        };

        const requestObject = {
            url,
            options: normalizedOptions,
            method: normalizedOptions.method,
            requestBody: normalizedOptions.body,
            requestHeaders: normalizedOptions.headers,
        };

        capturedRequests.push(requestObject);

        // Check for additional custom responses first
        for (const pattern in additionalResponses) {
            if (url.includes(pattern)) {
                const response = additionalResponses[pattern];
                return Promise.resolve(new Response(
                    typeof response.body === 'string' ? response.body : JSON.stringify(response.body), 
                    {
                        status: response.status || OK_CODE,
                        headers: response.headers || { 'Content-Type': 'application/json' },
                    }
                ));
            }
        }

        // Default common responses
        if (url.includes('/authentication')) {
            return Promise.resolve(new Response(JSON.stringify(SESSION), {
                status: CREATED_CODE,
                headers: { 'Content-Type': 'application/json' },
            }));
        }

        if (url.includes('/logout')) {
            return Promise.resolve(new Response('', {
                status: OK_CODE,
                headers: { 'Content-Type': 'application/json' },
            }));
        }

        // Handle pagination requests
        if (url.includes('/pagination')) {
            const urlObj = new URL(url);
            const first = parseInt(urlObj.searchParams.get('first') || '0', 10);
            const max = parseInt(urlObj.searchParams.get('max') || '10', 10);

            // Full dataset for pagination testing
            const allData = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
            const values = allData.slice(first, first + max);

            const paginationResponse = {
                firstResult: first,
                maxResults: max,
                totalResults: allData.length,
                values: values,
            };

            return Promise.resolve(new Response(JSON.stringify(paginationResponse), {
                status: OK_CODE,
                headers: { 'Content-Type': 'application/json' },
            }));
        }

        // Handle unauthorized requests for error testing
        if (url.includes('/unauthorized')) {
            return Promise.resolve(new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: UNAUTHORIZED_CODE,
                headers: { 'Content-Type': 'application/json' },
            }));
        }

        // Handle run queries (pagination endpoints for runs)
        if (url.includes('/run/') && (url.includes('/in/') || url.match(/\/run\/[^\/]+\/[^\/]+\//))) {
            const urlObj = new URL(url);
            const first = parseInt(urlObj.searchParams.get('first') || '0', 10);
            const max = parseInt(urlObj.searchParams.get('max') || '10', 10);

            // For getWithStrategy tests, return results with existing runs by default
            if (urlObj.searchParams.get('max') === '1' && 
                urlObj.searchParams.get('sort') === '-run.created') {
                const queryResponse = {
                    firstResult: 0,
                    maxResults: 1,
                    totalResults: 1,
                    values: [{ runKey: '123456789', created: '2023-01-01' }],
                };

                return Promise.resolve(new Response(JSON.stringify(queryResponse), {
                    status: OK_CODE,
                    headers: { 'Content-Type': 'application/json' },
                }));
            }

            // Mock run objects for regular query results
            const allRuns = [
                { key: 'run1', created: '2023-01-01', variables: { var1: 'value1' } },
                { key: 'run2', created: '2023-01-02', variables: { var2: 'value2' } },
                { key: 'run3', created: '2023-01-03', variables: { var3: 'value3' } },
                { key: 'run4', created: '2023-01-04', variables: { var4: 'value4' } },
                { key: 'run5', created: '2023-01-05', variables: { var5: 'value5' } },
            ];
            const values = allRuns.slice(first, first + max);

            const queryResponse = {
                firstResult: first,
                maxResults: max,
                totalResults: allRuns.length,
                values: values,
            };

            return Promise.resolve(new Response(JSON.stringify(queryResponse), {
                status: OK_CODE,
                headers: { 'Content-Type': 'application/json' },
            }));
        }

        // Default response for other requests
        return Promise.resolve(new Response(JSON.stringify({}), {
            status: OK_CODE,
            headers: { 'Content-Type': 'application/json' },
        }));
    });
    
    return {
        fetchStub,
        capturedRequests,
        restore: () => fetchStub.mockClear(),
    };
};

export const { 
    ROLE,
    RITUAL,
    config, 
    SCOPE_BOUNDARY,
    Router,
    runAdapter, 
    authAdapter, 
    timeAdapter, 
    vaultAdapter,
    errorManager,
    groupAdapter, 
    worldAdapter, 
    walletAdapter,
    projectAdapter, 
    consensusAdapter,
    somebodyAdapter, 
    leaderboardAdapter,
} = globalThis.epicenter || {};

export const testedMethods = [];

// Helper function to get authorization header (case-insensitive)
export const getAuthHeader = (requestHeaders) => {
    return requestHeaders.authorization || requestHeaders.Authorization;
};

// Helper function to get permit confirmation header (case-insensitive)
export const getPermitHeader = (requestHeaders) => {
    return requestHeaders['x-forio-confirmation'] ||
        requestHeaders['X-Forio-Confirmation'] ||
        requestHeaders['X-FORIO-CONFIRMATION'];
};