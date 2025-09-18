/**
 * Enhanced filter functionality for epicenter-libs
 * Supports backwards-compatible string arrays, raw filter strings,
 * and object-based filter groups with arbitrary nesting
 */

export interface FilterGroup {
    type: 'and' | 'or' | 'taxonomy';
    filters: (string | FilterGroup)[];
}

export type FilterInput = string[] | string | FilterGroup;

/**
 * Recursively parses a FilterGroup object into a boolean filter string
 * @param group - FilterGroup object to parse
 * @returns Boolean filter string representation
 */
function parseFilterGroup(group: FilterGroup): string {
    if (!group.filters || group.filters.length === 0) {
        return '';
    }

    const parsedFilters = group.filters
        .map((filter) => {
            if (typeof filter === 'string') {
                return filter;
            }
            return parseFilterGroup(filter);
        })
        .filter((filter) => filter.length > 0);

    if (parsedFilters.length === 0) {
        return '';
    }

    if (!group.type || !['and', 'or', 'taxonomy'].includes(group.type)) {
        throw new Error(`Invalid or missing filter group type: ${group.type || 'undefined'}`);
    }

    const joinedFilters = parsedFilters.join(';');

    if (parsedFilters.length === 1) {
        return joinedFilters;
    }

    switch (group.type) {
        case 'and':
            return `(${joinedFilters})`;
        case 'or':
            return `[${joinedFilters}]`;
        case 'taxonomy':
            return `{${joinedFilters}}`;
        default:
            throw new Error(`Unexpected filter group type: ${group.type}`);
    }
}


/**
 * Parses various filter input formats into the platform's expected filter string format
 * @param filterInput - Array of strings, filter string, or FilterGroup object
 * @returns Platform-compatible filter string or undefined if no filters
 */
export function parseFilterInput(filterInput: FilterInput | undefined): string | undefined {
    if (!filterInput) {
        return undefined;
    }

    // Handle string array (backwards compatibility)
    if (Array.isArray(filterInput)) {
        return filterInput.length > 0 ? filterInput.join(';') : undefined;
    }

    // Handle raw string (pass through - allows advanced users to write boolean syntax directly)
    if (typeof filterInput === 'string') {
        return filterInput || undefined;
    }

    // Handle FilterGroup object
    return parseFilterGroup(filterInput) || undefined;
}
