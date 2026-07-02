const mapStyle = [
  // Base
  {
    elementType: "geometry",
    stylers: [{ color: "#F8F4F2" }],
  },

  // Text
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#7B6666" }],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#F8F4F2" }],
  },

  // Administrative
  {
    featureType: "administrative",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },

  // Landscape
  {
    featureType: "landscape.man_made",
    elementType: "geometry",
    stylers: [{ color: "#F8F4F2" }],
  },
  {
    featureType: "landscape.natural",
    elementType: "geometry",
    stylers: [{ color: "#E6EDD9" }],
  },
  {
    featureType: "landscape.natural.terrain",
    stylers: [{ visibility: "off" }],
  },

  // Parks
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#DCE9D3" }],
  },

  // Remove clutter
  {
    featureType: "poi.business",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "poi.school",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "poi.government",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "poi.medical",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "transit",
    stylers: [{ visibility: "off" }],
  },

  // Roads
  {
    featureType: "road",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ visibility: "off" }],
  },

  {
    featureType: "road.local",
    elementType: "geometry.fill",
    stylers: [{ color: "#FFFFFF" }],
  },

  {
    featureType: "road.arterial",
    elementType: "geometry.fill",
    stylers: [{ color: "#F5F1EE" }],
  },

  {
    featureType: "road.highway",
    elementType: "geometry.fill",
    stylers: [{ color: "#EBCACA" }],
  },

  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#DFC0C0" }],
  },

  // Water
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#DCEBF0" }],
  },

  {
    featureType: "water",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
];

export default mapStyle;
