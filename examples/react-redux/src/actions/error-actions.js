import { SET_ERROR } from 'actions';

export const setError = (errorType, body) => ({
    type: SET_ERROR,
    errorType,
    body,
});
