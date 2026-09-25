const GMAIL_API_URL =
  "https://gmail.googleapis.com/gmail/v1/users/me/drafts";

export async function createDraft(auth, to, subject, body) {
  const { token } = await auth.getAccessToken();

  const email = [
    `To: ${to}`,
    "MIME-Version: 1.0",
    'Content-Type: text/plain; charset="UTF-8"',
    `Subject: ${subject}`,
    "",
    body,
  ].join("\r\n");

  const raw = Buffer.from(email).toString("base64url");

  const response = await auth.request({
    url: GMAIL_API_URL,
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    data: {
      message: {
        raw: raw,
      },
    },
  });

  return response.data;
}