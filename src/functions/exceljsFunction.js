'use strict'
const ExcelJS = require('exceljs');
const utils = require('../utility/utils');

module.exports.exceljsFunction = async (event, context) => {
    const header = [];
    const rows = [];
    const stream = utils.getMetadata();
    const workbook = new ExcelJS.Workbook();
    const buff = Buffer.from(stream.metadata, "base64"); // don't use "utf-8"
    await workbook.xlsx.load(buff);
    var sheet = await workbook.getWorksheet(0);
    var worksheet = workbook.getWorksheet(sheet);
    worksheet.eachRow({ includeEmpty: true }, function(row, rowNumber) {
        if (header.length === 0) {
            header.push(row.values);
        } else {
            rows.push(row.values);
        }
    });
    const json = [];
    for (var i = 0; i < rows.length; i++) {
        for (var k = 0; k < header.length; k++) {
            const rowObject = {};
            for (var j = 0; j < rows[i].length; j++) {
                const objAttribute = header[k][j] === undefined ? 'undefined' : header[k][j];
                const objValue = rows[i][j];
                rowObject[objAttribute] = objValue;
            }
            json.push(rowObject);
        }
    }
    console.log("json", json);
    const data = [];
    json.forEach(value => {
        const rowObject = {};
        const keyNames = Object.keys(value);
        keyNames.forEach(keyName => {
            if (value[keyName] !== undefined) {
                rowObject[keyName] = value[keyName];
            }
        });
        data.push(rowObject);
    })
    return {
        statusCode: 200,
        data: data
    }
}
