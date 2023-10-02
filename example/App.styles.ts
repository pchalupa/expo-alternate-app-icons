import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(29, 44, 47)',
  },
  wrapper: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  iconsPicker: {
    flex: 1,
    gap: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    flexWrap: 'wrap',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgb(160, 182, 187)',
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    marginTop: 12,
    marginBottom: 18,
    color: 'rgb(255, 255, 255)',
  },
});
