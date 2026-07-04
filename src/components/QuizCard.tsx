import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Card } from './Card';
import { theme } from '../theme';
import { useMood, getMoodColors } from '../context/MoodContext';
import { QuizCategory } from '../data/types';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { ScalePressable } from './ScalePressable';

interface QuizCardProps {
  category: QuizCategory;
  onPressStart: () => void;
  onDelete?: () => void;
  onRename?: () => void;
  isFeatured?: boolean;
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
    case 'create_ai': return { name: 'sparkles-outline', family: 'Ionicons' };
    default: return { name: 'book-outline', family: 'Ionicons' };
  }
};


export const QuizCard: React.FC<QuizCardProps> = ({ category, onPressStart, onDelete, onRename, isFeatured }) => {
  const { name: iconName, family: iconFamily } = getCategoryIcon(category);
  const { mood } = useMood();
  const moodColors = getMoodColors(mood);
  const cardBorderColor = category.color || theme.colors.stroke;
  const iconBorderColor = theme.colors.stroke;
  const iconBackgroundColor = theme.colors.errorSoft;
  const iconColor = theme.colors.secondaryText;

  return (
    <ScalePressable 
      onPress={onPressStart} 
      onLongPress={onDelete}
      style={[styles.container, isFeatured && styles.featuredContainer]}
    >
      <Card style={[styles.card, isFeatured && styles.featuredCard, { borderColor: cardBorderColor }]}>
        {category.isNew && (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>NEW</Text>
          </View>
        )}

        <View style={[styles.cardContent, isFeatured && styles.featuredCardContent]}>
          <View style={[
            styles.iconContainer, 
            isFeatured && styles.featuredIconContainer,
            {
              borderColor: iconBorderColor,
              backgroundColor: iconBackgroundColor
            }
          ]}>
            {iconFamily === 'FontAwesome5' ? (
              <FontAwesome5 name={iconName as any} size={isFeatured ? 28 : 32} color={iconColor} style={styles.icon} />
            ) : (
              <Ionicons name={iconName as any} size={isFeatured ? 28 : 32} color={iconColor} style={styles.icon} />
            )}
          </View>

          <View style={[styles.textContainer, isFeatured && styles.featuredTextContainer]}>
            {isFeatured && (
              <View style={styles.recommendedBadge}>
                <Text style={styles.recommendedBadgeText}>RECOMMENDED</Text>
              </View>
            )}
            <Text style={[styles.title, isFeatured && styles.featuredTitle]}>
              {category.title}
            </Text>
            {isFeatured && category.description && (
              <Text style={styles.descriptionText}>
                {category.description}
              </Text>
            )}
          </View>
        </View>

        {category.isCustom && onRename && (
          <Pressable 
            onPress={(e) => {
              if (e && e.stopPropagation) e.stopPropagation();
              onRename();
            }} 
            style={styles.dotsButton}
          >
            <Ionicons name="pencil-outline" size={16} color="#9CA3AF" />
          </Pressable>
        )}


      </Card>
    </ScalePressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  featuredContainer: {
    width: '100%',
  },
  card: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
    height: 140,
    position: 'relative',
    borderWidth: 0,
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
    backgroundColor: '#84CC16', // Lime green
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
    marginBottom: theme.spacing.md,
    width: 60,
    height: 60,
    borderRadius: theme.borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  featuredIconContainer: {
    marginBottom: 0,
    width: 68,
    height: 68,
    borderRadius: theme.borderRadius.sm,
  },
  icon: {
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  title: {
    ...theme.typography.body,
    fontWeight: '600',
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
