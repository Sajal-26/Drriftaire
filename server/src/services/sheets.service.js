const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
}));

const appendBooking = async (data) => {
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    return await sheet.addRow(data);
};

module.exports = { appendBooking };