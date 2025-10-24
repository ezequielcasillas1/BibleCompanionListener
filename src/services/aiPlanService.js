import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../constants/config';

/**
 * Generate a custom Bible reading plan using AI
 * @param {string} userRequest - User's request like "Play only Jesus quotes"
 * @param {string} version - Bible version (ESV or NKJV)
 * @returns {Promise<Object>} - Generated plan with verses
 */
export const generateCustomPlan = async (userRequest, version = 'ESV') => {
  try {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      throw new Error('Supabase configuration missing');
    }

    const response = await fetch(
      `${SUPABASE_URL}/functions/v1/generate-bible-plan`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          userRequest,
          version,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate plan');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error generating custom plan:', error);
    throw error;
  }
};

/**
 * Example custom plan requests
 */
export const EXAMPLE_PLANS = [
  {
    title: 'Jesus\' Teachings',
    description: 'Play only Jesus quotes from the Gospels',
    request: 'Play only Jesus quotes from the Gospels',
    icon: '✝️',
  },
  {
    title: 'Comfort & Peace',
    description: 'Psalms about comfort and peace',
    request: 'Psalms and verses about comfort, peace, and rest',
    icon: '🕊️',
  },
  {
    title: 'Creation Story',
    description: 'Connect creation themes across testaments',
    request: 'Connect creation themes from Genesis, Psalms, and Revelation',
    icon: '🌟',
  },
  {
    title: 'Wisdom Literature',
    description: 'Proverbs and wisdom passages',
    request: 'Best wisdom passages from Proverbs, Ecclesiastes, and James',
    icon: '📖',
  },
  {
    title: 'Love & Relationships',
    description: 'Biblical teachings on love',
    request: '1 Corinthians 13, Song of Solomon highlights, and other verses about love',
    icon: '❤️',
  },
  {
    title: 'Faith & Trust',
    description: 'Verses about faith and trusting God',
    request: 'Key verses about faith and trusting God from both testaments',
    icon: '🙏',
  },
  {
    title: 'Prophetic Connections',
    description: 'Old Testament prophecies fulfilled in New Testament',
    request: 'Connect Old Testament prophecies with their New Testament fulfillments',
    icon: '🔮',
  },
  {
    title: 'Morning Devotional',
    description: 'Uplifting passages for morning reading',
    request: 'Uplifting and encouraging verses perfect for morning devotional',
    icon: '🌅',
  },
];

/**
 * Save a custom plan to local storage
 */
export const savePlanToDevice = async (plan) => {
  try {
    const { AsyncStorage } = await import('@react-native-async-storage/async-storage');
    const savedPlans = await getSavedPlans();
    const newPlan = {
      id: Date.now().toString(),
      ...plan,
      createdAt: new Date().toISOString(),
    };
    savedPlans.push(newPlan);
    await AsyncStorage.setItem('custom_bible_plans', JSON.stringify(savedPlans));
    return newPlan;
  } catch (error) {
    console.error('Error saving plan:', error);
    throw error;
  }
};

/**
 * Get all saved custom plans
 */
export const getSavedPlans = async () => {
  try {
    const { AsyncStorage } = await import('@react-native-async-storage/async-storage');
    const plansJson = await AsyncStorage.getItem('custom_bible_plans');
    return plansJson ? JSON.parse(plansJson) : [];
  } catch (error) {
    console.error('Error getting saved plans:', error);
    return [];
  }
};

/**
 * Delete a saved plan
 */
export const deleteSavedPlan = async (planId) => {
  try {
    const { AsyncStorage } = await import('@react-native-async-storage/async-storage');
    const savedPlans = await getSavedPlans();
    const filteredPlans = savedPlans.filter(p => p.id !== planId);
    await AsyncStorage.setItem('custom_bible_plans', JSON.stringify(filteredPlans));
  } catch (error) {
    console.error('Error deleting plan:', error);
    throw error;
  }
};
