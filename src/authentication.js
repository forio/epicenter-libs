import * as router from './router.js';
import * as store from './store.js';
import * as utility from './utility.js';

export function authenticate(token) {

    return new Promise((resolve, reject) => {
        router.POST('/authentication', token, token.withRoute(), false)
            .then((result) => {
                store.StorageManager.setItem(utility.AUTH_TOKEN, result.body.session);
                resolve(result);
            })
            .catch((fault) => {
                reject(fault);
            });
    });
}

export function upgrade(upgrade) {

    return new Promise((resolve, reject) => {
        router.PATCH('/authentication', upgrade, upgrade.withRoute())
            .then((result) => {
                store.StorageManager.setItem(utility.AUTH_TOKEN, result.body.session);

                resolve(result);
            })
            .catch((fault) => {

                reject(fault);
            });
    });
}

class AuthenticationToken {

    constructor(objectType) {

        this.objectType = objectType;
    }
}

export class AdminAuthenticationToken extends AuthenticationToken {

    #accountShortName = null;

    constructor(handle, password, accountShortName) {

        super('admin');

        this.handle = handle;
        this.password = password;

        this.#accountShortName = accountShortName;
    }

    withRoute() {


        return (!this.#accountShortName) ?
            null :
            new router.RouteBuilder().withAccountShortName(this.#accountShortName).build();
    }
}

export class UserAuthenticationToken extends AuthenticationToken {

    #accountShortName;
    #projectShortName;

    constructor(accountShortName, projectShortName, modality, handle, password, groupKey, mfaCode) {
        super('user');


        this.modality = modality;
        this.handle = handle;
        this.password = password;
        this.groupKey = groupKey;
        this.mfaCode = mfaCode;

        this.#accountShortName = accountShortName;
        this.#projectShortName = projectShortName;
    }

    withRoute() {

        return new router.RouteBuilder()
            .withAccountShortName(this.#accountShortName)
            .withProjectShortName(this.#projectShortName)
            .build();
    }
}


class Upgrade {

    constructor(objectType) {

        this.objectType = objectType;
    }
}

export class AdminUpgrade extends Upgrade {

    #accountShortName = null;

    constructor(accountShortName) {

        super('admin');

        this.#accountShortName = accountShortName;
    }

    withRoute() {
        return (!this.#accountShortName) ? null : new router.RouteBuilder().withAccountShortName(this.#accountShortName).build();
    }
}

export class UserUpgrade extends Upgrade {

    #accountShortName;
    #projectShortName;

    constructor(accountShortName, projectShortName, groupKey) {

        super('user');


        this.groupKey = groupKey;

        this.#accountShortName = accountShortName;
        this.#projectShortName = projectShortName;
    }

    withRoute() {

        return new router.RouteBuilder().withAccountShortName(this.#accountShortName).withProjectShortName(this.#projectShortName).build();
    }
}


