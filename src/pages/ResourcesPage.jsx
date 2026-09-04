import Resources from '../components/Resources';
import SEO from '../components/SEO';

export default function ResourcesPage() {
  return (
    <>
      <SEO
        title="Resources"
        description="Access Walnut Technologies resources including whitepapers, case studies, technical documentation, and insights on medical devices and electronics manufacturing."
        path="/resources"
        keywords="electronics resources, medical device documentation, manufacturing whitepapers, technical resources"
      />
      <Resources />
    </>
  );
}
