'use strict'
const utils = require('../utility/utils');
const data = require('./data.json');
const arrays = require('./arrays.json');

module.exports.exampleFunction = async (event, context) => {
  const filters = [
    {
      filterColumn: 'wfp_person[Employment Status]',
      filterValue: 'Inactive',
      on: 'YES'
    },
    {
      filterColumn: 'wfp_person[Current BU]',
      filterValue: 'MED',
      on: 'NO'
    },
    {
      filterColumn: 'wfp_person[Email]',
      getEmail: 'S'
    }
  ];
  const bodyObj = JSON.parse(event.body);
  const documents = bodyObj.flag === 'test_mode' ? { profiles: [] } : {profiles: utils.filterProfiles(arrays, filters)};
  const records = utils.convertToEmailList(documents.profiles, filters);
  const deletedCount = records.length; 
  console.log("records.emails", records.emails);
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: bodyObj.parameter,
      records: records,
      deletedCount: deletedCount
    })
  }
}
