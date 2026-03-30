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

const getAllBookings = async () => {
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();
    return rows.map(row => ({
        id: row.rowNumber, // Use the row number as a unique ID for updates
        ...row.toObject()
    }));
};

const updateBookingStatus = async (rowId, newStatus, remarks) => {
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();
    
    // Find the exact row by its rowNumber
    const rowToUpdate = rows.find(r => r.rowNumber === parseInt(rowId));
    
    if (rowToUpdate) {
        rowToUpdate.assign({ 
            Status: newStatus, 
            ...(remarks !== undefined && { Remarks: remarks }) 
        });
        await rowToUpdate.save();
        return rowToUpdate.toObject();
    }
    return null;
};

module.exports = { appendBooking, getAllBookings, updateBookingStatus };