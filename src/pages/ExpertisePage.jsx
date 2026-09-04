import Expertise from '../components/Expertise';
import SEO from '../components/SEO';

export default function ExpertisePage() {
  return (
    <>
      <SEO
        title="Our Expertise"
        description="Explore Walnut Technologies' expertise in medical electronics, embedded systems, IoT, payment solutions, and custom electronics manufacturing."
        path="/expertise"
        keywords="medical electronics, embedded systems, IoT expertise, payment solutions, electronics manufacturing expertise"
      />
      <Expertise />
    </>
  );
}
