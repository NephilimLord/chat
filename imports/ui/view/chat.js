import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Template } from 'meteor/templating';
import { Notifications } from 'meteor/gfk:notifications';
import { ReactiveVar } from 'meteor/reactive-var';

import { sendMessage } from '../../api/methods/messages-methods';
import { Messages } from '../../api/collections/messages';

import './chat.html';

Template.Chat.onCreated(function () {
  this.replyTo = new ReactiveVar('');
});

Template.Chat.onRendered(function () {
  setTimeout(() => $("#chat-container").animate({
    scrollTop: $('#chat-container').get(0).scrollHeight
  }, 1000), 300);
});

Template.Chat.helpers({
  isSubsReady() {
    return FlowRouter.subsReady();
  },
  getMessages() {
    return Messages.find().fetch();
  },
  getSenderInfo(id) {
    if (id === Meteor.userId()) {
      return 'Me';
    }

    return (Meteor.users.findOne(id) || {}).username;
  },
  isMineMessage(from) {
    return from === Meteor.userId();
  },
  getUserDescription(from) {
    if (from === Meteor.userId()) {
      return;
    }

    return (Meteor.users.findOne(from) || {}).description;
  },
  isReply() {
    return Template.instance().replyTo.get();
  },
  getReliedMessage(id) {
    if (!id) {
      return;
    }

    const messageDoc = Messages.findOne(id);
    const username = (Meteor.users.findOne(messageDoc.from) || {}).username;

    return {
      username,
      message: messageDoc.message || '',
    };
  },
  getMessageToReply() {
    const messageDoc = Messages.findOne(Template.instance().replyTo.get());
    const username = (Meteor.users.findOne(messageDoc.from) || {}).username;

    return {
      username,
      message: messageDoc.message || '',
    };
  },
});

Template.Chat.events({
  'submit .send-message-form'(e, t) {
    e.preventDefault();

    const message = (t.$('#message').val() || '').trim();
    if (!message) {
      Notifications.error('Enter message');

      return;
    }
    t.$('[type=submit]').prop('disabled', true);

    const reply = t.replyTo.get();

    sendMessage.call({ message, reply }, (err) => {
      t.$('[type=submit]').prop('disabled', false);
      if (err) {
        Notifications.error(err.message);

        return;
      }

      t.replyTo.set('');
      t.$('#message').val('');
      t.$("#chat-container").animate({
        scrollTop: $('#chat-container').get(0).scrollHeight
      }, 1000);
    });
  },
  'click button.reply'(e, t) {
    e.preventDefault();

    Template.instance().replyTo.set(this._id);
  },
});
