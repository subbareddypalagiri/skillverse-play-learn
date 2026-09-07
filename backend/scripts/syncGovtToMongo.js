import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://myapiuser:Rise12345@cluster0.2fgdxiq.mongodb.net/skillverse?retryWrites=true&w=majority&appName=Cluster0';

async function syncGovtJobs() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 8000 });
    const db = mongoose.connection.db;

    const filePath = path.resolve('data/govt_opportunities.json');
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const items = JSON.parse(rawData);

    console.log(`Loaded ${items.length} government opportunities from JSON.`);

    const operations = items.map(item => {
      const org = item.department || item.organization || 'Government Department';
      const category = item.category === 'railway' ? 'railways' : item.category === 'defense' ? 'defense_psu' : item.category;

      let expiresAt = undefined;
      if (item.lastDate && item.lastDate !== 'Extended' && !isNaN(new Date(item.lastDate).getTime())) {
        expiresAt = new Date(item.lastDate);
      }

      return {
        updateOne: {
          filter: {
            title: item.title,
            organization: org,
            type: 'govt'
          },
          update: {
            $set: {
              title: item.title,
              organization: org,
              department: org,
              type: 'govt',
              category: category,
              categoryLabel: item.categoryLabel,
              vacancies: item.vacancies || 'Various',
              qualification: item.qualification,
              ageLimit: item.ageLimit,
              salary: item.salary || item.salaryScale,
              salaryScale: item.salaryScale || item.salary,
              location: item.location || 'Andhra Pradesh / India',
              applyLink: item.applyLink || item.officialApplyLink || 'https://psc.ap.gov.in',
              officialApplyLink: item.officialApplyLink || item.applyLink || 'https://psc.ap.gov.in',
              notificationPdfLink: item.notificationPdfLink || item.notificationPdf || item.applyLink,
              importantDates: {
                notificationDate: item.postedDate ? new Date(item.postedDate) : new Date(),
                lastDate: expiresAt || new Date('2026-12-31')
              },
              tags: Array.isArray(item.tags) ? item.tags : [],
              description: item.description || `${item.title} recruitment by ${org}.`,
              status: 'active',
              source: 'verified_gazette',
              postedAt: item.postedDate ? new Date(item.postedDate) : new Date(),
              expiresAt: expiresAt || new Date('2026-12-31')
            }
          },
          upsert: true
        }
      };
    });

    console.log(`Executing bulkWrite for ${operations.length} records...`);
    const res = await db.collection('opportunities').bulkWrite(operations, { ordered: false });
    console.log(`Sync Completed! Upserted: ${res.upsertedCount}, Modified: ${res.modifiedCount}, Matched: ${res.matchedCount}`);

    const activeGovtCount = await db.collection('opportunities').countDocuments({ type: 'govt', status: 'active' });
    console.log(`Total active 'govt' opportunities in MongoDB now: ${activeGovtCount}`);

    await mongoose.disconnect();
    console.log('Finished successfully.');
  } catch (err) {
    console.error('Error syncing:', err);
    process.exit(1);
  }
}

syncGovtJobs();
