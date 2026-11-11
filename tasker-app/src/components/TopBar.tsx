import React from 'react';
import { View, Text, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { theme } from '../theme';
import { TaskerStackParamList } from '../navigation/types';

interface TopBarProps {
  title: string;
  onBack?: () => void;
  rightComponent?: React.ReactNode;
  leftComponent?: React.ReactNode;
  hideHome?: boolean;
  hideTitle?: boolean;
  showSettingsAndRewards?: boolean;
  hideBorder?: boolean;
  compact?: boolean;
  noEdgeToEdge?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({ title, onBack, rightComponent, leftComponent, hideTitle, showSettingsAndRewards, compact, noEdgeToEdge }) => {
  const navigation = useNavigation<NavigationProp<TaskerStackParamList>>();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const headerFontSize = isTablet ? 26 : 18;

  return (
    <View style={[
      styles.container,
      compact && styles.compactContainer,
      noEdgeToEdge && styles.noEdgeToEdge,
    ]}>
      <View style={styles.titleContainer} pointerEvents="none">
        {!hideTitle && (
          <View style={{ alignItems: 'center', width: '100%' }}>
            <Text
              style={[styles.title, { fontSize: headerFontSize }]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.75}
            >
              {title}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.side}>
        {leftComponent ? (
          leftComponent
        ) : onBack ? (
          <Pressable
            onPress={onBack}
            style={styles.iconButton}
          >
            <Ionicons name="arrow-back" size={20} color={theme.colors.text} />
          </Pressable>
        ) : null}
      </View>

      <View style={[styles.side, { alignItems: 'flex-end', justifyContent: 'center' }]}>
        {rightComponent ? rightComponent : showSettingsAndRewards ? (
          <Pressable
            onPress={() => navigation.navigate('MyRewards')}
            style={styles.iconButton}
          >
            <Ionicons name="gift-outline" size={20} color={theme.colors.text} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    zIndex: 100,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.stroke,
  },
  compactContainer: {
    paddingTop: 6,
    paddingBottom: 2,
    marginBottom: theme.spacing.sm,
  },
  noEdgeToEdge: {
    borderBottomWidth: 0,
    backgroundColor: 'transparent',
  },
  side: {
    minWidth: 40,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  title: {
    ...theme.typography.heading,
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center',
    letterSpacing: 0.4,
  },
  titleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    marginHorizontal: 60,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: theme.colors.neutralGrey,
    borderWidth: 1,
    borderColor: theme.colors.stroke,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
