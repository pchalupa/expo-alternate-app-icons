import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    borderWidth: 5,
    overflow: 'hidden',
    opacity: 0.5,
  },
  selected: { borderColor: 'rgb(117, 197, 146)', opacity: 1 },
  icon: {
    maxWidth: 150,
    maxHeight: 150,
  },
});
