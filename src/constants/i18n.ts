const uk = {
  appTitle: 'Погода',
  searchPlaceholder: 'Введіть назву міста...',
  loading: 'Завантаження...',
  feelsLike: 'Відчується як',
  humidity: 'Вологість',
  wind: 'Вітер',
  pressure: 'Тиск',
  visibility: 'Видимість',
  windUnit: 'м/с',
  pressureUnit: 'гПа',
  visibilityUnit: 'км',
  searchHintTitle: 'Дізнайтесь погоду',
  searchHintText: 'Введіть назву міста\nдля пошуку поточної погоди',
  cityNotFound: 'Місто не знайдено. Перевірте назву та спробуйте ще раз.',
  invalidApiKey: 'Невірний API ключ. Перевірте налаштування.',
  networkError: 'Помилка мережі. Перевірте підключення до інтернету.',
  genericError: 'Щось пішло не так. Спробуйте пізніше.',
};

export function t(lang?: string) {
  return uk;
}

const UKRAINIAN_COUNTRIES: Record<string, string> = {
  UA: 'Україна',
  US: 'США',
  GB: 'Велика Британія',
  PL: 'Польща',
  DE: 'Німеччина',
  FR: 'Франція',
  IT: 'Італія',
  ES: 'Іспанія',
  CA: 'Канада',
  TR: 'Туреччина',
  EG: 'Єгипет',
  RO: 'Румунія',
  HU: 'Угорщина',
  SK: 'Словаччина',
  CZ: 'Чехія',
  AT: 'Австрія',
  CH: 'Швейцарія',
  BE: 'Бельгія',
  NL: 'Нідерланди',
  SE: 'Швеція',
  NO: 'Норвегія',
  FI: 'Фінляндія',
  DK: 'Данія',
  GR: 'Греція',
  PT: 'Португалія',
  CN: 'Китай',
  JP: 'Японія',
  IN: 'Індія',
  BR: 'Бразилія',
  MX: 'Мексика',
  AU: 'Австралія',
  KR: 'Південна Корея',
  RU: 'РФ',
  BY: 'Білорусь',
  KZ: 'Казахстан',
  GE: 'Грузія',
  AM: 'Вірменія',
  AZ: 'Азербайджан',
  MD: 'Молдова',
  IL: 'Ізраїль',
  IE: 'Ірландія',
  NZ: 'Нова Зеландія',
  ZA: 'ПАР',
  SG: 'Сінгапур',
  TH: 'Таїланд',
  VN: "В'єтнам",
  AE: 'ОАЕ',
  SA: 'Саудівська Аравія',
  HR: 'Хорватія',
  BG: 'Болгарія',
  LT: 'Литва',
  LV: 'Латвія',
  EE: 'Естонія',
};

export function translateCountry(countryCode: string, lang: string): string {
  const code = countryCode.toUpperCase();
  if (lang === 'uk' && UKRAINIAN_COUNTRIES[code]) {
    return UKRAINIAN_COUNTRIES[code];
  }
  try {
    const names = new Intl.DisplayNames([lang], { type: 'region' });
    return names.of(code) || countryCode;
  } catch {
    return countryCode;
  }
}
