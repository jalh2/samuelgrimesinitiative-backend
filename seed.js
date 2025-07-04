const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const WebsiteContent = require('./models/WebsiteContent');
const User = require('./models/User');

dotenv.config({ path: path.join(__dirname, '.env') });

const VALID_PAGES = ['home', 'about', 'team', 'programs', 'donations', 'gallery', 'contact'];

// --- Main Seeding Function ---
const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Database connected successfully.');

    await User.deleteMany({});
    console.log('✅ All existing users cleared.');

    const markdownContent = fs.readFileSync(path.join(__dirname, '..', 'companyprofile.md'), 'utf-8');
    console.log('Markdown content loaded, length:', markdownContent.length);
    
    // Debug: Check if gallery page section exists in markdown
    if (markdownContent.includes('***Gallery Page***')) {
      console.log('Found ***Gallery Page*** in markdown');
    } else {
      console.log('⚠️ ***Gallery Page*** not found in markdown');
    }
    
    const allParsedContent = parseMarkdown(markdownContent);
    console.log('Pages found after parsing:', [...new Set(allParsedContent.map(item => item.page))]);

    const homePageInstructions = allParsedContent.filter(c => c.page === 'home');
    const otherPagesContent = allParsedContent.filter(c => c.page !== 'home');
    
    // Debug: Check if gallery content was parsed
    const galleryParsed = otherPagesContent.filter(c => c.page === 'gallery');
    console.log(`Gallery items parsed: ${galleryParsed.length}`);
    if (galleryParsed.length > 0) {
      console.log('Gallery sections:', galleryParsed.map(g => g.section));
    }

    const homePageContent = generateHomePageContent(homePageInstructions, otherPagesContent);

    const finalContentToSeed = [...otherPagesContent, ...homePageContent];
    
    // Debug: Check if gallery content exists
    const galleryContent = finalContentToSeed.filter(item => item.page === 'gallery');
    console.log(`Gallery content items: ${galleryContent.length}`);
    if (galleryContent.length === 0) {
      console.log('⚠️ No gallery content found to seed!');
      console.log('Pages found:', [...new Set(finalContentToSeed.map(item => item.page))]);
    } else {
      console.log('Gallery content:', JSON.stringify(galleryContent, null, 2));
    }

    await WebsiteContent.deleteMany({});
    await WebsiteContent.insertMany(finalContentToSeed);

    console.log('✅ Database seeded successfully according to companyprofile.md instructions.');

  } catch (err) {
    console.error('❌ Error seeding database:', err.message);
    if (err.errors) {
        console.error('Validation Errors:', JSON.stringify(err.errors, null, 2));
    }
  } finally {
    await mongoose.disconnect();
    console.log('Database connection closed.');
  }
};

// --- Helper: Generate Home Page Content ---
function generateHomePageContent(instructions, allContent) {
  const homeContent = [];
  let order = 0;

  const getFirstSection = (name) => allContent.find(c => c.page === name);

  for (const instruction of instructions) {
    order++;
    const sectionType = instruction.section.toLowerCase();
    let newSection = null;

    if (sectionType.includes('hero')) {
      const aboutUsSection = getFirstSection('about');
      
      // Convert image1.png to Base64 for hero section
      let heroImageBase64 = null;
      try {
        const imagePath = '/images/image1.png';
        const fullPath = path.join(__dirname, '..', 'frontend', 'public', imagePath);
        const imageBuffer = fs.readFileSync(fullPath);
        const base64Image = imageBuffer.toString('base64');
        const mimeType = path.extname(fullPath).substring(1);
        heroImageBase64 = `data:image/${mimeType};base64,${base64Image}`;
        console.log('✅ Hero image converted to Base64');
      } catch (e) {
        console.warn(`⚠️ Warning: Could not find or read hero image. Using placeholder.`);
        heroImageBase64 = null;
      }
      
      newSection = {
        page: 'home',
        section: 'Hero',
        order,
        content: {
          heading: 'Samuel Grimes Initiative',
          paragraphs: aboutUsSection ? aboutUsSection.content.paragraphs.slice(0, 1) : ['Empowering at-risk youth for a brighter future.'],
          heroImage: heroImageBase64, // Store the Base64 image
          buttons: [
            { text: 'Our Programs', link: '/programs', variant: 'primary' },
            { text: 'Donate Now', link: '/donations', variant: 'secondary' },
          ],
        },
      };
    } else if (sectionType.includes('programs')) {
        const programSection = getFirstSection('programs');
        newSection = createSnippet(order, 'Our Programs', programSection, '/programs');
    } else if (sectionType.includes('about')) {
        const aboutSection = getFirstSection('about');
        newSection = createSnippet(order, 'About Our Mission', aboutSection, '/about');
    } else if (sectionType.includes('team')) {
        const teamSection = getFirstSection('team');
        newSection = createSnippet(order, 'Meet Our Team', teamSection, '/team');
    } else if (sectionType.includes('contact')) {
      newSection = {
        page: 'home',
        section: 'Contact Us',
        order,
        content: {
          heading: 'Get In Touch',
          paragraphs: ['Have questions or want to get involved? We’d love to hear from you.'],
          component: 'ContactForm',
        },
      };
    // Footer section removed - using static footer from layout instead
    }

    if (newSection) {
      homeContent.push(newSection);
    }
  }
  return homeContent;
}

// --- Helper: Create a Snippet Section ---
function createSnippet(order, heading, sourceSection, link) {
  return {
    page: 'home',
    section: `Snippet: ${heading}`,
    order,
    content: {
      heading: heading,
      paragraphs: sourceSection ? sourceSection.content.paragraphs.slice(0, 1) : ['Learn more about our work and how you can help.'],
      buttons: [{ text: 'Learn More', link }],
    },
  };
}

// --- Helper: Parse Markdown File ---
function parseMarkdown(markdownContent) {
  const data = [];
  const lines = markdownContent.split('\n');
  let currentPage = '';
  let currentSection = null;
  let order = 0;
  let inJsonBlock = false;
  let jsonContent = '';

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || line.startsWith('//')) continue;

    // Handle JSON code blocks for team members
    if (trimmed === '```json') {
      inJsonBlock = true;
      jsonContent = '';
      continue;
    }

    if (inJsonBlock) {
      if (trimmed === '```') {
        inJsonBlock = false;
        try {
          const parsedJson = JSON.parse(jsonContent);
          if (parsedJson.teamMembers && Array.isArray(parsedJson.teamMembers)) {
            // Process team members with photos
            if (!currentSection.content.teamMembers) {
              currentSection.content.teamMembers = [];
            }
            
            // Process each team member and convert photo paths to base64
            for (const member of parsedJson.teamMembers) {
              if (member.photo) {
                const fullPath = path.join(__dirname, '..', 'frontend', 'public', member.photo);
                try {
                  const imageBuffer = fs.readFileSync(fullPath);
                  const base64Image = imageBuffer.toString('base64');
                  const mimeType = path.extname(fullPath).substring(1);
                  member.photo = `data:image/${mimeType};base64,${base64Image}`;
                } catch (e) {
                  console.warn(`\u26a0\ufe0f  Warning: Could not find or read team member photo ${fullPath}. Using placeholder.`);
                  member.photo = null; // Set to null if image can't be found
                }
              }
              currentSection.content.teamMembers.push(member);
            }
          }
        } catch (e) {
          console.warn(`\u26a0\ufe0f  Warning: Could not parse JSON content. Skipping.`, e);
        }
        continue;
      }
      jsonContent += line + '\n';
      continue;
    }

    const pageMatch = trimmed.match(/^\*\*\*(.+?)\*\*\*$/);
    if (pageMatch) {
      let potentialPage = pageMatch[1].replace(/ page$/i, '').toLowerCase();
      if (VALID_PAGES.includes(potentialPage)) {
        currentPage = potentialPage;
        order = 0;
        currentSection = null;
        if (currentPage === 'home') {
            // This line is an instruction for the home page
            data.push({ page: 'home', section: pageMatch[1], order: ++order });
        }
        console.log(`Found page: ${currentPage}`);
      } else {
          // It's likely an instruction for the current page (e.g. home)
          if(currentPage === 'home') {
              data.push({ page: 'home', section: pageMatch[1], order: ++order });
          }
      }
      continue;
    }

    const sectionMatch = trimmed.match(/^\*\*(.+?)\*\*$/);
    if (sectionMatch) {
      const sectionTitle = sectionMatch[1];
      if (!currentPage) continue;
      
      // Skip Contact Page sections if we're in the Gallery page
      if (currentPage === 'gallery' && (sectionTitle === 'Contact Page' || sectionTitle === 'Address')) {
        console.log(`Skipping section ${sectionTitle} in ${currentPage} page`);
        continue;
      }

      order++;
      currentSection = {
        page: currentPage,
        section: sectionTitle,
        order: order,
        content: { 
          heading: sectionTitle, 
          paragraphs: [], 
          list: [],
          images: [], // Array for gallery images
          teamMembers: [] // Array for team members
        },
      };
      data.push(currentSection);
      continue;
    }
    
    if (!currentSection) continue;

    if (trimmed.startsWith('- ')) {
      const imagePath = trimmed.substring(2).trim();
      const fullPath = path.join(__dirname, '..', 'frontend', 'public', imagePath);
      try {
        const imageBuffer = fs.readFileSync(fullPath);
        const base64Image = imageBuffer.toString('base64');
        const mimeType = path.extname(fullPath).substring(1);
        currentSection.content.images.push(`data:image/${mimeType};base64,${base64Image}`);
      } catch (e) {
        console.warn(`⚠️  Warning: Could not find or read image ${fullPath}. Skipping.`);
      }
    } else if (trimmed.startsWith('*') && !trimmed.startsWith('**')) {
      // This is a subheading for a gallery section
      if (currentPage === 'gallery' && currentSection.content.paragraphs.length === 0) {
        currentSection.content.paragraphs.push(trimmed.replace(/^\*\s*/, ''));
      } else {
        currentSection.content.list.push(trimmed.replace(/^\*\s*/, ''));
      }
    } else if (!trimmed.startsWith('*')) {
      currentSection.content.paragraphs.push(trimmed);
    }
  }
  return data;
}

seedDB();
