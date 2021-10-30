
export const stringToHTML = (str) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(str, 'text/html');
    return doc.body;
};

export const showLoading = () => {
    const loadingEl = document.getElementById('loading');
    if (loadingEl) return;
    const containerEl = document.createElement('div');
    containerEl.setAttribute('id', 'loading');
    const spinnerEl = stringToHTML('<div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>');
    spinnerEl.setAttribute('id', 'spinner');
    containerEl.appendChild(spinnerEl);
    document.body.appendChild(containerEl);
};

export const hideLoading = () => {
    const loadingEl = document.getElementById('loading');
    if (loadingEl) loadingEl.remove();
};
