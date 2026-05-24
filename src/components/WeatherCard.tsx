import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
} from 'react-native';
import { WeatherData, GeoLocation } from '../types/weather';
import { getWeatherIconUrl } from '../services/weatherApi';
import { COLORS, BORDER_RADIUS, FONT_SIZES, SPACING } from '../constants/theme';
import { t, translateCountry } from '../constants/i18n';

interface WeatherCardProps {
  data: WeatherData;
  locationDetails?: GeoLocation;
}

export default function WeatherCard({ data, locationDetails }: WeatherCardProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    fadeAnim.setValue(0);
    slideAnim.setValue(30);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [data]);

  const temperature = Math.round(data.main.temp);
  const description =
    data.weather[0]?.description?.charAt(0).toUpperCase() +
    data.weather[0]?.description?.slice(1);
  const iconUrl = getWeatherIconUrl(data.weather[0]?.icon);

  const cityTitle = data.name;

  const citySub = (() => {
    const isCyrillic = /[\u0400-\u04FF]/.test(cityTitle);
    const lang = isCyrillic ? 'uk' : 'en';
    const countryCode = locationDetails ? locationDetails.country : data.sys.country;
    const translatedCountry = translateCountry(countryCode, lang);
    if (!locationDetails) return translatedCountry;
    
    const parts = [];
    if (locationDetails.state) {
      parts.push(locationDetails.state);
    }
    parts.push(translatedCountry);
    return parts.join(', ');
  })();

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.locationContainer}>
        <Text style={styles.cityName}>{cityTitle}</Text>
        {citySub && <Text style={styles.locationSub}>{citySub}</Text>}
      </View>

      <Image source={{ uri: iconUrl }} style={styles.weatherIcon} />

      <Text style={styles.temperature}>{temperature}°</Text>

      <Text style={styles.description}>{description}</Text>

      <Text style={styles.feelsLike}>
        {t('uk').feelsLike} {Math.round(data.main.feels_like)}°C
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
  },
  locationContainer: {
    alignItems: 'center',
    gap: 2,
  },
  cityName: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.textPrimary,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  locationSub: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  weatherIcon: {
    width: 90,
    height: 90,
    marginVertical: -SPACING.xs,
  },
  temperature: {
    fontSize: 56,
    fontWeight: '200',
    color: COLORS.textPrimary,
    letterSpacing: -2,
    marginTop: -SPACING.xs,
  },
  description: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '500',
    color: COLORS.textPrimary,
    marginTop: 2,
    textTransform: 'capitalize',
  },
  feelsLike: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});
