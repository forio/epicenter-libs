import * as router from './router.js';
import * as utility from './utility.js';

export function create(createDto) {

    return utility.EpicenterPromise(router.POST('/account', createDto, null));
}

// should take an updater
export function update(updateDto) {

    return utility.EpicenterPromise(router.PATCH('/account', updateDto, null));
}

export function remove(accountShortName) {

    return utility.EpicenterPromise(router.DELETE('/account', new router.RouteBuilder().withAccountShortName(accountShortName).build()));
}

class AccountCreateInDto {

    constructor(objectType, name, shortName, adminKey) {

        this.objectType = objectType;

        this.name = name;
        this.shortName = shortName;
        this.adminKey = adminKey;
    }
}

export class PersonalAccountCreateInDto extends AccountCreateInDto {

    constructor(name, shortName, adminKey) {

        super('personal', name, shortName, adminKey);
    }
}

export class TeamAccountCreateInDto extends AccountCreateInDto {

    constructor(name, shortName, adminKey, subscriptionPlan, billingInterval) {

        super('team', name, shortName, adminKey);

        this.subscriptionPlan = subscriptionPlan;
        this.billingInterval = billingInterval;
    }
}