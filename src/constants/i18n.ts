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

export function translateCountry(countryCode: string, lang: string): string {
  try {
    const names = new Intl.DisplayNames([lang], { type: 'region' });
    return names.of(countryCode.toUpperCase()) || countryCode;
  } catch {
    return countryCode;
  }
}
