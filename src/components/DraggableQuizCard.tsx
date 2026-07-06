import React, { useRef, useState } from 'react';
import { View, PanResponder, Animated, StyleSheet } from 'react-native';
import { QuizCard } from './QuizCard';

interface DraggableQuizCardProps {
  category: any;
  isFeatured: boolean;
  onPressStart: () => void;
  onOptionsPress?: () => void;
  onDragEnd: (quizId: string) => void;
  onDragMove?: (quizId: string, x: number, y: number) => void;
  onDragStateChange?: (isDragging: boolean) => void;
}

export const DraggableQuizCard: React.FC<DraggableQuizCardProps> = ({
  category,
  isFeatured,
  onPressStart,
  onOptionsPress,
  onDragEnd,
  onDragMove,
  onDragStateChange,
}) => {
  const pan = useRef(new Animated.ValueXY()).current;
  const [isDragging, setIsDragging] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 10 || Math.abs(gestureState.dy) > 15;
      },
      onPanResponderGrant: (evt) => {
        setIsDragging(true);
        onDragStateChange?.(true);
        pan.setOffset({ x: (pan.x as any)._value, y: (pan.y as any)._value });
        pan.setValue({ x: 0, y: 0 });
        startPos.current = { x: evt.nativeEvent.pageX, y: evt.nativeEvent.pageY };
      },
      onPanResponderMove: (evt, gestureState) => {
        Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false })(evt, gestureState);
        if (onDragMove) {
          onDragMove(category.id, gestureState.moveX, gestureState.moveY);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
          friction: 5,
        }).start();

        if (Math.abs(gestureState.dx) > 20 || Math.abs(gestureState.dy) > 20) {
          onDragEnd(category.id);
        } else {
          onPressStart();
        }

        setIsDragging(false);
        onDragStateChange?.(false);
      },
      onPanResponderTerminate: () => {
        setIsDragging(false);
        onDragStateChange?.(false);
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        { transform: [{ translateX: pan.x }, { translateY: pan.y }] },
        isDragging && styles.dragging,
      ]}
    >
      <QuizCard
        category={category}
        isFeatured={isFeatured}
        onPressStart={onPressStart}
        onOptionsPress={onOptionsPress}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  dragging: {
    zIndex: 999,
    elevation: 10,
    opacity: 0.9,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  }
});
