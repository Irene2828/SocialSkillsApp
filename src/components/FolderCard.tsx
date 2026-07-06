import React, { useRef } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { useMood, getMoodColors } from '../context/MoodContext';

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
  const { mood } = useMood();
  const moodColors = getMoodColors(mood);

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
        <View style={styles.cardContent}>
          <View style={[styles.iconContainer, { borderColor: theme.colors.stroke, backgroundColor: theme.colors.errorSoft }]}>
            <Ionicons name="folder-outline" size={32} color={theme.colors.secondaryText} />
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
                backgroundColor: pressed ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.03)',
                alignItems: 'center',
                justifyContent: 'center',
              }
            ]}
          >
            <Ionicons name="ellipsis-vertical" size={20} color="#6B7280" />
          </Pressable>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 150,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 0,
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
  cardContent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  textContainer: {
    alignItems: 'center',
    width: '100%',
    height: 40,
    justifyContent: 'flex-start',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: '#F7FEE7',
    borderWidth: 1,
    borderColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  title: {
    ...theme.typography.button,
    textAlign: 'center',
    color: theme.colors.text,
  },
  actionButtons: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    gap: 4,
    zIndex: 10,
  },
  actionButton: {
    padding: 8,
  },
});
