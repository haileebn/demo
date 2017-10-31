// Fill the DB with example data on startup

import { Meteor } from 'meteor/meteor';
import { Links } from '../../api/links/links.js';
import { ListKits } from '../../api/collections/collections.js';

Meteor.startup(() => {
  // if the Links collection is empty
  if (Links.find().count() === 0) {
    const data = [
      {
        title: 'Do the Tutorial',
        url: 'https://www.meteor.com/try',
        createdAt: new Date(),
      },
      {
        title: 'Follow the Guide',
        url: 'http://guide.meteor.com',
        createdAt: new Date(),
      },
      {
        title: 'Read the Docs',
        url: 'https://docs.meteor.com',
        createdAt: new Date(),
      },
      {
        title: 'Discussions',
        url: 'https://forums.meteor.com',
        createdAt: new Date(),
      },
    ];

    data.forEach(link => Links.insert(link));
  }
  // if (ListKits.find().count() === 0) {
  //   // const json =
  //   const data = [
  //       {
  //           "KitID": "FAirKit_000001",
  //           "Name": "Fimo 518",
  //           "Location": [21.038189,105.7827482],
  //           "PM25": 22,
  //           "CreatedTime": 1508383622
  //       },
  //       {
  //           "KitID": "FAirKit_000001",
  //           "Name": "Fimo 408",
  //           "Location": [21.038189,105.7837482],
  //           "PM25": 54,
  //           "CreatedTime": 1508383620
  //       },
  //   ];
  //   data.forEach(kit => ListKits.insert(kit));
  // }
});
