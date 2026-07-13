import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Card } from './Card';
import { theme } from '../theme';
import { useMood, getMoodColors } from '../context/MoodContext';
import { GradientIcon } from './GradientIcon';
import { QuizCategory } from '../data/types';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { ScalePressable } from './ScalePressable';

interface QuizCardProps {
  category: QuizCategory;
  onPressStart: () => void;
  onOptionsPress?: () => void;
  isFeatured?: boolean;
  isDeleted?: boolean;
  onUndo?: () => void;
}

const getCategoryIcon = (category: QuizCategory): { name: string; family: 'Ionicons' | 'FontAwesome5' } => {
  if (category.icon) {
    return { name: category.icon, family: 'Ionicons' };
  }
  switch (category.id) {
    case 'Friendship': return { name: 'people-outline', family: 'Ionicons' };
    case 'Manners': return { name: 'hand-left-outline', family: 'Ionicons' };
    case 'Feelings': return { name: 'heart-outline', family: 'Ionicons' };
    case 'Playground': return { name: 'basketball-outline', family: 'Ionicons' };
    case 'Safety': return { name: 'shield-checkmark-outline', family: 'Ionicons' };
    case 'create_ai': return { name: 'color-wand-outline', family: 'Ionicons' };
    default: return { name: 'book-outline', family: 'Ionicons' };
  }
};


export const QuizCard: React.FC<QuizCardProps> = ({ category, onPressStart, onOptionsPress, isFeatured, isDeleted, onUndo }) => {
  const { name: iconName, family: iconFamily } = getCategoryIcon(category);
  const { mood } = useMood();
  const moodColors = getMoodColors(mood);
  const isRocket = mood === 'rocket';
  const cardBorderColor = category.color || theme.colors.stroke;
  const iconBorderColor = theme.colors.stroke;
  const iconBackgroundColor = theme.colors.errorSoft;
  const iconColor = '#7DD3FC'; // 20% darker than stroke (#BAE6FD)

  if (isDeleted) {
    return (
      <View style={[styles.container, isFeatured && styles.featuredContainer]}>
        <Card style={[styles.card, isFeatured && styles.featuredCard, { borderColor: cardBorderColor, opacity: 0.5, alignItems: 'center', justifyContent: 'center' }]}>
          <Text style={styles.title}>Deleted</Text>
          <Pressable onPress={onUndo} style={{ marginTop: 8, padding: 8, backgroundColor: theme.colors.primarySoft, borderRadius: 8 }}>
            <Text style={{ color: theme.colors.primary, fontWeight: 'bold' }}>Undo</Text>
          </Pressable>
        </Card>
      </View>
    );
  }

  return (
    <View style={[styles.container, isFeatured && styles.featuredContainer]}>
      <ScalePressable 
        onPress={onPressStart} 
        style={{ flex: 1 }}
      >
        <Card style={[styles.card, isFeatured && styles.featuredCard, { borderColor: theme.colors.stroke, backgroundColor: theme.colors.white }]}>
        {category.isNew && (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>NEW</Text>
          </View>
        )}

        <View style={[styles.cardContent, isFeatured && styles.featuredCardContent]}>
          <View style={[
            styles.iconContainer, 
            isFeatured && styles.featuredIconContainer,
          ]}>
            {isRocket ? (
              iconFamily === 'FontAwesome5' ? (
                <FontAwesome5 name={iconName as any} size={isFeatured ? 24 : 32} color="#FFFFFF" style={[styles.icon, isFeatured && { marginBottom: 2 }]} />
              ) : (
                <Ionicons name={iconName as any} size={isFeatured ? 24 : 32} color="#FFFFFF" style={[styles.icon, isFeatured && { marginBottom: 2 }]} />
              )
            ) : (
              <GradientIcon 
                iconFamily={iconFamily as any} 
                name={iconName} 
                size={isFeatured ? 24 : 32} 
                style={[styles.icon, isFeatured && { marginBottom: 2 }]} 
              />
            )}
          </View>

          <View style={[styles.textContainer, isFeatured && styles.featuredTextContainer]}>
            <Text 
              style={[styles.title, isFeatured && styles.featuredTitle, isRocket && { color: '#FFFFFF' }, isRocket && { textShadowColor: 'rgba(0,0,0,0.4)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 }]} 
              numberOfLines={2}
              adjustsFontSizeToFit
            >
              {category.title}
            </Text>
            {isFeatured && category.description && (
              <Text style={[styles.descriptionText, isRocket && { color: 'rgba(255, 255, 255, 0.7)' }]}>
                {category.description}
              </Text>
            )}
          </View>
        </View>

        </Card>
      </ScalePressable>

      {onOptionsPress && (
        <View style={{ position: 'absolute', top: 12, right: 12, zIndex: 20 }}>
          <Pressable 
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            onPress={(e) => { 
              if (e && e.stopPropagation) e.stopPropagation(); 
              onOptionsPress(); 
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
            <Ionicons name="ellipsis-vertical" size={20} color={isRocket ? '#FFFFFF' : '#6B7280'} />
          </Pressable>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  featuredContainer: {
    width: '100%',
  },
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
    height: 158,
    position: 'relative',
    borderWidth: 2,
  },
  featuredCard: {
    minHeight: 110,
    alignItems: 'stretch',
    justifyContent: 'center',
    padding: theme.spacing.md,
  },
  cardContent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  featuredCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  textContainer: {
    alignItems: 'center',
    width: '100%',
    minHeight: 56,
    justifyContent: 'flex-start',
  },
  featuredTextContainer: {
    alignItems: 'flex-start',
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  newBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  newBadgeText: {
    ...theme.typography.body,
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  recommendedBadge: {
    backgroundColor: theme.colors.primarySoft,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 4,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  recommendedBadgeText: {
    ...theme.typography.label,
    fontSize: 10,
    fontWeight: '700',
    color: '#3F6212', // Darker green for readability
  },
  iconContainer: {
    marginTop: 12,
    marginBottom: 4,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredIconContainer: {
    marginBottom: 0,
    width: 68,
    height: 68,
    borderRadius: theme.borderRadius.sm,
  },
  icon: {
    opacity: 0.9,
  },
  title: {
    ...theme.typography.body,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center',
  },
  featuredTitle: {
    textAlign: 'left',
    fontSize: 18,
    fontWeight: '700',
  },
  descriptionText: {
    ...theme.typography.caption,
    color: theme.colors.secondaryText,
    marginTop: 2,
    textAlign: 'left',
  },
  dotsButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 8,
    zIndex: 10,
  },
});
