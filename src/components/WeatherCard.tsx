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
import { t } from '../constants/i18n';

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

  const cityTitle = locationDetails ? locationDetails.name : data.name;

  const citySub = (() => {
    const countryCode = locationDetails ? locationDetails.country : data.sys.country;
    if (!locationDetails) return countryCode;
    
    const parts = [];
    if (locationDetails.state) {
      parts.push(locationDetails.state);
    }
    parts.push(countryCode);
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
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  locationContainer: {
    alignItems: 'center',
    gap: SPACING.xs,
  },
  cityName: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: COLORS.textPrimary,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  locationSub: {
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  weatherIcon: {
    width: 140,
    height: 140,
    marginVertical: -SPACING.sm,
  },
  temperature: {
    fontSize: FONT_SIZES.hero,
    fontWeight: '200',
    color: COLORS.textPrimary,
    letterSpacing: -2,
    marginTop: -SPACING.sm,
  },
  description: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '500',
    color: COLORS.textPrimary,
    marginTop: SPACING.xs,
    textTransform: 'capitalize',
  },
  feelsLike: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
});
