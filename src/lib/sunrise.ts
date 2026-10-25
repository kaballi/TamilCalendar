import type { CivilDate } from "./tamil-calendar";

const CHENNAI = { latitude: 13.0827, longitude: 80.2707 };
const SUNRISE_ZENITH = 90.833;

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export function sunriseTime(date: CivilDate, coordinates: Coordinates): Date | null {
  const dayOfYear = Math.floor(
    (Date.UTC(date.y, date.m - 1, date.d) - Date.UTC(date.y, 0, 0)) / 86400000,
  );
  const longitudeHour = coordinates.longitude / 15;
  const approximateTime = dayOfYear + (6 - longitudeHour) / 24;
  const meanAnomaly = 0.9856 * approximateTime - 3.289;
  const trueLongitude = normalizeDegrees(
    meanAnomaly +
      1.916 * Math.sin(toRadians(meanAnomaly)) +
      0.02 * Math.sin(2 * toRadians(meanAnomaly)) +
      282.634,
  );
  let rightAscension = normalizeDegrees(
    (180 / Math.PI) * Math.atan(0.91764 * Math.tan(toRadians(trueLongitude))),
  );
  rightAscension +=
    Math.floor(trueLongitude / 90) * 90 - Math.floor(rightAscension / 90) * 90;
  rightAscension /= 15;

  const sinDeclination = 0.39782 * Math.sin(toRadians(trueLongitude));
  const cosDeclination = Math.cos(Math.asin(sinDeclination));
  const cosHourAngle =
    (Math.cos(toRadians(SUNRISE_ZENITH)) -
      sinDeclination * Math.sin(toRadians(coordinates.latitude))) /
    (cosDeclination * Math.cos(toRadians(coordinates.latitude)));

  if (cosHourAngle > 1 || cosHourAngle < -1) return null;

  const hourAngle = (360 - (Math.acos(cosHourAngle) * 180) / Math.PI) / 15;
  const localMeanTime = hourAngle + rightAscension - 0.06571 * approximateTime - 6.622;
  const utcHours = normalizeHours(localMeanTime - longitudeHour);
  const milliseconds = Date.UTC(date.y, date.m - 1, date.d) + utcHours * 3600000;

  return new Date(milliseconds);
}

export const defaultSunriseCoordinates = CHENNAI;

function toRadians(degrees: number) {
  return (degrees * Math.PI) / 180;
}

function normalizeDegrees(degrees: number) {
  return ((degrees % 360) + 360) % 360;
}

function normalizeHours(hours: number) {
  return ((hours % 24) + 24) % 24;
}
