export function getRandomLocation() {
  // Approximate geographic bounds of Tripura
  const MIN_LATITUDE = 22.95;
  const MAX_LATITUDE = 24.53;
  const MIN_LONGITUDE = 91.15;
  const MAX_LONGITUDE = 92.33;

  return {
    latitude: MIN_LATITUDE + Math.random() * (MAX_LATITUDE - MIN_LATITUDE),
    longitude: MIN_LONGITUDE + Math.random() * (MAX_LONGITUDE - MIN_LONGITUDE),
  };
}
