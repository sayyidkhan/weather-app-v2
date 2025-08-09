export type DataPoint = {
  date: string;
  humidity: number; // %
  radiation: number; // W/m^2
  tMin: number; // °C
  tMax: number; // °C
};

export type Location = {
  id: string;
  name: string;
  coords: [number, number]; // [lat, lng]
  data: DataPoint[];
};

function formatDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function generateSeries(seed = 1): DataPoint[] {
  const days = 12;
  const today = new Date();
  const arr: DataPoint[] = [];
  let hum = 70 + (seed % 5) * 2;
  let rad = 400 + (seed % 7) * 50;
  let base = 24 + (seed % 3);

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);

    hum = clamp(hum + (Math.random() * 10 - 5), 55, 95);
    rad = clamp(rad + (Math.random() * 120 - 60), 120, 950);
    const tMin = clamp(base + (Math.random() * 2 - 1), 22, 27);
    const tMax = clamp(tMin + 3 + Math.random() * 4, 27, 35);

    arr.push({
      date: formatDate(d),
      humidity: Math.round(hum),
      radiation: Math.round(rad),
      tMin: Number(tMin.toFixed(1)),
      tMax: Number(tMax.toFixed(1)),
    });
  }
  return arr;
}

export const LOCATIONS: Location[] = [
  {
    id: 'choa-chu-kang',
    name: 'Choa Chu Kang',
    coords: [1.3854, 103.7443],
    data: generateSeries(1),
  },
  {
    id: 'bukit-timah',
    name: 'Bukit Timah',
    coords: [1.3294, 103.8021],
    data: generateSeries(7),
  },
  {
    id: 'queenstown',
    name: 'Queenstown',
    coords: [1.2941, 103.806],
    data: generateSeries(13),
  },
];

export const DEFAULT_LOCATION_ID = LOCATIONS[0].id;
