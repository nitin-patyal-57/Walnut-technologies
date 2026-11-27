import Expertise from '../components/Expertise';
import SEO from '../components/SEO';

export default function ExpertisePage() {
  return (
    <>
      <SEO
        title="Medical Electronics & IoT Expertise"
        description="Explore Walnut Technologies' expertise in medical electronics, embedded systems, IoT, payment solutions, and custom electronics manufacturing."
        path="/expertise"
        keywords="walnut technologies expertise, medical electronics, embedded systems, IoT expertise, payment solutions, electronics manufacturing expertise"
      />
      <Expertise />
    </>
  );
}
