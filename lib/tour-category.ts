/** Normalize tour category keys for filtering / currency (handles renamed slugs). */

export function normalizeCategoryKey(value?: string | null): string {
  const raw = (value || '').toLowerCase().trim();
  if (!raw) return '';

  // Treat renamed/typo slugs as the same nav groups
  if (raw === 'regional' || raw.startsWith('regional') || raw.includes('regional')) {
    return 'regional';
  }
  if (
    raw === 'international' ||
    raw.startsWith('international') ||
    raw.includes('international')
  ) {
    return 'international';
  }

  return raw;
}

export function categoryMatches(
  tourCategory: string | null | undefined,
  selectedCategory: string
): boolean {
  if (!selectedCategory || selectedCategory === 'all') return true;
  const tourKey = normalizeCategoryKey(tourCategory);
  const selectedKey = normalizeCategoryKey(selectedCategory);
  if (!tourKey || !selectedKey) return false;
  return tourKey === selectedKey || tourCategory === selectedCategory;
}
