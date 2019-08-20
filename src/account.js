import * as router from './router.js';

export async function create(createDto) {

    return await router.POST('/account', createDto, null);
}

// should take an updater
export async function update(updateDto) {

    return await router.PATCH('/account', updateDto, null);
}

export async function remove(accountShortName) {

    return await router.DELETE('/account', new router.RouteBuilder().withAccountShortName(accountShortName).build());
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