import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { WeatherData } from '../types/weather';
import { COLORS, BORDER_RADIUS, FONT_SIZES, SPACING } from '../constants/theme';
import { t } from '../constants/i18n';

interface WeatherDetailsProps {
  data: WeatherData;
}

interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  delay: number;
}

function DetailItem({ icon, label, value, delay }: DetailItemProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.8);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        delay,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }),
    ]).start();
  }, [value]);

  return (
    <Animated.View
      style={[
        styles.detailItem,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <View style={styles.iconWrapper}>{icon}</View>
      <Text style={styles.detailValue}>{value}</Text>
      <Text style={styles.detailLabel}>{label}</Text>
    </Animated.View>
  );
}

export default function WeatherDetails({ data }: WeatherDetailsProps) {
  const details = [
    {
      icon: (
        <Feather name="droplet" size={24} color={COLORS.textPrimary} />
      ),
      label: t('uk').humidity,
      value: `${data.main.humidity}%`,
    },
    {
      icon: (
        <Feather name="wind" size={24} color={COLORS.textPrimary} />
      ),
      label: t('uk').wind,
      value: `${data.wind.speed} ${t('uk').windUnit}`,
    },
    {
      icon: (
        <MaterialCommunityIcons
          name="gauge"
          size={24}
          color={COLORS.textPrimary}
        />
      ),
      label: t('uk').pressure,
      value: `${data.main.pressure} ${t('uk').pressureUnit}`,
    },
    {
      icon: (
        <Feather name="eye" size={24} color={COLORS.textPrimary} />
      ),
      label: t('uk').visibility,
      value: `${(data.visibility / 1000).toFixed(1)} ${t('uk').visibilityUnit}`,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {details.map((detail, index) => (
          <DetailItem
            key={detail.label}
            icon={detail.icon}
            label={detail.label}
            value={detail.value}
            delay={index * 100}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  detailItem: {
    width: '47%',
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
    gap: SPACING.sm,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.whiteTransparent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailValue: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  detailLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
});
