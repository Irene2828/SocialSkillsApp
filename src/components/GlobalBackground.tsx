import React from 'react';
import { useMood } from '../context/MoodContext';
import { AnimatedCubesBackground } from './AnimatedCubesBackground';
import { SpaceBackground } from './SpaceBackground';
import { NatureBackground } from './NatureBackground';
import { FeminineBackground } from './FeminineBackground';

export const GlobalBackground: React.FC = () => {
  const { mood } = useMood();

  switch (mood) {
    case 'space':
      return <SpaceBackground />;
    case 'nature':
      return <NatureBackground />;
    case 'feminine':
      return <FeminineBackground />;
    case 'default':
    default:
      return <AnimatedCubesBackground />;
  }
};
