import { UnavailabilityError } from 'expo-modules-core';

export default {
  supportsAlternateIcons: false,
  getAppIconName: () => {
    throw new UnavailabilityError('AlternateAppIcons', 'getAppIconName');
  },
  setAlternateAppIcon: () => {
    throw new UnavailabilityError('AlternateAppIcons', 'setAlternateAppIcon');
  },
};
