import axios from 'axios';

const BASE_URL = 'https://bible.helloao.org/api';

// Available Bible versions
export const BIBLE_VERSIONS = {
  ESV: 'ESV',
  NKJV: 'NKJV',
};

// List of Bible books
export const BIBLE_BOOKS = [
  { name: 'Genesis', abbr: 'Gen', chapters: 50 },
  { name: 'Exodus', abbr: 'Exod', chapters: 40 },
  { name: 'Leviticus', abbr: 'Lev', chapters: 27 },
  { name: 'Numbers', abbr: 'Num', chapters: 36 },
  { name: 'Deuteronomy', abbr: 'Deut', chapters: 34 },
  { name: 'Joshua', abbr: 'Josh', chapters: 24 },
  { name: 'Judges', abbr: 'Judg', chapters: 21 },
  { name: 'Ruth', abbr: 'Ruth', chapters: 4 },
  { name: '1 Samuel', abbr: '1Sam', chapters: 31 },
  { name: '2 Samuel', abbr: '2Sam', chapters: 24 },
  { name: '1 Kings', abbr: '1Kgs', chapters: 22 },
  { name: '2 Kings', abbr: '2Kgs', chapters: 25 },
  { name: '1 Chronicles', abbr: '1Chr', chapters: 29 },
  { name: '2 Chronicles', abbr: '2Chr', chapters: 36 },
  { name: 'Ezra', abbr: 'Ezra', chapters: 10 },
  { name: 'Nehemiah', abbr: 'Neh', chapters: 13 },
  { name: 'Esther', abbr: 'Esth', chapters: 10 },
  { name: 'Job', abbr: 'Job', chapters: 42 },
  { name: 'Psalms', abbr: 'Ps', chapters: 150 },
  { name: 'Proverbs', abbr: 'Prov', chapters: 31 },
  { name: 'Ecclesiastes', abbr: 'Eccl', chapters: 12 },
  { name: 'Song of Solomon', abbr: 'Song', chapters: 8 },
  { name: 'Isaiah', abbr: 'Isa', chapters: 66 },
  { name: 'Jeremiah', abbr: 'Jer', chapters: 52 },
  { name: 'Lamentations', abbr: 'Lam', chapters: 5 },
  { name: 'Ezekiel', abbr: 'Ezek', chapters: 48 },
  { name: 'Daniel', abbr: 'Dan', chapters: 12 },
  { name: 'Hosea', abbr: 'Hos', chapters: 14 },
  { name: 'Joel', abbr: 'Joel', chapters: 3 },
  { name: 'Amos', abbr: 'Amos', chapters: 9 },
  { name: 'Obadiah', abbr: 'Obad', chapters: 1 },
  { name: 'Jonah', abbr: 'Jonah', chapters: 4 },
  { name: 'Micah', abbr: 'Mic', chapters: 7 },
  { name: 'Nahum', abbr: 'Nah', chapters: 3 },
  { name: 'Habakkuk', abbr: 'Hab', chapters: 3 },
  { name: 'Zephaniah', abbr: 'Zeph', chapters: 3 },
  { name: 'Haggai', abbr: 'Hag', chapters: 2 },
  { name: 'Zechariah', abbr: 'Zech', chapters: 14 },
  { name: 'Malachi', abbr: 'Mal', chapters: 4 },
  { name: 'Matthew', abbr: 'Matt', chapters: 28 },
  { name: 'Mark', abbr: 'Mark', chapters: 16 },
  { name: 'Luke', abbr: 'Luke', chapters: 24 },
  { name: 'John', abbr: 'John', chapters: 21 },
  { name: 'Acts', abbr: 'Acts', chapters: 28 },
  { name: 'Romans', abbr: 'Rom', chapters: 16 },
  { name: '1 Corinthians', abbr: '1Cor', chapters: 16 },
  { name: '2 Corinthians', abbr: '2Cor', chapters: 13 },
  { name: 'Galatians', abbr: 'Gal', chapters: 6 },
  { name: 'Ephesians', abbr: 'Eph', chapters: 6 },
  { name: 'Philippians', abbr: 'Phil', chapters: 4 },
  { name: 'Colossians', abbr: 'Col', chapters: 4 },
  { name: '1 Thessalonians', abbr: '1Thess', chapters: 5 },
  { name: '2 Thessalonians', abbr: '2Thess', chapters: 3 },
  { name: '1 Timothy', abbr: '1Tim', chapters: 6 },
  { name: '2 Timothy', abbr: '2Tim', chapters: 4 },
  { name: 'Titus', abbr: 'Titus', chapters: 3 },
  { name: 'Philemon', abbr: 'Phlm', chapters: 1 },
  { name: 'Hebrews', abbr: 'Heb', chapters: 13 },
  { name: 'James', abbr: 'Jas', chapters: 5 },
  { name: '1 Peter', abbr: '1Pet', chapters: 5 },
  { name: '2 Peter', abbr: '2Pet', chapters: 3 },
  { name: '1 John', abbr: '1John', chapters: 5 },
  { name: '2 John', abbr: '2John', chapters: 1 },
  { name: '3 John', abbr: '3John', chapters: 1 },
  { name: 'Jude', abbr: 'Jude', chapters: 1 },
  { name: 'Revelation', abbr: 'Rev', chapters: 22 },
];

/**
 * Fetch a specific verse
 * @param {string} version - Bible version (ESV, NKJV)
 * @param {string} book - Book name or abbreviation
 * @param {number} chapter - Chapter number
 * @param {number} verse - Verse number
 */
export const fetchVerse = async (version, book, chapter, verse) => {
  try {
    const reference = `${book}+${chapter}:${verse}`;
    const response = await axios.get(`${BASE_URL}/${version}/${reference}.json`);
    return response.data;
  } catch (error) {
    console.error('Error fetching verse:', error);
    throw error;
  }
};

/**
 * Fetch an entire chapter
 * @param {string} version - Bible version (ESV, NKJV)
 * @param {string} book - Book name or abbreviation
 * @param {number} chapter - Chapter number
 */
export const fetchChapter = async (version, book, chapter) => {
  try {
    const reference = `${book}+${chapter}`;
    const response = await axios.get(`${BASE_URL}/${version}/${reference}.json`);
    return response.data;
  } catch (error) {
    console.error('Error fetching chapter:', error);
    throw error;
  }
};

/**
 * Fetch a range of verses
 * @param {string} version - Bible version (ESV, NKJV)
 * @param {string} book - Book name or abbreviation
 * @param {number} chapter - Chapter number
 * @param {number} startVerse - Starting verse number
 * @param {number} endVerse - Ending verse number
 */
export const fetchVerseRange = async (version, book, chapter, startVerse, endVerse) => {
  try {
    const reference = `${book}+${chapter}:${startVerse}-${endVerse}`;
    const response = await axios.get(`${BASE_URL}/${version}/${reference}.json`);
    return response.data;
  } catch (error) {
    console.error('Error fetching verse range:', error);
    throw error;
  }
};

/**
 * Get book info by name or abbreviation
 * @param {string} bookName - Book name or abbreviation
 */
export const getBookInfo = (bookName) => {
  return BIBLE_BOOKS.find(
    book =>
      book.name.toLowerCase() === bookName.toLowerCase() ||
      book.abbr.toLowerCase() === bookName.toLowerCase()
  );
};
