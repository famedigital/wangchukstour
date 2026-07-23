'use client';

import { useEffect, useState } from 'react';
import { DEFAULT_COMPANY_NAME, DEFAULT_COMPANY_TAGLINE } from '@/lib/brand-defaults';

type BrandInfo = {
  name: string;
  tagline: string;
};

/**
 * Client hook — company name from Admin → SEO → Site Name (CRM).
 */
export function useCompanyBrand(): BrandInfo {
  const [brand, setBrand] = useState<BrandInfo>({
    name: DEFAULT_COMPANY_NAME,
    tagline: DEFAULT_COMPANY_TAGLINE,
  });

  useEffect(() => {
    let cancelled = false;
    fetch('/api/brand', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data) return;
        setBrand({
          name: String(data.name || DEFAULT_COMPANY_NAME).trim() || DEFAULT_COMPANY_NAME,
          tagline:
            String(data.tagline || DEFAULT_COMPANY_TAGLINE).trim() || DEFAULT_COMPANY_TAGLINE,
        });
      })
      .catch(() => {
        /* keep defaults */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return brand;
}
