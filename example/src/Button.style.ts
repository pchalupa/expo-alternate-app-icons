import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 15,
    backgroundColor: 'rgb(138, 200, 141)',
    shadowColor: 'rgb(138, 200, 141)',
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
  },
  text: { color: 'rgb(255, 255, 255)', fontSize: 18, fontWeight: '800', textAlign: 'center' },
});
