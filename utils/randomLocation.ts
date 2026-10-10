const BASE_LOCATION = {
  latitude: 23.84251,
  longitude: 91.42521,
};

export function getRandomLocation(
  latitude = BASE_LOCATION.latitude,
  longitude = BASE_LOCATION.longitude,
  radius = 0.001,
) {
  return {
    latitude: latitude + (Math.random() - 0.5) * 2 * radius,
    longitude: longitude + (Math.random() - 0.5) * 2 * radius,
  };
}
