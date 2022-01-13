import './config';
import {
    authAdapter, assetAdapter,
    SCOPE_BOUNDARY,
} from 'epicenter-libs';
const session = authAdapter.getLocalSession();

/* Define DOM elements */
const unauthedEl = document.getElementById('unauthed');
const uploadEl = document.getElementById('upload');
const fileInputEl = document.getElementById('file-input');
const assetListEl = document.getElementById('asset-list');

const scope = {
    scopeBoundary: SCOPE_BOUNDARY.GROUP,
    scopeKey: session.groupKey,
};
const initialize = () => {
    assetAdapter.list(scope, { userKey: session.userKey, filter: 'testfile*' }).then((assets) => {
        assetListEl.innerHTML = '';
        if (assets.length === 0) assetListEl.innerHTML = 'No assets were found';
        assets.forEach((asset) => {
            const item = document.createElement('li');
            item.onclick = async() => {
                assetAdapter.get(asset.assetKey);
                assetAdapter.getUrl(asset.assetKey);
                assetAdapter.getUrlWith(asset.file, scope, { userKey: session.userKey });
            };
            item.innerText = asset.file;
            assetListEl.append(item);
        });
    });
    uploadEl.onclick = async() => {
        const file = fileInputEl.files[0];
        if (!file) return;
        await assetAdapter.store(file, scope, { userKey: session.userKey, overwrite: true });
    };
};

if (!session) {
    unauthedEl.classList.remove('hidden');
} else {
    initialize();
}