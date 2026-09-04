import Process from '../components/Process';
import SEO from '../components/SEO';

export default function ProcessPage() {
  return (
    <>
      <SEO
        title="Our Process"
        description="Discover Walnut Technologies' 10-step manufacturing process from idea to support. ISO 13485 certified quality management for medical devices and electronics."
        path="/process"
        keywords="manufacturing process, electronics production, quality management, ISO 13485 process, OEM manufacturing steps"
      />
      <Process />
    </>
  );
}
