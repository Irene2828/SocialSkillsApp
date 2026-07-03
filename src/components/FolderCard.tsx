import React, { useRef } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

interface FolderCardProps {
  name: string;
  onPress: () => void;
  onEdit?: () => void;
  onLayout?: (layout: any) => void;
  isDragTarget?: boolean;
}

export const FolderCard: React.FC<FolderCardProps> = ({ name, onPress, onEdit, onLayout, isDragTarget }) => {
  const containerRef = useRef<View>(null);

  const handleLayout = () => {
    if (onLayout && containerRef.current) {
      containerRef.current.measure((x, y, width, height, pageX, pageY) => {
        onLayout({ x: pageX, y: pageY, width, height });
      });
    }
  };

  return (
    <View ref={containerRef} onLayout={handleLayout} style={[styles.container, isDragTarget && styles.dragTarget]}>
      <Pressable onPress={onPress} style={styles.pressable}>
        <View style={styles.iconContainer}>
          <Ionicons name="folder-outline" size={32} color={theme.colors.secondaryText} />
        </View>
        <Text style={styles.title} numberOfLines={2}>{name}</Text>
      </Pressable>
      {onEdit && (
        <Pressable onPress={(e) => {
          if (e && e.stopPropagation) e.stopPropagation();
          onEdit();
        }} style={styles.editButton}>
          <Ionicons name="pencil-outline" size={16} color="#9CA3AF" />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.stroke,
    ...theme.shadows.soft,
    position: 'relative',
  },
  dragTarget: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
    backgroundColor: '#F7FEE7',
  },
  pressable: {
    flex: 1,
    padding: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  title: {
    ...theme.typography.button,
    textAlign: 'center',
    color: theme.colors.text,
  },
  editButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 8,
    zIndex: 10,
  },
});
