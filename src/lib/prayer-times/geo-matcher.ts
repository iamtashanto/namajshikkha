import { CityLocation, BANGLADESH_DISTRICTS } from "@/src/data/locations";
import * as bdGeo from "bd-geo-info";

/**
 * Matches device GPS coordinates (latitude, longitude) to the nearest
 * Bangladesh district or location using bd-geo-info's spatial distance engine.
 */
export function matchNearestDistrict(lat: number, lng: number): CityLocation {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nearest = (bdGeo as any).findNearestLocation(
      { latitude: lat, longitude: lng },
      ["district"]
    );

    if (nearest && nearest.name) {
      const match = BANGLADESH_DISTRICTS.find(
        (d) =>
          d.nameEn.toLowerCase() === nearest.name.toLowerCase() ||
          d.nameBn === nearest.bn_name ||
          d.id === nearest.name.toLowerCase().replace(/\s+/g, "-")
      );
      if (match) {
        return {
          ...match,
          lat, // maintain accurate precise user coordinates
          lng,
        };
      }
    }
  } catch {
    // Fallback Euclidean calculation across BANGLADESH_DISTRICTS
  }

  // Fallback: Haversine / Euclidean distance to BANGLADESH_DISTRICTS
  let closest = BANGLADESH_DISTRICTS[0];
  let minDistance = Number.POSITIVE_INFINITY;

  for (const district of BANGLADESH_DISTRICTS) {
    const dLat = district.lat - lat;
    const dLng = district.lng - lng;
    const distSq = dLat * dLat + dLng * dLng;
    if (distSq < minDistance) {
      minDistance = distSq;
      closest = district;
    }
  }

  return {
    ...closest,
    lat,
    lng,
  };
}
