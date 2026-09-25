const SPREADSHEET_ID =
  "1mnNPIygm1zQ5kp1sCHA-E0Bk3Y_NmRqMYSEs-rXhgAg";

export async function getLeads(auth) {
  const { token } = await auth.getAccessToken();

  const response = await auth.request({
    url: `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/A1:G`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const rows = response.data.values || [];

  if (rows.length < 2) {
    return [];
  }

  const [, ...data] = rows;

  return data.map((row, index) => ({
    rowNumber: index + 2,
    name: row[0] || "",
    email: row[1] || "",
    company: row[2] || "",
    requirement: row[3] || "",
    budget: row[4] || "",
    message: row[5] || "",
    status: row[6] || "New",
  }));
}


export async function updateLeadStatus(auth, rowNumber, status) {
  const { token } = await auth.getAccessToken();

  await auth.request({
    url: `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Sheet1!G${rowNumber}?valueInputOption=USER_ENTERED`,
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    data: {
      range: `Sheet1!G${rowNumber}`,
      majorDimension: "ROWS",
      values: [[status]],
    },
  });
}