import 'dotenv/config';
import { sendWhatsAppMessage } from '../services/notification.service.js';

async function testTwilio() {
  console.log('Testing Twilio WhatsApp Dispatch with credentials...');
  console.log('Account SID:', process.env.TWILIO_ACCOUNT_SID ? process.env.TWILIO_ACCOUNT_SID.slice(0, 8) + '...' : 'Missing');
  console.log('From Number:', process.env.TWILIO_WHATSAPP_NUMBER);
  console.log('Target Phone:', '+919493811060');

  const testMessage = `🎯 *SkillVerse Live Alert Test* 🔔\n\nHello Subba Reddy! Your direct incoming WhatsApp alerts are now officially CONNECTED! 🚀\n\nTop Alert Today:\n1️⃣ *AP Mega DSC 2026* - 16,347 Posts\n🏢 School Education Dept, Govt of AP\n📅 Last Date: 30 June 2026\n🔗 Apply: https://apdsc.apcfss.in\n\n✨ Direct incoming notification delivered by SkillVerse Server!`;

  const result = await sendWhatsAppMessage({
    to: '9493811060',
    message: testMessage
  });

  console.log('\n--- TWILIO DISPATCH RESULT ---');
  console.log(JSON.stringify(result, null, 2));
}

testTwilio();
