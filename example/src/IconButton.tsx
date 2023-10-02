import { useCallback } from 'react';
import { Image, type ImageRequireSource, TouchableOpacity } from 'react-native';

import { styles } from './IconButton.styles';

interface IconButtonProps {
  source: ImageRequireSource;
  name: string;
  onPress: (name: string) => void;
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
