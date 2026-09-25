import path from "node:path";
import { authenticate } from "@google-cloud/local-auth";

const SCOPES = [
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/gmail.compose",
];

export async function getAuthClient() {
  const auth = await authenticate({
    keyfilePath: path.join(process.cwd(), "credentials.json"),
    scopes: SCOPES,
  });

  return auth;
}