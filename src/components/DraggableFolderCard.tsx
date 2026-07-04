import React, { useRef, useState } from 'react';
import { View, PanResponder, Animated, StyleSheet } from 'react-native';
import { FolderCard } from './FolderCard';
import { QuizFolder } from '../data/types';

interface DraggableFolderCardProps {
  folder: QuizFolder;
  onPressStart: () => void;
  onEdit?: () => void;
  onDragEnd: (folderId: string, x: number, y: number) => void;
  onDragStateChange?: (isDragging: boolean) => void;
  onLayout?: (rect: any) => void;
}

export const DraggableFolderCard: React.FC<DraggableFolderCardProps> = ({
  folder,
  onPressStart,
  onEdit,
  onDragEnd,
  onDragStateChange,
  onLayout,
}) => {
  const pan = useRef(new Animated.ValueXY()).current;
  const [isDragging, setIsDragging] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5;
      },
      onMoveShouldSetPanResponderCapture: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5;
      },
      onPanResponderGrant: (evt) => {
        setIsDragging(true);
        onDragStateChange?.(true);
        pan.setOffset({ x: (pan.x as any)._value, y: (pan.y as any)._value });
        pan.setValue({ x: 0, y: 0 });
        startPos.current = { x: evt.nativeEvent.pageX, y: evt.nativeEvent.pageY };
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
      onPanResponderRelease: (evt, gestureState) => {
        setIsDragging(false);
        onDragStateChange?.(false);
        const dropX = evt.nativeEvent.pageX;
        const dropY = evt.nativeEvent.pageY;

        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
          friction: 5,
        }).start();

        // If it was a meaningful drag, check for drop
        if (Math.abs(gestureState.dx) > 20 || Math.abs(gestureState.dy) > 20) {
          onDragEnd(folder.id, dropX, dropY);
        } else {
          // It was a tap
          onPressStart();
        }
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
  }
});
