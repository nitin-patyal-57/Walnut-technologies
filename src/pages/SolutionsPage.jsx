import Solutions from '../components/Solutions';
import SEO from '../components/SEO';

export default function SolutionsPage() {
  return (
    <>
      <SEO
        title="OEM ODM Manufacturing Solutions"
        description="OEM/ODM solutions from Walnut Technologies: medical devices, payment systems, IoT solutions and custom electronics manufacturing services."
        path="/solutions"
        keywords="walnut technologies solutions, OEM solutions, ODM solutions, medical device manufacturing, payment system manufacturing, IoT solutions, custom electronics"
      />
      <Solutions />
    </>
  );
}
