const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const WebsiteContent = require('./models/WebsiteContent');

// Load .env from backend directory
dotenv.config({ path: path.join(__dirname, '.env') });

/**
 * This seeder only updates the donations page content using companyprofile.md
 * It will:
 *  - connect to MONGO_URI
 *  - parse the "***Donations Page***" block from companyprofile.md
 *  - replace existing WebsiteContent documents for page: 'donations' with a single section
 */

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const markdownPath = path.join(__dirname, '..', 'companyprofile.md');
    const md = fs.readFileSync(markdownPath, 'utf-8');

    const parsed = parseDonations(md);
    if (!parsed) {
      throw new Error('Could not find ***Donations Page*** section in companyprofile.md');
    }

    const { heading, paragraphs, list } = parsed;

    // Replace existing donations page content
    await WebsiteContent.deleteMany({ page: 'donations' });
    console.log('🧹 Cleared existing donations page content');

    const doc = await WebsiteContent.create({
      page: 'donations',
      section: heading || 'Donations',
      order: 0,
      content: {
        heading: heading || 'Donations',
        paragraphs: paragraphs && paragraphs.length ? paragraphs : ['We’d love to hear from you. You can donate using the details below.'],
        list: Array.isArray(list) ? list : [],
      },
    });

    console.log('✅ Seeded donations content:', JSON.stringify(doc, null, 2));
  } catch (err) {
    console.error('❌ Donations seeding failed:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

/**
 * Parse the Donations Page section from companyprofile.md
 * Expected format in markdown:
 *
 * ***Donations Page***
 * You can send your donation to:
 * * Mobile Account #: +231773125527 or +231886472010
 * * Name: #Samuel_Grimes_Initiative
 */
function parseDonations(markdown) {
  const lines = markdown.split('\n');
  let inDonationsPage = false;
  let paragraphs = [];
  let list = [];
  let heading = 'Donations';

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const line = raw.trim();

    if (line.startsWith('***') && line.endsWith('***')) {
      const title = line.slice(3, -3).trim();
      // Enter or exit donations page
      if (/^donations\s+page$/i.test(title)) {
        inDonationsPage = true;
        heading = 'Donations';
        continue;
      } else if (inDonationsPage) {
        // Next page started; stop collecting
        break;
      }
    }

    if (!inDonationsPage) continue;

    // Collect list items beginning with single asterisk (not bold **)
    if (line.startsWith('* ') && !line.startsWith('**')) {
      list.push(line.replace(/^\*\s*/, ''));
    } else if (line) {
      // Non-empty, non-list lines become paragraph text
      paragraphs.push(line);
    }
  }

  if (!inDonationsPage) return null;

  // Clean up paragraphs: remove redundant heading lines and whitespace
  paragraphs = paragraphs.filter(p => !p.startsWith('***') && p.length > 0);

  // If the first paragraph is just an instruction line, keep it; otherwise default kept
  return { heading, paragraphs, list };
}

run();
