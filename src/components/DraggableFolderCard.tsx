import React, { useRef, useState } from 'react';
import { View, PanResponder, Animated, StyleSheet } from 'react-native';
import { FolderCard } from './FolderCard';
import { QuizFolder } from '../data/types';

interface DraggableFolderCardProps {
  folder: QuizFolder;
  onPressStart: () => void;
  onEdit?: () => void;
  onDragEnd: (folderId: string) => void;
  onDragMove?: (folderId: string, x: number, y: number) => void;
  onDragStateChange?: (isDragging: boolean) => void;
  onLayout?: (rect: any) => void;
  isHovered?: boolean;
}

export const DraggableFolderCard: React.FC<DraggableFolderCardProps> = ({
  folder,
  onPressStart,
  onEdit,
  onDragEnd,
  onDragMove,
  onDragStateChange,
  onLayout,
  isHovered,
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
      onMoveShouldSetPanResponderCapture: (_, gestureState) => {
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
          onDragMove(folder.id, gestureState.moveX, gestureState.moveY);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();

        if (Math.abs(gestureState.dx) > 20 || Math.abs(gestureState.dy) > 20) {
          onDragEnd(folder.id);
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
      onLayout={(e) => {
        const { x, y, width, height } = e.nativeEvent.layout;
        onLayout?.({ x, y, width, height });
      }}
      style={[
        { transform: [{ translateX: pan.x }, { translateY: pan.y }] },
        isDragging && styles.dragging,
        isHovered && styles.hovered,
      ]}
    >
      <FolderCard
        name={folder.name}
        onPress={onPressStart}
        onEdit={onEdit}
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
  },
  hovered: {
    transform: [{ scale: 1.05 }],
    shadowColor: '#3B82F6', // Blue highlight
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 8,
  }
});
