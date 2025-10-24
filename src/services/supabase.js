import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../constants/config';

// Initialize Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Save user's listening progress
 */
export const saveListeningProgress = async (userId, bookName, chapter, verse) => {
  try {
    const { data, error } = await supabase
      .from('listening_progress')
      .upsert({
        user_id: userId,
        book_name: bookName,
        chapter: chapter,
        verse: verse,
        updated_at: new Date().toISOString(),
      });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving progress:', error);
    throw error;
  }
};

/**
 * Get user's listening progress
 */
export const getListeningProgress = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('listening_progress')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching progress:', error);
    return null;
  }
};

/**
 * Save user's favorite verses
 */
export const saveFavoriteVerse = async (userId, bookName, chapter, verse, text) => {
  try {
    const { data, error } = await supabase
      .from('favorite_verses')
      .insert({
        user_id: userId,
        book_name: bookName,
        chapter: chapter,
        verse: verse,
        text: text,
        created_at: new Date().toISOString(),
      });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving favorite:', error);
    throw error;
  }
};

/**
 * Get user's favorite verses
 */
export const getFavoriteVerses = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('favorite_verses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return [];
  }
};
