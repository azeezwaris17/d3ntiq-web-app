# News Module

RSS-powered dental industry news integration for D3NTIQ platform.

## Overview

This module fetches and displays dental industry news from 6 authoritative sources using RSS feeds. It follows Clean Architecture principles with domain entities, use cases, repositories, and presentation components.

## Features

- **RSS Feed Integration**: Automatically fetches news from 6 dental industry sources
- **Smart Categorization**: AI-powered categorization into Industry News, Clinical Research, and Practice & Business
- **Caching**: 6-hour server-side caching for optimal performance
- **Fallback Data**: Manual curated articles when RSS feeds fail
- **Search & Filter**: Full-text search and category filtering
- **Featured Articles**: Highlight important news
- **Trending Section**: Most read articles (simulated for now)
- **Responsive Design**: Mobile-first with Mantine UI components

## News Sources

1. **ADA News** - American Dental Association
2. **DrBicuspid.com** - Clinical care and technology news
3. **Dental Economics** - Practice management insights
4. **Dental Tribune** - International dental news
5. **Inside Dentistry** - Clinical techniques and treatments
6. **Dental Product Shopper** - Product releases and reviews

## Architecture

```
news/
├── domain/
│   ├── entities/
│   │   └── NewsArticle.ts          # Core domain entity
│   └── repositories/
│       └── INewsRepository.ts       # Repository interface
├── infrastructure/
│   ├── data/
│   │   ├── newsSourcesData.ts      # RSS feed configuration
│   │   └── fallbackNewsData.ts     # Manual curated fallback
│   ├── services/
│   │   └── rssParser.ts            # RSS feed parsing logic
│   └── repositories/
│       └── NewsRepository.ts        # Repository implementation
├── application/
│   └── use-cases/
│       ├── GetLatestNews.ts        # Fetch latest articles
│       ├── GetNewsByCategory.ts    # Filter by category
│       └── SearchNews.ts           # Search functionality
└── presentation/
    ├── components/
    │   ├── NewsSection.tsx         # Main container (client)
    │   ├── NewsSection.server.tsx  # Server wrapper
    │   ├── NewsArticleCard.tsx     # Article card
    │   ├── FeaturedArticle.tsx     # Featured article display
    │   ├── TrendingNews.tsx        # Trending sidebar
    │   ├── NewsSearchBar.tsx       # Search input
    │   └── NewsCategoryTabs.tsx    # Category tabs
    ├── NewsPage.tsx                # Standalone news page
    └── index.ts                    # Component exports
```

## Usage

### Homepage Integration (Server Component)

```tsx
import { NewsSectionServer } from '@/modules/public-pages/news/presentation/components';

export default async function HomePage() {
  return (
    <div>
      {/* Other sections */}
      <NewsSectionServer maxArticles={6} category="all" />
    </div>
  );
}
```

### Services Page Integration

```tsx
import { NewsSectionServer } from '@/modules/public-pages/news/presentation/components';

export default async function ServicesPage() {
  return (
    <div>
      {/* Other sections */}
      <NewsSectionServer maxArticles={9} category="practice-business" />
    </div>
  );
}
```

### Standalone News Page (Client Component)

```tsx
import { NewsSection } from '@/modules/public-pages/news/presentation/components';

export default function NewsPage() {
  return (
    <NewsSection
      variant="full"
      maxArticles={12}
      showCategories={true}
      showSearch={true}
      showFeatured={true}
      showTrending={true}
    />
  );
}
```

### API Route

```
GET /api/news
GET /api/news?category=clinical-research
GET /api/news?search=implants
GET /api/news?featured=true
GET /api/news?trending=true&limit=5
```

## Configuration

### Adding New News Sources

Edit `infrastructure/data/newsSourcesData.ts`:

```typescript
{
  id: 'new-source',
  name: 'New Dental Source',
  logoUrl: '/images/news-sources/new-source-logo.png',
  websiteUrl: 'https://example.com',
  rssUrl: 'https://example.com/rss',
  description: 'Description of the source',
}
```

### Updating Fallback Data

Edit `infrastructure/data/fallbackNewsData.ts` to add manually curated articles.

### Adjusting Cache Duration

In `NewsRepository.ts`, modify:

```typescript
private readonly CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours
```

## Categorization Logic

Articles are automatically categorized based on keywords:

- **Clinical Research**: research, study, clinical, trial, findings, evidence, treatment
- **Practice & Business**: practice, business, management, revenue, marketing, technology
- **Industry News**: Default category for general news

## Performance

- **Server-side caching**: 6-hour cache reduces RSS fetch frequency
- **Next.js ISR**: Incremental Static Regeneration for optimal performance
- **Lazy loading**: Images load on demand
- **Debounced search**: 300ms delay prevents excessive searches

## Future Enhancements

- [ ] Track actual read counts for trending articles
- [ ] User bookmarking/favorites
- [ ] Email newsletter subscription
- [ ] Social media sharing
- [ ] Related articles suggestions
- [ ] Admin panel for content curation
- [ ] Comments/discussion system
- [ ] RSS feed for D3NTIQ news

## Maintenance

### Weekly Tasks

- Review fallback data and update with latest articles
- Check RSS feed availability
- Monitor error logs for failed fetches

### Monthly Tasks

- Update news source logos if needed
- Review categorization accuracy
- Analyze popular articles

## Troubleshooting

### RSS Feeds Not Loading

1. Check network connectivity
2. Verify RSS URLs are still valid
3. Check CORS settings if fetching client-side
4. Review error logs in console

### Articles Not Categorizing Correctly

1. Review keywords in `rssParser.ts`
2. Add more specific keywords for your use case
3. Consider manual categorization for important articles

### Images Not Displaying

1. Ensure fallback images exist in `/public/images/news/`
2. Check image URLs in RSS feeds
3. Verify Next.js Image optimization settings

## License

Proprietary - D3NTIQ Platform
