import { Meteor } from 'meteor/meteor';
import { Match, check } from 'meteor/check';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

export const createUser = new ValidatedMethod({
  name: 'user.create',
  validate({ email, password, username, description }) {
    check(email, String);
    check(password, String);
    check(username, String);
    check(description, Match.Maybe(String));
  },
  run({ email, password, username, description }) {
    if (!Meteor.isServer) {
      return;
    }

    const user = Meteor.userId();
    if (user) {
      return;
    }

    const existedUser = Meteor.users.findOne({
      'emails.address': email,
    });

    if (existedUser) {
      throw new Meteor.Error('user-already-exists', `User already exists: ${email}`);
    }

    const userParams = {
      username,
      email,
      password,
      description,
    };

    return Accounts.createUser(userParams);
  },
});
