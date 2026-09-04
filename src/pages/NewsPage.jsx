import News from '../components/News';
import SEO from '../components/SEO';

export default function NewsPage() {
  return (
    <>
      <SEO
        title="News & Updates"
        description="Stay updated with latest news from Walnut Technologies - new product launches, industry insights, company milestones, and electronics manufacturing trends."
        path="/news"
        keywords="electronics manufacturing news, medical device updates, Walnut Technologies news, industry insights"
      />
      <News />
    </>
  );
}
