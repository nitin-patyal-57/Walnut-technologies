import Solutions from '../components/Solutions';
import SEO from '../components/SEO';

export default function SolutionsPage({ onOpenQuote }) {
  return (
    <>
      <SEO
        title="Solutions"
        description="Walnut Technologies offers comprehensive OEM/ODM solutions including medical devices, payment systems, IoT solutions, and custom electronics manufacturing services."
        path="/solutions"
        keywords="OEM solutions, ODM solutions, medical device manufacturing, payment system manufacturing, IoT solutions, custom electronics"
      />
      <Solutions onOpenQuote={onOpenQuote} />
    </>
  );
}
