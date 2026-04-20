/**
 * RSS Parser Service
 *
 * Handles fetching and parsing RSS feeds from dental news sources.
 * Uses fast-xml-parser for robust server-side XML parsing.
 */
import { XMLParser } from 'fast-xml-parser';
import type { NewsArticle, NewsSource, NewsCategory } from '../../domain/entities/NewsArticle';

interface RSSFeed {
  rss?: {
    channel: RSSChannel;
  };
  feed?: AtomFeed; // Support for Atom feeds
}

interface RSSChannel {
  title: string;
  link: string;
  description: string;
  item: RSSItem | RSSItem[];
}

interface AtomFeed {
  title: string;
  link: string | { '@_href': string };
  entry: AtomEntry | AtomEntry[];
}

interface RSSItem {
  title: string;
  link: string;
  description?: string;
  pubDate?: string;
  guid?: string | { '#text': string };
  category?: string | string[];
  'content:encoded'?: string;
  'media:thumbnail'?: { '@_url': string } | { '@_url': string }[];
  'media:content'?: { '@_url': string } | { '@_url': string }[];
  enclosure?: { '@_url': string; '@_type': string };
  'dc:creator'?: string;
  author?: string;
}

interface AtomEntry {
  title: string;
  link: { '@_href': string } | { '@_href': string }[];
  summary?: string;
  content?: string;
  published?: string;
  updated?: string;
  id: string;
  author?: { name: string };
}

// Configure XML parser
const parserOptions = {
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: '#text',
  parseAttributeValue: true,
  trimValues: true,
  cdataPropName: '__cdata',
};

const parser = new XMLParser(parserOptions);

/**
 * Parse RSS feed XML to extract articles
 */
export async function parseRSSFeed(rssUrl: string, source: NewsSource): Promise<NewsArticle[]> {
  try {
    console.log(`Fetching RSS feed from ${source.name}: ${rssUrl}`);

    const response = await fetch(rssUrl, {
      next: { revalidate: 21600 }, // Cache for 6 hours
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'application/rss+xml, application/xml, text/xml, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        Referer: 'https://www.google.com/',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
      },
    });

    if (!response.ok) {
      // Silently skip sources that return 403 or other errors
      // This is expected for some sources that block automated requests
      if (response.status === 403) {
        console.warn(`RSS feed from ${source.name} blocked (403 Forbidden) - skipping`);
      } else {
        console.warn(
          `Failed to fetch RSS feed from ${source.name}: ${response.status} ${response.statusText}`
        );
      }
      return [];
    }

    const xmlText = await response.text();
    const feedData: RSSFeed = parser.parse(xmlText);

    // Handle RSS 2.0 format
    if (feedData.rss?.channel) {
      return parseRSSChannel(feedData.rss.channel, source);
    }

    // Handle Atom format
    if (feedData.feed) {
      return parseAtomFeed(feedData.feed, source);
    }

    console.warn(`Unknown feed format from ${source.name}`);
    return [];
  } catch (error) {
    console.error(`Error parsing RSS feed from ${source.name}:`, error);
    return [];
  }
}

/**
 * Parse RSS 2.0 channel
 */
function parseRSSChannel(channel: RSSChannel, source: NewsSource): NewsArticle[] {
  const items = Array.isArray(channel.item) ? channel.item : [channel.item];
  const articles: NewsArticle[] = [];

  items.forEach((item, index) => {
    if (!item) return;

    const article = parseRSSItem(item, source, index);
    if (article) {
      articles.push(article);
    }
  });

  return articles;
}

/**
 * Parse Atom feed
 */
function parseAtomFeed(feed: AtomFeed, source: NewsSource): NewsArticle[] {
  const entries = Array.isArray(feed.entry) ? feed.entry : [feed.entry];
  const articles: NewsArticle[] = [];

  entries.forEach((entry, index) => {
    if (!entry) return;

    const article = parseAtomEntry(entry, source, index);
    if (article) {
      articles.push(article);
    }
  });

  return articles;
}

/**
 * Parse individual RSS item to NewsArticle
 */
function parseRSSItem(item: RSSItem, source: NewsSource, index: number): NewsArticle | null {
  try {
    const title = extractText(item.title);
    const link = extractText(item.link);

    if (!title || !link) {
      return null;
    }

    // Extract description
    const description = item['content:encoded'] || item.description || '';
    const summary = cleanDescription(extractText(description));

    // Categorize article (needed before image extraction for placeholder)
    const category = categorizeArticle(title, summary);

    // Extract image or use category-specific placeholder
    let imageUrl = extractImageFromRSSItem(item);
    if (!imageUrl) {
      imageUrl = getPlaceholderImage(category);
    }

    // Parse publication date
    const pubDate = item.pubDate;
    const publishedDate = pubDate ? new Date(pubDate) : new Date();

    // Extract author
    const author = item['dc:creator'] || item.author;

    // Extract GUID
    const guid =
      typeof item.guid === 'string'
        ? item.guid
        : item.guid?.['#text'] || `${source.id}-${index}-${Date.now()}`;

    return {
      id: guid,
      title,
      summary,
      url: link,
      source,
      publishedDate,
      category,
      imageUrl,
      author,
      isFeatured: false,
      readCount: 0,
    };
  } catch (error) {
    console.error('Error parsing RSS item:', error);
    return null;
  }
}

/**
 * Parse Atom entry to NewsArticle
 */
function parseAtomEntry(entry: AtomEntry, source: NewsSource, index: number): NewsArticle | null {
  try {
    const title = extractText(entry.title);

    // Extract link
    let link = '';
    if (typeof entry.link === 'object') {
      if (Array.isArray(entry.link)) {
        link = entry.link[0]?.['@_href'] || '';
      } else {
        link = entry.link['@_href'] || '';
      }
    }

    if (!title || !link) {
      return null;
    }

    // Extract description
    const description = entry.content || entry.summary || '';
    const summary = cleanDescription(extractText(description));

    // Parse publication date
    const pubDate = entry.published || entry.updated;
    const publishedDate = pubDate ? new Date(pubDate) : new Date();

    // Extract author
    const author = entry.author?.name;

    // Categorize article
    const category = categorizeArticle(title, summary);

    return {
      id: entry.id || `${source.id}-${index}-${Date.now()}`,
      title,
      summary,
      url: link,
      source,
      publishedDate,
      category,
      author,
      isFeatured: false,
      readCount: 0,
    };
  } catch (error) {
    console.error('Error parsing Atom entry:', error);
    return null;
  }
}

/**
 * Extract text from various formats (string, object with #text, CDATA)
 */
function extractText(value: any): string {
  if (!value) return '';

  if (typeof value === 'string') {
    return value.trim();
  }

  if (typeof value === 'object') {
    // Handle CDATA
    if (value.__cdata) {
      return value.__cdata.trim();
    }
    // Handle #text
    if (value['#text']) {
      return value['#text'].trim();
    }
  }

  return String(value).trim();
}

/**
 * Get placeholder image based on article category
 */
function getPlaceholderImage(category: NewsCategory): string {
  const placeholders: Record<NewsCategory, string> = {
    'clinical-research': '/images/news/placeholder-clinical.svg',
    'practice-business': '/images/news/placeholder-business.svg',
    'industry-news': '/images/news/placeholder-news.svg',
    all: '/images/news/placeholder.svg',
  };

  return placeholders[category] || '/images/news/placeholder.svg';
}

/**
 * Extract image URL from RSS item
 */
function extractImageFromRSSItem(item: RSSItem): string | undefined {
  // Try media:thumbnail
  if (item['media:thumbnail']) {
    const thumbnail = Array.isArray(item['media:thumbnail'])
      ? item['media:thumbnail'][0]
      : item['media:thumbnail'];
    if (thumbnail?.['@_url']) {
      return thumbnail['@_url'];
    }
  }

  // Try media:content
  if (item['media:content']) {
    const content = Array.isArray(item['media:content'])
      ? item['media:content'][0]
      : item['media:content'];
    if (content?.['@_url'] && isImageUrl(content['@_url'])) {
      return content['@_url'];
    }
  }

  // Try enclosure
  if (item.enclosure?.['@_type']?.startsWith('image/')) {
    return item.enclosure['@_url'];
  }

  // Try to extract from content:encoded or description
  const content = item['content:encoded'] || item.description;
  if (content) {
    const contentText = extractText(content);
    const imgMatch = contentText.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (imgMatch && imgMatch[1]) {
      return imgMatch[1];
    }
  }

  return undefined;
}

/**
 * Check if URL is an image
 */
function isImageUrl(url: string): boolean {
  return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
}

/**
 * Categorize article based on keywords in title and description
 */
function categorizeArticle(title: string, description: string): NewsCategory {
  const content = `${title} ${description}`.toLowerCase();

  // Clinical research keywords
  const clinicalKeywords = [
    'research',
    'study',
    'clinical',
    'trial',
    'findings',
    'evidence',
    'treatment',
    'therapy',
    'diagnosis',
    'patient outcomes',
    'procedure',
    'technique',
    'endodontic',
    'periodontal',
    'orthodontic',
  ];

  // Practice/business keywords
  const businessKeywords = [
    'practice',
    'business',
    'management',
    'revenue',
    'marketing',
    'staff',
    'workflow',
    'efficiency',
    'technology',
    'software',
    'product',
    'equipment',
    'dental office',
    'practice management',
    'billing',
  ];

  const clinicalScore = clinicalKeywords.filter((kw) => content.includes(kw)).length;
  const businessScore = businessKeywords.filter((kw) => content.includes(kw)).length;

  if (clinicalScore > businessScore && clinicalScore > 0) {
    return 'clinical-research';
  } else if (businessScore > 0) {
    return 'practice-business';
  }

  return 'industry-news';
}

/**
 * Clean HTML tags and entities from description
 */
function cleanDescription(html: string): string {
  if (!html) return '';

  // Remove HTML tags
  let text = html.replace(/<[^>]*>/g, '');

  // Decode common HTML entities
  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&hellip;/g, '…')
    .replace(/&#(\d+);/g, (_match, dec) => String.fromCharCode(dec));

  // Remove extra whitespace
  text = text.replace(/\s+/g, ' ').trim();

  // Limit length
  if (text.length > 200) {
    text = text.substring(0, 197) + '...';
  }

  return text;
}

/**
 * Fetch articles from multiple RSS feeds
 */
export async function fetchAllRSSFeeds(sources: NewsSource[]): Promise<NewsArticle[]> {
  // Filter out sources without RSS URLs
  const validSources = sources.filter((source) => source.rssUrl && source.rssUrl.length > 0);

  console.log(
    `Fetching from ${validSources.length} RSS sources:`,
    validSources.map((s) => s.name)
  );

  const feedPromises = validSources.map((source) => parseRSSFeed(source.rssUrl!, source));

  const results = await Promise.allSettled(feedPromises);

  const allArticles: NewsArticle[] = [];
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      console.log(`✓ ${validSources[index].name}: ${result.value.length} articles`);
      allArticles.push(...result.value);
    } else {
      console.error(`✗ ${validSources[index].name}: ${result.reason}`);
    }
  });

  console.log(`Total articles fetched: ${allArticles.length}`);

  // Sort by publication date (newest first)
  allArticles.sort((a, b) => b.publishedDate.getTime() - a.publishedDate.getTime());

  return allArticles;
}
