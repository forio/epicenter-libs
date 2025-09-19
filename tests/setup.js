import { afterEach, vi } from 'vitest';

// Create a mock fetch function
const mockFetch = vi.fn();

// Mock the cross-fetch module BEFORE importing epicenter
vi.mock('cross-fetch', () => ({
    default: mockFetch,
    __esModule: true,
}));

// Also mock global fetch for any direct usage
vi.stubGlobal('fetch', mockFetch);

// Set a default implementation
mockFetch.mockImplementation(() => 
    Promise.resolve(new Response(JSON.stringify({}), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    }))
);

// Now import epicenter test build that has cross-fetch as external
const epicenterModule = await import('../dist/test/epicenter.js');

// Make epicenter globally available for tests
globalThis.epicenter = epicenterModule;
globalThis.mockFetch = mockFetch;

// Clean up after each test
afterEach(() => {
    // Clear any stored sessions
    if (globalThis.epicenter?.authAdapter) {
        globalThis.epicenter.authAdapter.removeLocalSession();
    }
    // Clear mock history but keep the mock function
    mockFetch.mockClear();
});