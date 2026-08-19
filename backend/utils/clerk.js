import { createClerkClient } from '@clerk/backend';
import User from '../models/User.js';
import logger from '../config/logger.js';

const clerkSecretKey = process.env.CLERK_SECRET_KEY;

export const clerkClient = createClerkClient({ secretKey: clerkSecretKey });

/**
 * Get or create a MongoDB user mapped to a Clerk User ID
 * @param {string} clerkUserId 
 * @returns {Promise<Document>} Mongoose User document
 */
export const getOrCreateClerkUser = async (clerkUserId) => {
  try {
    // 1. Check if user already exists in DB by clerkId
    let user = await User.findOne({ clerkId: clerkUserId });
    if (user) {
      return user;
    }

    // 2. If not, fetch details from Clerk API
    logger.info(`Fetching user profile from Clerk for ID: ${clerkUserId}`);
    const clerkUser = await clerkClient.users.getUser(clerkUserId);
    
    const email = clerkUser.emailAddresses?.find(
      (addr) => addr.id === clerkUser.primaryEmailAddressId
    )?.emailAddress || clerkUser.emailAddresses[0]?.emailAddress;

    if (!email) {
      throw new Error('User has no email address configured in Clerk');
    }

    // Check if email already exists in DB (e.g. registered locally previously)
    user = await User.findOne({ email }).setOptions({ includeDeleted: true });
    if (user) {
      if (user.isDeleted) {
        throw new Error('Account with this email was deleted.');
      }
      // Link existing user to Clerk
      user.clerkId = clerkUserId;
      if (!user.avatar && clerkUser.imageUrl) {
        user.avatar = clerkUser.imageUrl;
      }
      await user.save();
      logger.info(`Linked existing MongoDB user (${email}) to Clerk ID: ${clerkUserId}`);
      return user;
    }

    // Create a new Mongoose user
    const name = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') || 'Clerk User';

    user = await User.create({
      name,
      email,
      clerkId: clerkUserId,
      avatar: clerkUser.imageUrl || null,
      role: 'student'
    });

    logger.info(`Created new MongoDB user for Clerk ID: ${clerkUserId} (${user._id})`);
    return user;
  } catch (error) {
    logger.error(`Error in getOrCreateClerkUser: ${error.message}`);
    throw error;
  }
};
