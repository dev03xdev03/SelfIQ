/**
 * Gender detection based on German names
 */

// Common female name endings worldwide
const FEMALE_ENDINGS = [
  'a',
  'e',
  'i',
  'ie',
  'ine',
  'ina',
  'ella',
  'elle',
  'ette',
  'etta',
  'ia',
  'ya',
  'ah',
  'een',
  'lyn',
  'lynn',
  'ana',
  'ena',
  'ita',
  'isha',
  'esha',
  'ara',
  'ora',
  'ice',
  'ise',
];

// Common male name endings worldwide
const MALE_ENDINGS = [
  'o',
  'us',
  'er',
  'an',
  'on',
  'os',
  'as',
  'is',
  'es',
  'en',
  'ar',
  'or',
  'ur',
  'ov',
  'ev',
  'aj',
  'ej',
  'il',
  'el',
  'io',
  'ko',
  'to',
  'ro',
  'do',
  'go',
  'lo',
  'mo',
  'no',
];

// Known female names worldwide
const FEMALE_NAMES = [
  // German
  'sophie',
  'emma',
  'mia',
  'hannah',
  'lea',
  'lena',
  'marie',
  'anna',
  'laura',
  'lisa',
  'julia',
  'sarah',
  'clara',
  'lara',
  'nina',
  'eva',
  'paula',
  'charlotte',
  'emilia',
  'luisa',
  'nele',
  'amelie',
  'melissa',
  'jasmin',
  'jana',
  'katharina',
  'theresa',
  'magdalena',
  'franziska',
  'luna',
  'stella',
  'maya',
  'zoe',
  'lia',
  'nora',
  // English
  'emily',
  'olivia',
  'ava',
  'isabella',
  'sophia',
  'amelia',
  'harper',
  'evelyn',
  'abigail',
  'ella',
  'elizabeth',
  'camila',
  'grace',
  'victoria',
  'lily',
  'chloe',
  'penelope',
  'riley',
  'zoey',
  'hazel',
  'violet',
  'aurora',
  'savannah',
  'audrey',
  'brooklyn',
  'bella',
  'claire',
  'skylar',
  'lucy',
  'paisley',
  'everly',
  'caroline',
  'nova',
  'genesis',
  'kennedy',
  'samantha',
  'willow',
  'kinsley',
  'naomi',
  'aaliyah',
  'elena',
  'ariana',
  'allison',
  'gabriella',
  'alice',
  'madelyn',
  'cora',
  'ruby',
  // Spanish
  'maria',
  'carmen',
  'josefa',
  'isabel',
  'dolores',
  'pilar',
  'teresa',
  'rosa',
  'francisca',
  'antonia',
  'lucia',
  'catalina',
  'mercedes',
  'ana',
  'beatriz',
  'adriana',
  'daniela',
  'valentina',
  // French
  'marie',
  'jeanne',
  'francoise',
  'monique',
  'catherine',
  'isabelle',
  'sylvie',
  'martine',
  'brigitte',
  'christine',
  'veronique',
  'laurence',
  'nathalie',
  'sandrine',
  'stephanie',
  'valerie',
  'celine',
  'elodie',
  // Italian
  'giulia',
  'francesca',
  'chiara',
  'sara',
  'martina',
  'alessia',
  'giorgia',
  'valentina',
  'federica',
  'sofia',
  'alice',
  // Slavic
  'anastasia',
  'ekaterina',
  'natalia',
  'olga',
  'svetlana',
  'tatiana',
  'irina',
  'marina',
  'yulia',
  'daria',
  'oksana',
  // Arabic
  'fatima',
  'aisha',
  'mariam',
  'zainab',
  'layla',
  'nour',
  'yasmin',
  'amina',
  'hana',
  'leila',
  'rana',
  'reem',
  // Asian
  'mei',
  'ling',
  'yuki',
  'sakura',
  'yui',
  'aiko',
  'akari',
  'haruka',
  'hinata',
  'nana',
  'rina',
  'mika',
  'ayumi',
  'keiko',
  // Indian
  'priya',
  'ananya',
  'diya',
  'ishita',
  'kavya',
  'aaradhya',
  'saanvi',
  'anushka',
  'pari',
  'navya',
  'aanya',
  'kiara',
  'myra',
  'aadya',
  // Scandinavian
  'ingrid',
  'astrid',
  'freya',
  'saga',
  'linnea',
  'maja',
  'ebba',
  'elsa',
  'wilma',
  'alma',
  'vera',
  'sigrid',
  'liv',
];

// Known male names worldwide
const MALE_NAMES = [
  // German
  'leon',
  'lukas',
  'tim',
  'paul',
  'jonas',
  'felix',
  'max',
  'ben',
  'noah',
  'jan',
  'tom',
  'nico',
  'david',
  'simon',
  'daniel',
  'alexander',
  'michael',
  'christian',
  'tobias',
  'sebastian',
  'florian',
  'philipp',
  'moritz',
  'finn',
  'luca',
  'elias',
  'anton',
  'emil',
  'henry',
  'theo',
  // English
  'liam',
  'oliver',
  'elijah',
  'james',
  'william',
  'benjamin',
  'lucas',
  'henry',
  'theodore',
  'jack',
  'levi',
  'jackson',
  'mateo',
  'mason',
  'ethan',
  'logan',
  'owen',
  'samuel',
  'jacob',
  'asher',
  'aiden',
  'john',
  'joseph',
  'wyatt',
  'leo',
  'luke',
  'julian',
  'hudson',
  'grayson',
  'matthew',
  'ezra',
  'gabriel',
  'carter',
  'isaac',
  'jayden',
  'anthony',
  'dylan',
  'lincoln',
  'thomas',
  'maverick',
  'josiah',
  'charles',
  // Spanish
  'jose',
  'antonio',
  'juan',
  'manuel',
  'francisco',
  'javier',
  'carlos',
  'miguel',
  'pedro',
  'alejandro',
  'pablo',
  'sergio',
  'rafael',
  'fernando',
  'jorge',
  'luis',
  'andres',
  'diego',
  // French
  'jean',
  'pierre',
  'michel',
  'andre',
  'philippe',
  'alain',
  'patrick',
  'bernard',
  'jacques',
  'nicolas',
  'laurent',
  'olivier',
  'eric',
  'marc',
  'francois',
  'pascal',
  'antoine',
  'vincent',
  'louis',
  // Italian
  'giuseppe',
  'mario',
  'francesco',
  'giovanni',
  'luigi',
  'angelo',
  'vincenzo',
  'pietro',
  'alessandro',
  'marco',
  'andrea',
  'stefano',
  'matteo',
  'lorenzo',
  'davide',
  'gabriele',
  // Slavic
  'dmitry',
  'sergey',
  'andrey',
  'alexey',
  'ivan',
  'mikhail',
  'nikolay',
  'vladimir',
  'yuri',
  'pavel',
  'oleg',
  'maxim',
  // Arabic
  'mohammed',
  'ahmed',
  'ali',
  'omar',
  'hassan',
  'khalid',
  'abdullah',
  'ibrahim',
  'yusuf',
  'hamza',
  'amir',
  'karim',
  'tariq',
  'rashid',
  // Asian
  'wei',
  'ming',
  'jun',
  'hiroshi',
  'takeshi',
  'kenji',
  'ryu',
  'haruto',
  'yuito',
  'sota',
  'ren',
  'kaito',
  'hayato',
  'daiki',
  // Indian
  'arjun',
  'aditya',
  'aryan',
  'aarav',
  'vivaan',
  'reyansh',
  'ayaan',
  'krishna',
  'rohan',
  'shaurya',
  'vihaan',
  'aayan',
  'rudra',
  'sai',
  // Scandinavian
  'erik',
  'lars',
  'anders',
  'johan',
  'per',
  'nils',
  'bjorn',
  'sven',
  'gustav',
  'axel',
  'magnus',
  'oskar',
];

export type Gender = 'male' | 'female' | 'neutral';

export function detectGender(name: string): Gender {
  if (!name || name.trim().length === 0) {
    return 'neutral';
  }

  const normalizedName = name.trim().toLowerCase();

  // Check exact matches first
  if (FEMALE_NAMES.includes(normalizedName)) {
    return 'female';
  }

  if (MALE_NAMES.includes(normalizedName)) {
    return 'male';
  }

  // Check endings
  for (const ending of FEMALE_ENDINGS) {
    if (normalizedName.endsWith(ending)) {
      return 'female';
    }
  }

  for (const ending of MALE_ENDINGS) {
    if (normalizedName.endsWith(ending)) {
      return 'male';
    }
  }

  // Default to neutral if uncertain
  return 'neutral';
}

/**
 * Get the appropriate article based on gender
 */
export function getArticle(
  gender: Gender,
  caseType: 'nominative' | 'accusative' | 'dative' = 'nominative',
): string {
  if (gender === 'male') {
    switch (caseType) {
      case 'nominative':
        return 'der';
      case 'accusative':
        return 'den';
      case 'dative':
        return 'dem';
    }
  } else if (gender === 'female') {
    switch (caseType) {
      case 'nominative':
        return 'die';
      case 'accusative':
        return 'die';
      case 'dative':
        return 'der';
    }
  }
  return 'das'; // neutral
}

/**
 * Get the appropriate possessive pronoun
 */
export function getPossessive(gender: Gender): string {
  if (gender === 'male') return 'sein';
  if (gender === 'female') return 'ihr';
  return 'sein'; // neutral default
}

/**
 * Get the appropriate personal pronoun
 */
export function getPronoun(
  gender: Gender,
  caseType: 'nominative' | 'accusative' | 'dative' = 'nominative',
): string {
  if (gender === 'male') {
    switch (caseType) {
      case 'nominative':
        return 'er';
      case 'accusative':
        return 'ihn';
      case 'dative':
        return 'ihm';
    }
  } else if (gender === 'female') {
    switch (caseType) {
      case 'nominative':
        return 'sie';
      case 'accusative':
        return 'sie';
      case 'dative':
        return 'ihr';
    }
  }
  return 'es'; // neutral
}
