/** Shared option lists for the admin tour form and public display. */

export const TOUR_LOCATIONS = [
  'Thimphu',
  'Paro',
  'Punakha',
  'Wangdue',
  'Phobjkha',
  'Bumthang',
  'Phuntsholing',
] as const;

export const MEAL_OPTIONS = [
  { value: 'Breakfast only', label: 'Breakfast only' },
  { value: 'Breakfast and dinner', label: 'Breakfast and dinner' },
  { value: 'All meals', label: 'All meals' },
] as const;

export const ACCOMMODATION_OPTIONS = [
  { value: '3 Star', label: '3 Star' },
  { value: '4 Star', label: '4 Star' },
  { value: '5 Star', label: '5 Star' },
] as const;

export const TOUR_INCLUSION_OPTIONS = [
  'SDF',
  'Rooms',
  'Breakfast & dinner',
  'All meals',
  'International flight',
  'Domestic flights',
  'Guides',
  'Cars',
  'Drop & pickup',
] as const;

export type TourLocation = (typeof TOUR_LOCATIONS)[number];
export type MealOption = (typeof MEAL_OPTIONS)[number]['value'];
export type AccommodationOption = (typeof ACCOMMODATION_OPTIONS)[number]['value'];
export type TourInclusionOption = (typeof TOUR_INCLUSION_OPTIONS)[number];

export type ItineraryDay = {
  day: number;
  title: string;
  location: string;
  description: string;
  meals: string;
  accommodation: string;
  activities?: string[];
};

export function createEmptyItineraryDay(dayNumber: number): ItineraryDay {
  return {
    day: dayNumber,
    title: '',
    location: '',
    description: '',
    meals: '',
    accommodation: '',
  };
}
