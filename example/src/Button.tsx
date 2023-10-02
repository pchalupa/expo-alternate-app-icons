import { Text, TouchableOpacity } from 'react-native';

import { styles } from './Button.style';

interface ButtonProps {
  onPress: () => void;
  children: string;
}

export const Button = ({ onPress, children }: ButtonProps) => (
  <TouchableOpacity onPress={onPress} style={styles.container}>
    <Text style={styles.text}>{children}</Text>
  </TouchableOpacity>
);
