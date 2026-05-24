import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, BORDER_RADIUS, FONT_SIZES, SPACING } from '../constants/theme';
import { fetchCombinedSuggestions } from '../services/weatherApi';
import { GeoLocation } from '../types/weather';
import { translateCountry } from '../constants/i18n';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSearch: (cityName?: string, cityDetails?: GeoLocation) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChangeText,
  onSearch,
  placeholder = 'Введіть назву міста англійською...',
}: SearchBarProps) {
  const [suggestions, setSuggestions] = useState<GeoLocation[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSelectionChange = useRef(false);

  useEffect(() => {
    let active = true;

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (isSelectionChange.current) {
      isSelectionChange.current = false;
      return;
    }

    const query = value.trim().toLowerCase();

    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    debounceTimer.current = setTimeout(async () => {
      const results = await fetchCombinedSuggestions(value);
      
      if (!active) return;

      setSuggestions(results);
      setShowSuggestions(results.length > 0);
    }, 400);

    return () => {
      active = false;
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [value]);

  const handleSelectCity = useCallback((city: GeoLocation) => {
    const isCyrillic = /[\u0400-\u04FF]/.test(value);
    const displayName = isCyrillic ? (city.local_names?.uk || city.name) : (city.local_names?.en || city.name);
    isSelectionChange.current = true;
    onChangeText(displayName);
    setShowSuggestions(false);
    setSuggestions([]);
    onSearch(displayName, city);
  }, [value, onChangeText, onSearch]);

  const formatCityLabel = (city: GeoLocation): string => {
    const isCyrillic = /[\u0400-\u04FF]/.test(value);
    const lang = isCyrillic ? 'uk' : 'en';
    const cityName = isCyrillic ? (city.local_names?.uk || city.name) : (city.local_names?.en || city.name);
    const parts = [cityName];
    if (city.state) {
      parts.push(city.state);
    }
    parts.push(translateCountry(city.country, lang));
    return parts.join(', ');
  };

  const uniqueSuggestions = suggestions.filter((city, index, arr) => {
    const label = formatCityLabel(city);
    return arr.findIndex(c => formatCityLabel(c) === label) === index;
  });

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <View style={styles.inputWrapper}>
          <Feather
            name="map-pin"
            size={20}
            color={COLORS.textSecondary}
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={(text) => {
              onChangeText(text);
              if (text.trim().length < 2) {
                setShowSuggestions(false);
              }
            }}
            placeholder={placeholder}
            placeholderTextColor={COLORS.textMuted}
            onSubmitEditing={() => {
              setShowSuggestions(false);
              onSearch();
            }}
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="words"
          />
          {value.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                onChangeText('');
                setSuggestions([]);
                setShowSuggestions(false);
              }}
              style={styles.clearButton}
              activeOpacity={0.7}
            >
              <Feather name="x" size={18} color={COLORS.textMuted} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => {
            setShowSuggestions(false);
            onSearch();
          }}
          activeOpacity={0.7}
        >
          <Feather name="search" size={22} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {showSuggestions && uniqueSuggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          {uniqueSuggestions.map((city, index) => (
            <TouchableOpacity
              key={`${city.lat}-${city.lon}-${index}`}
              style={[
                styles.suggestionItem,
                index < uniqueSuggestions.length - 1 && styles.suggestionBorder,
              ]}
              onPress={() => handleSelectCity(city)}
              activeOpacity={0.6}
            >
              <Feather
                name="map-pin"
                size={16}
                color={COLORS.textSecondary}
                style={styles.suggestionIcon}
              />
              <Text style={styles.suggestionText} numberOfLines={1}>
                {formatCityLabel(city)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    zIndex: 10,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBackground,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    paddingHorizontal: SPACING.md,
    height: 52,
  },
  icon: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
    height: '100%',
    ...Platform.select({
      web: { outlineStyle: 'none' as any },
    }),
  },
  clearButton: {
    padding: SPACING.xs,
    marginLeft: SPACING.xs,
  },
  searchButton: {
    width: 52,
    height: 52,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.cardBackgroundSolid,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
  },
  suggestionsContainer: {
    marginTop: SPACING.sm,
    backgroundColor: COLORS.cardBackgroundSolid,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    overflow: 'hidden',
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: SPACING.md,
  },
  suggestionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.whiteTransparent,
  },
  suggestionIcon: {
    marginRight: SPACING.sm,
  },
  suggestionText: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
});
