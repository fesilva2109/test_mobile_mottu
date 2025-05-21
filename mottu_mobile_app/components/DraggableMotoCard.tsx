import React from 'react';
import { PanResponder, Animated } from 'react-native';
import { MotoCard } from './MotoCard';

export function DraggableMotoCard({ motorcycle, onDrop }: { motorcycle: any, onDrop: (position: { x: number, y: number }) => void }) {
  const pan = React.useRef(new Animated.ValueXY()).current;

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
      onPanResponderRelease: (e, gesture) => {
        onDrop({ x: gesture.moveX, y: gesture.moveY });
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false
        }).start();
      },
    })
  ).current;

  return (
    <Animated.View
      style={{
        transform: [{ translateX: pan.x }, { translateY: pan.y }],
        position: 'absolute',
        zIndex: 1,
      }}
      {...panResponder.panHandlers}
    >
      <MotoCard motorcycle={motorcycle} />
    </Animated.View>
  );
}