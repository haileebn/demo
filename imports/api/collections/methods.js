// Methods related to links

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { ListKits } from './collections.js';

Meteor.methods({
  'listKits.all'() {
    // check(url, String);
    // check(title, String);
    return ListKits.find({}).fetch();
  },

});
