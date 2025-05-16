import essentials from './src/config/sections/essentials';
import fleet from './src/config/sections/fleet';

// Якщо є ще секції — додай тут імпорт

type AnySection = any; // або імпортуй твій Section з types

function collectCodes(section: AnySection): string[] {
  let codes: string[] = [];
  function walk(obj: any) {
    if (obj && typeof obj === 'object') {
      if (obj.code && typeof obj.code === 'string') {
        codes.push(obj.code);
      }
      // Обходимо масиви властивостей, якщо є
      ['groups', 'subgroups', 'items', 'subtables'].forEach(key => {
        if (Array.isArray(obj[key])) {
          obj[key].forEach(walk);
        }
      });
    }
  }
  walk(section);
  return codes;
}

// Collect all codes from all sections
const allCodes = [
  ...collectCodes(essentials),
  ...collectCodes(fleet),
  // Додай тут ...collectCodes(sectionX) для інших секцій
];

// Перевіряємо на дублікати
const codeSet = new Set<string>();
let hasDuplicates = false;

for (const code of allCodes) {
  if (codeSet.has(code)) {
    console.error(`❌ Duplicate code found: "${code}"`);
    hasDuplicates = true;
  }
  codeSet.add(code);
}

if (!hasDuplicates) {
  console.log('✅ All codes are unique!');
  process.exit(0);
} else {
  console.error('❌ Duplicate codes found!');
  process.exit(1);
}
