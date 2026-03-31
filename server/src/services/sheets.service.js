const { GoogleSpreadsheet } = require("google-spreadsheet");
const { JWT } = require("google-auth-library");

let doc;

const getDoc = async () => {
  if (!doc) {
    doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    }));
  }

  await doc.loadInfo();
  return doc;
};

const getSheet = async () => {
  const spreadsheet = await getDoc();
  const sheet = spreadsheet.sheetsByIndex[0];

  if (!sheet) {
    throw new Error("No sheets found in the configured spreadsheet.");
  }

  return sheet;
};

const appendBooking = async (data) => {
  const sheet = await getSheet();
  return sheet.addRow(data);
};

const getAllBookings = async () => {
  const sheet = await getSheet();
  const rows = await sheet.getRows();

  return rows.map((row) => ({
    id: row.rowNumber,
    ...row.toObject(),
  }));
};

const updateBookingStatus = async (rowId, newStatus, remarks) => {
  const sheet = await getSheet();
  const rows = await sheet.getRows();
  const numericRowId = Number.parseInt(rowId, 10);
  const rowToUpdate = rows.find((row) => row.rowNumber === numericRowId);

  if (!rowToUpdate) {
    return null;
  }

  rowToUpdate.assign({
    Status: newStatus,
    ...(remarks !== undefined && { Remarks: remarks }),
  });
  await rowToUpdate.save();

  return rowToUpdate.toObject();
};

module.exports = { appendBooking, getAllBookings, updateBookingStatus };
