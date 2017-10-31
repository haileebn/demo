// All links-related publications

import { Meteor } from 'meteor/meteor';
import { ListKits } from '../collections.js';

Meteor.publish('listKits.all', function () {
  return ListKits.find();
});
