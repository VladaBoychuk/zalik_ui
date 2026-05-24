import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Pressable,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native';

import SearchBar from './src/components/SearchBar';
import WeatherCard from './src/components/WeatherCard';
import WeatherDetails from './src/components/WeatherDetails';
import LoadingSpinner from './src/components/LoadingSpinner';
import { fetchWeatherByCity, fetchWeatherByCoords, fetchCombinedSuggestions } from './src/services/weatherApi';
import { getGradientColors, COLORS, FONT_SIZES, SPACING } from './src/constants/theme';
import { WeatherData, GeoLocation } from './src/types/weather';
import { t } from './src/constants/i18n';

export default function App() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSearchedCity, setLastSearchedCity] = useState<GeoLocation | null>(null);

  const handleSearch = useCallback(async (cityName?: string, cityDetails?: GeoLocation) => {
    const searchString = (cityName || city).trim();
    if (!searchString) return;

    const isCyrillic = /[\u0400-\u04FF]/.test(searchString);

    Keyboard.dismiss();
    setLoading(true);
    setError(null);

    try {
      let details = cityDetails;
      if (!details) {
        const suggestions = await fetchCombinedSuggestions(searchString);
        if (suggestions.length > 0) {
          details = suggestions[0];
        }
      }

      let data: WeatherData;
      const apiLang = 'uk';

      if (details) {
        data = await fetchWeatherByCoords(details.lat, details.lon, apiLang);
        const resolvedName = isCyrillic ? (details.local_names?.uk || details.name) : (details.local_names?.en || details.name);
        data.name = resolvedName;
        setLastSearchedCity(details);
        setCity(resolvedName);
      } else {
        data = await fetchWeatherByCity(searchString, apiLang);
        data.name = searchString;
        setLastSearchedCity({
          name: data.name,
          lat: data.coord.lat,
          lon: data.coord.lon,
          country: data.sys.country,
        });
        setCity(searchString);
      }
      
      setWeatherData(data);
    } catch (err: any) {
      const errorCode = err.message;
      const translations = t('uk');
      const errMsg = (translations as any)[errorCode] || translations.genericError;
      setError(errMsg);
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  }, [city]);

  const gradientColors = getGradientColors(weatherData?.weather[0]?.id) as [string, string, ...string[]];

  return (
    <LinearGradient colors={gradientColors} style={styles.gradient}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <Pressable
            style={styles.flex}
            onPress={() => {
              if (Platform.OS !== 'web') Keyboard.dismiss();
            }}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.header}>
                <View style={styles.headerTitleRow}>
                  <Feather name="cloud" size={28} color={COLORS.textPrimary} />
                  <Text style={styles.title}>{t('uk').appTitle}</Text>
                </View>
              </View>

              <SearchBar
                value={city}
                onChangeText={setCity}
                onSearch={handleSearch}
                placeholder={t('uk').searchPlaceholder}
              />

              {loading && <LoadingSpinner />}

              {error && (
                <View style={styles.errorContainer}>
                  <Feather
                    name="alert-circle"
                    size={32}
                    color={COLORS.errorText}
                  />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              {!loading && !error && weatherData && (
                <>
                  <WeatherCard data={weatherData} locationDetails={lastSearchedCity || undefined} />
                  <WeatherDetails data={weatherData} />
                </>
              )}

              {!loading && !error && !weatherData && (
                <View style={styles.placeholder}>
                  <Feather
                    name="search"
                    size={64}
                    color={COLORS.whiteTransparent}
                  />
                  <Text style={styles.placeholderTitle}>
                    {t('uk').searchHintTitle}
                  </Text>
                  <Text style={styles.placeholderText}>
                    {t('uk').searchHintText}
                  </Text>
                </View>
              )}
            </ScrollView>
          </Pressable>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 40 : 0,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: SPACING.xxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.textPrimary,
    letterSpacing: 1,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxl,
    paddingHorizontal: SPACING.lg,
    marginHorizontal: SPACING.lg,
    backgroundColor: COLORS.errorBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.errorBorder,
    gap: SPACING.md,
  },
  errorText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.errorText,
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 22,
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxl * 2,
    gap: SPACING.md,
  },
  placeholderTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
  },
  placeholderText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 24,
  },
});
