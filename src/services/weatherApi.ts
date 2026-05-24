import axios from 'axios';
import { WeatherData, GeoLocation } from '../types/weather';

const API_KEY = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0/direct';

function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[ьъ]/g, "")
    .replace(/['’`‘]/g, "")
    .trim();
}

function transliterateCyrillic(str: string): string {
  const map: Record<string, string> = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'h', 'ґ': 'g', 'д': 'd', 'е': 'e', 'є': 'ye',
    'ж': 'zh', 'з': 'z', 'и': 'y', 'і': 'i', 'ї': 'yi', 'й': 'y', 'к': 'k', 'л': 'l',
    'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ь': '',
    'ю': 'yu', 'я': 'ya', 'э': 'e', 'ы': 'y', 'ё': 'yo', 'ъ': ''
  };
  return str.split('').map(char => map[char] || char).join('');
}

export async function fetchCombinedSuggestions(query: string): Promise<GeoLocation[]> {
  const queryTrimmed = query.trim();
  if (queryTrimmed.length < 2) return [];

  const queryNorm = normalizeString(queryTrimmed);
  const queryTranslit = transliterateCyrillic(queryNorm);
  const owmResults = await fetchOWMSuggestions(queryTrimmed);
  const merged: GeoLocation[] = [];

  const addIfUnique = (item: GeoLocation) => {
    const isDuplicate = merged.some(
      existing =>
        Math.abs(existing.lat - item.lat) < 0.05 &&
        Math.abs(existing.lon - item.lon) < 0.05
    );
    if (isDuplicate) return;
    merged.push(item);
  };

  owmResults.forEach(item => {
    const namesToCheck = [item.name];
    if (item.local_names?.uk) namesToCheck.push(item.local_names.uk);
    if (item.local_names?.en) namesToCheck.push(item.local_names.en);

    const matches = namesToCheck.some(name => {
      const normalized = normalizeString(name);
      return normalized.startsWith(queryNorm) || normalized.startsWith(queryTranslit);
    });

    if (matches) {
      addIfUnique(item);
    }
  });

  return merged.slice(0, 5);
}

async function fetchOWMSuggestions(query: string): Promise<GeoLocation[]> {
  try {
    const response = await axios.get<GeoLocation[]>(GEO_URL, {
      params: {
        q: query,
        limit: 15,
        appid: API_KEY,
      },
    });
    return response.data;
  } catch {
    return [];
  }
}

export async function fetchWeatherByCity(city: string, lang: string = 'uk'): Promise<WeatherData> {
  try {
    const response = await axios.get<WeatherData>(BASE_URL, {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric',
        lang: lang,
      },
    });
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error('cityNotFound');
      }
      if (error.response?.status === 401) {
        throw new Error('invalidApiKey');
      }
      if (!error.response) {
        throw new Error('networkError');
      }
    }
    throw new Error('genericError');
  }
}

export async function fetchWeatherByCoords(lat: number, lon: number, lang: string = 'uk'): Promise<WeatherData> {
  try {
    const response = await axios.get<WeatherData>(BASE_URL, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: 'metric',
        lang: lang,
      },
    });
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error('cityNotFound');
      }
      if (error.response?.status === 401) {
        throw new Error('invalidApiKey');
      }
      if (!error.response) {
        throw new Error('networkError');
      }
    }
    throw new Error('genericError');
  }
}

export function getWeatherIconUrl(iconCode: string, size: '2x' | '4x' = '4x'): string {
  return `https://openweathermap.org/img/wn/${iconCode}@${size}.png`;
}
