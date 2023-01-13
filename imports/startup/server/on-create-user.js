import { Accounts } from 'meteor/accounts-base';

Accounts.onCreateUser((opts = {}, user) => {
  return Object.assign(user, { description: opts.description || '' });
});
