import { Meteor } from 'meteor/meteor';
import { Notifications } from 'meteor/gfk:notifications';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap';

Meteor.startup(function () {
  Notifications.defaultOptions.timeout = 5000;
});
