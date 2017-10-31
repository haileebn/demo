// import { Links } from '/imports/api/links/links.js';
// import { ListKits } from '/imports/api/collections/collections.js';
import { Meteor } from 'meteor/meteor';
import './navbar.html';

Template.navbar.onCreated(function () {
  // // Meteor.subscribe('links.all');
  //
  // Meteor.subscribe('listKits.all');
});

Template.navbar.helpers({
  links() {

      // if (ListKits.find().count() !== 0){
      //     Session.set("listKits", ListKits.find().fetch());
      // }
      // return Links.find({});
  },
});

Template.navbar.events({
  'submit .info-link-add'(event) {

  },
  'click #open-menu'(event) {
    // const widthScreen = window.innerWidth || document.body.clientWidth;
    // // console.log(widthScreen);
    // if (widthScreen > 414){
    //     document.getElementById('navbar').style.width = "33.33%";
    // }
    // else
    document.getElementById('navbar').style.width = "100%";
  },
  'click #close-menu'(event) {
    document.getElementById('navbar').style.width = "0";
  },

});
Template.navbar.onRendered(() => {

});
