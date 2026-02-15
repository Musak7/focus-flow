// Test script to verify Jira API connection
// Run with: node test-jira-connection.js

require('dotenv').config({ path: '.env.local' });

const JIRA_DOMAIN = (process.env.JIRA_DOMAIN || "").replace(/^https?:\/\//, "").replace(/\/$/, "");
const EMAIL = process.env.JIRA_EMAIL;
const TOKEN = process.env.JIRA_API_TOKEN;
const PROJECT_KEY = process.env.JIRA_PROJECT_KEY || "SCRUM";

console.log('\n🔍 Testing Jira Connection...\n');
console.log('Domain:', JIRA_DOMAIN);
console.log('Email:', EMAIL);
console.log('Project:', PROJECT_KEY);
console.log('Token:', TOKEN ? '✅ Set' : '❌ Missing');

if (!JIRA_DOMAIN || !EMAIL || !TOKEN) {
  console.error('\n❌ Missing credentials in .env.local\n');
  process.exit(1);
}

const auth = Buffer.from(`${EMAIL}:${TOKEN}`).toString('base64');
const url = `https://${JIRA_DOMAIN}/rest/api/3/search?jql=project=${PROJECT_KEY}&maxResults=5`;

console.log('\n🌐 Testing URL:', url);

fetch(url, {
  method: 'GET',
  headers: {
    'Authorization': `Basic ${auth}`,
    'Accept': 'application/json',
  }
})
  .then(async (response) => {
    if (!response.ok) {
      const error = await response.text();
      console.error(`\n❌ API Error (${response.status}):`, error);
      process.exit(1);
    }
    return response.json();
  })
  .then((data) => {
    console.log(`\n✅ Success! Found ${data.issues.length} issues:`);
    data.issues.forEach((issue) => {
      console.log(`  - ${issue.key}: ${issue.fields.summary} [${issue.fields.status.name}]`);
    });
    console.log('\n✨ Jira connection is working!\n');
  })
  .catch((error) => {
    console.error('\n❌ Connection failed:', error.message);
    process.exit(1);
  });
