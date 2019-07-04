import * as router from './router.js';
import * as utility from './utility.js';

export class Account {

  create(creator) {

    return utility.EpicenterPromise(router.POST('/account', creator, null));
  }

  // should take an updater
  update(creator) {

    return utility.EpicenterPromise(router.POST('/account', creator, null));
  }

  delete(creator) {

    return utility.EpicenterPromise(router.POST('/account', creator, null));
  }
}

class AccountCreator {

  constructor(objectType, name, shortName, adminKey) {

    this.objectType = objectType;

    this.name = name;
    this.shortName = shortName;
    this.adminKey = adminKey;
  }
}

export class PersonalAccountCreator extends AccountCreator {

  constructor(name, shortName, adminKey) {

    super('personal', name, shortName, adminKey);
  }
}

export class TeamAccountCreator extends AccountCreator {

  constructor(name, shortName, adminKey, subscriptionPlan, billingInterval) {

    super('team', name, shortName, adminKey);

    this.subscriptionPlan = subscriptionPlan;
    this.billingInterval = billingInterval;
  }
}