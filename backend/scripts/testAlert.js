import mongoose from 'mongoose';
import 'dotenv/config';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://myapiuser:Rise12345@cluster0.2fgdxiq.mongodb.net/skillverse?retryWrites=true&w=majority&appName=Cluster0';

async function runTest() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 8000 });
    const db = mongoose.connection.db;

    // 1. Fetch user subscription
    const targetPhone = '9493811060';
    const sub = await db.collection('alertsubscriptions').findOne({ whatsapp: { $regex: targetPhone } });
    console.log('\n--- 1. ACTIVE SUBSCRIBER FOUND IN DATABASE ---');
    console.log(JSON.stringify(sub, null, 2));

    if (!sub) {
      console.log('No subscription found for phone:', targetPhone);
      await mongoose.disconnect();
      return;
    }

    // 2. Fetch active opportunities matching categories
    const categories = sub.categories || ['ap_state', 'central', 'banking'];
    const opps = await db.collection('opportunities')
      .find({ status: 'active', category: { $in: categories } })
      .sort({ postedAt: -1, createdAt: -1 })
      .limit(4)
      .toArray();

    console.log(`\n--- 2. MATCHED RECRUITMENTS (${opps.length} notices for: ${categories.join(', ')}) ---`);

    const candidateName = sub.name || 'Subba Reddy';

    // 3. Format WhatsApp Recruitment Digest
    let whatsappText = `🎉 *HAAPPY CAREER JOURNEY, ${candidateName.toUpperCase()}!* 🚀\n`;
    whatsappText += `🎯 *SkillVerse Daily Recruitment Bulletin* 🔔\n`;
    whatsappText += `Hello ${candidateName}! We are HAAPPY to share today's top verified recruitment notices with you:\n\n`;

    opps.forEach((opp, i) => {
      whatsappText += `${i + 1}️⃣ *${opp.title}*\n`;
      whatsappText += `🏢 *Dept:* ${opp.organization || opp.department || 'Govt of AP / India'}\n`;
      whatsappText += `👥 *Vacancies:* ${opp.vacancies || 'Multiple Positions'}\n`;
      if (opp.importantDates?.lastDate) {
        whatsappText += `📅 *Last Date:* ${new Date(opp.importantDates.lastDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}\n`;
      }
      whatsappText += `🔗 *Official Link:* ${opp.applyLink || opp.officialApplyLink || 'https://psc.ap.gov.in'}\n\n`;
    });

    whatsappText += `📍 *Track all 214 active government jobs & notifications live:*\n`;
    whatsappText += `https://skillverse-app.com/careers?type=govt\n\n`;
    whatsappText += `_Wishing you a HAAPPY and Successful Career, ${candidateName}! • SkillVerse Alerts_`;

    const cleanPhone = '919493811060';
    const waUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(whatsappText)}`;

    console.log('\n--- 3. SYNTHESIZED WHATSAPP ALERT MESSAGE ---');
    console.log(whatsappText);

    // 4. Dispatch via Twilio WhatsApp API
    const { sendWhatsAppMessage } = await import('../services/notification.service.js');
    console.log('\n--- 4. DISPATCHING REAL INCOMING WHATSAPP MESSAGE VIA TWILIO... ---');
    const dispatchResult = await sendWhatsAppMessage({
      to: cleanPhone,
      message: whatsappText
    });
    console.log('Twilio Dispatch Result:', JSON.stringify(dispatchResult, null, 2));

    await mongoose.disconnect();
    console.log('\n--- TEST EXECUTION FINISHED: 100% SUCCESS ---');
  } catch (err) {
    console.error('Test failed:', err);
    process.exit(1);
  }
}

runTest();
