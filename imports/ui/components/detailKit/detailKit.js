// import { Links } from '/imports/api/links/links.js';
// import { ListKits } from '/imports/api/collections/collections.js';
import { Meteor } from 'meteor/meteor';
import './detailKit.html';
const url = "http://localhost:1111";
Template.detailKit.onCreated(function () {
  // // Meteor.subscribe('links.all');
  //
  // Meteor.subscribe('listKits.all');

});

Template.detailKit.helpers({
  links() {

      // if (ListKits.find().count() !== 0){
      //     Session.set("listKits", ListKits.find().fetch());
      // }
      // return Links.find({});
  },
});

Template.detailKit.events({
  'submit .info-link-add'(event) {

  },
});
Template.detailKit.onRendered(() => {

    // console.log(url);
    // getDataOfKit("sads");
});

