import React, { useRef } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

interface FolderCardProps {
  name: string;
  onPress: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onLayout?: (layout: any) => void;
  isDragTarget?: boolean;
}

export const FolderCard: React.FC<FolderCardProps> = ({ name, onPress, onEdit, onDelete, onLayout, isDragTarget }) => {
  const containerRef = useRef<View>(null);

  const handleLayout = () => {
    if (onLayout && containerRef.current) {
      containerRef.current.measure((x, y, width, height, pageX, pageY) => {
        onLayout({ x: pageX, y: pageY, width, height });
      });
    }
  };

  return (
    <LinearGradient
      ref={containerRef as any}
      onLayout={handleLayout}
      colors={['rgba(255, 241, 242, 0.75)', 'rgba(243, 232, 255, 0.75)', 'rgba(224, 231, 255, 0.6)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.container, isDragTarget && styles.dragTarget]}
    >
      <Pressable onPress={onPress} style={styles.pressable}>
        <View style={styles.cardContent}>
          <View style={styles.iconContainer}>
            <Ionicons name="folder-outline" size={32} color="#064E3B" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title} numberOfLines={2}>{name}</Text>
          </View>
        </View>
      </Pressable>
      {onEdit && (
        <View style={{ position: 'absolute', top: 12, right: 12, zIndex: 20 }}>
          <Pressable 
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            onPress={(e) => { 
              if (e && e.stopPropagation) e.stopPropagation(); 
              onEdit(); 
            }} 
            style={({ pressed }) => [
              {
                padding: 6,
                borderRadius: 20,
                backgroundColor: pressed ? 'rgba(42, 30, 92,0.1)' : 'rgba(42, 30, 92,0.05)',
                alignItems: 'center',
                justifyContent: 'center',
              }
            ]}
          >
            <Ionicons name="ellipsis-vertical" size={20} color="rgba(42, 30, 92, 0.7)" />
          </Pressable>
        </View>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 158,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowOpacity: 0,
    elevation: 0,
    position: 'relative',
  },
  dragTarget: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
    backgroundColor: 'rgba(190, 242, 100, 0.18)',
  },
  pressable: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md / 2,
    paddingBottom: theme.spacing.md / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  textContainer: {
    alignItems: 'center',
    width: '100%',
    minHeight: 56,
    justifyContent: 'flex-start',
  },
  iconContainer: {
    marginTop: 12,
    marginBottom: 4,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...theme.typography.body,
    fontWeight: '400',
    color: '#064E3B',
    textAlign: 'center',
  },
  actionButtons: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    // gap in flexbox is not supported on iOS 12.5.
    // Use marginLeft on action button children instead.
    zIndex: 10,
  },
  actionButton: {
    padding: 8,
    // Replaces the gap removed from actionButtons for iOS 12.5 compatibility
    marginLeft: 4,
  },
});
