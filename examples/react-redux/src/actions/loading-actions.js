import { SET_LOADING, setError } from 'actions';

export function setLoading(loadType, isLoading, ignoreLoadScreen = false) {
    return {
        type: SET_LOADING,
        loadType,
        isLoading,
        ignoreLoadScreen,
    };
}

const loadDelay = 350;

export const handleLoad = (promise, loadType, options = {}) => {
    const { ignoreLoadScreen, errorType } = options;
    return (dispatch) => {
        dispatch(setLoading(loadType, true, ignoreLoadScreen));
        return promise.then((data) => {
            // have a short delay on removing loading overlay; this makes the loading screen not just pop up and disappear on short loads and also keeps it up
            // on some loads that fire immediately after another load completes
            setTimeout(() => {
                dispatch(setLoading(loadType, false));
            }, loadDelay);
            return data;
        }).catch((error) => {
            console.error(`Error with ${loadType}:`, error);
            dispatch(setLoading(loadType, false));
            if (errorType !== null) {
                dispatch(setError(errorType, error));
            }
            return Promise.reject(error);
        });
    };
};
