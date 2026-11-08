import type { MetadataRoute } from 'next';
import { site } from '@ccs/shared';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? site.url;

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: baseUrl, changeFrequency: 'monthly', priority: 1 }];
}
