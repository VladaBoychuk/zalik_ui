const uk = {
  appTitle: 'Погода',
  searchPlaceholder: 'Введіть назву міста англійською...',
  loading: 'Завантаження...',
  feelsLike: 'Відчувається як',
  humidity: 'Вологість',
  wind: 'Вітер',
  pressure: 'Тиск',
  visibility: 'Видимість',
  windUnit: 'м/с',
  pressureUnit: 'гПа',
  visibilityUnit: 'км',
  searchHintTitle: 'Дізнайтесь погоду',
  searchHintText: 'Введіть назву міста англійською\nдля пошуку поточної погоди',
  cityNotFound: 'Місто не знайдено. Перевірте назву та спробуйте ще раз.',
  invalidApiKey: 'Невірний API ключ. Перевірте налаштування.',
  networkError: 'Помилка мережі. Перевірте підключення до інтернету.',
  genericError: 'Щось пішло не так. Спробуйте пізніше.',
};

export function t(lang?: string) {
  return uk;
}
