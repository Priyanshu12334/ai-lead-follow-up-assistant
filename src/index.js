import "dotenv/config";

import { getAuthClient } from "./auth.js";
import { getLeads, updateLeadStatus } from "./sheets.js";
import { generateEmail } from "./ai.js";
import { createDraft } from "./gmail.js";

async function main() {
  try {
    console.log("Starting AI Lead Follow-Up Assistant...\n");

    const auth = await getAuthClient();

    console.log("Google authentication successful!\n");

    const leads = await getLeads(auth);

    console.log(`Found ${leads.length} leads.\n`);

    for (const lead of leads) {

      // Skip already processed leads
      if (lead.status === "Draft Created") {
        console.log(`Skipping ${lead.name} - already processed.`);
        continue;
      }

      console.log(`Processing ${lead.name}...`);

      // Generate personalized email
      const email = await generateEmail(lead);

      console.log("AI email generated.");

      // Create Gmail draft
      const draft = await createDraft(
        auth,
        lead.email,
        email.subject,
        email.body
      );

      console.log(`Gmail draft created for ${lead.name}`);
      console.log(`Draft ID: ${draft.id}`);

      // Update status in Google Sheet
      await updateLeadStatus(
        auth,
        lead.rowNumber,
        "Draft Created"
      );

      console.log(`Status updated for ${lead.name}\n`);
    }

    console.log("All leads processed successfully!");

  } catch (error) {
    console.error(
      "ERROR:",
      error.response?.data || error.message
    );
  }
}

main();