
export const showLoading = () => {
    const loadingEl = document.getElementById('loading');
    if (loadingEl) return;
    const containerEl = document.createElement('div');
    containerEl.setAttribute('id', 'loading');
    const spinnerEl = document.createElement('span');
    spinnerEl.setAttribute('id', 'spinner');
    containerEl.appendChild(spinnerEl);
    document.body.appendChild(containerEl);
};

export const hideLoading = () => {
    const loadingEl = document.getElementById('loading');
    if (loadingEl) loadingEl.remove();
};