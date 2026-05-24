import { WeatherType } from '../types/weather';

export const WEATHER_GRADIENTS: Record<WeatherType, string[]> = {
  clear: ['#4facfe', '#00f2fe'],
  clouds: ['#606c88', '#3f4c6b'],
  rain: ['#373B44', '#4286f4'],
  snow: ['#E6DADA', '#274046'],
  thunder: ['#141E30', '#243B55'],
  mist: ['#757F9A', '#D7DDE8'],
  default: ['#667eea', '#764ba2'],
};

export const COLORS = {
  white: '#FFFFFF',
  whiteTransparent: 'rgba(255, 255, 255, 0.2)',
  cardBackground: 'rgba(255, 255, 255, 0.15)',
  cardBackgroundSolid: 'rgba(255, 255, 255, 0.25)',
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255, 255, 255, 0.8)',
  textMuted: 'rgba(255, 255, 255, 0.6)',
  inputBackground: 'rgba(255, 255, 255, 0.25)',
  inputBorder: 'rgba(255, 255, 255, 0.3)',
  errorBackground: 'rgba(255, 87, 87, 0.2)',
  errorBorder: 'rgba(255, 87, 87, 0.5)',
  errorText: '#FF6B6B',
};

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  hero: 72,
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 16,
  lg: 20,
  xl: 24,
  round: 50,
};

export function getWeatherType(weatherId: number): WeatherType {
  if (weatherId >= 200 && weatherId < 300) return 'thunder';
  if (weatherId >= 300 && weatherId < 600) return 'rain';
  if (weatherId >= 600 && weatherId < 700) return 'snow';
  if (weatherId >= 700 && weatherId < 800) return 'mist';
  if (weatherId === 800) return 'clear';
  if (weatherId > 800) return 'clouds';
  return 'default';
}

export function getGradientColors(weatherId?: number): string[] {
  if (!weatherId) return WEATHER_GRADIENTS.default;
  const type = getWeatherType(weatherId);
  return WEATHER_GRADIENTS[type];
}
