/**
 * NewsPage Component
 *
 * Standalone news page with full features.
 */
import { NewsSection } from './components/NewsSection';

export function NewsPage() {
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
