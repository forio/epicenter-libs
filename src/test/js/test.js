import * as epicenter from 'epicenter-libs';

epicenter.authentication.authenticate(new epicenter.authentication.AdminAuthenticationToken("dberkman@forio.com", "logos1174!"))
  .then(foo => {
    console.log(foo);

    epicenter.channel.connect();
    epicenter.channel.connect();
    epicenter.channel.connect();

    /*
    epicenter.authentication.upgrade(new epicenter.authentication.AdminUpgrade("berkteam"))
      .then(foo => {
        console.log(foo);

        epicenter.account.create(new epicenter.account.TeamAccountCreator("Berk Team", "berkteam", "12323", "ENTERPRISE", "YEARLY"))
          .then(foo => console.log(foo))
          .catch(fault => console.log(JSON.stringify(fault)));
      })
      .catch(fault => console.log(JSON.stringify(fault)));
     */
  })
  .catch(fault => console.log(JSON.stringify(fault)));