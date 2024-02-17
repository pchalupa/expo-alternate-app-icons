import { useCallback } from 'react';
import { Image, type ImageRequireSource, TouchableOpacity } from 'react-native';

import { styles } from './IconButton.styles';
import { IconNames } from '../App';

interface IconButtonProps {
  source: ImageRequireSource;
  name: IconNames;
  onPress: (name: IconNames) => void;
  selected: boolean;
}

export const IconButton = ({ source, name, onPress, selected }: IconButtonProps) => {
  const handlePress = useCallback(() => onPress(name), [onPress]);

  return (
    <TouchableOpacity
      style={[styles.container, selected && styles.selected]}
      onPress={handlePress}
      disabled={selected}>
      <Image source={source} style={styles.icon} resizeMode="cover" />
    </TouchableOpacity>
  );
};
