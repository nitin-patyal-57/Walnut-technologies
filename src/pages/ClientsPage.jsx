import Clients from '../components/Clients';
import SEO from '../components/SEO';

export default function ClientsPage() {
  return (
    <>
      <SEO
        title="Our Clients"
        description="Trusted by leading brands including SBI, Paytm, Apollo, HDFC and the Indian Army for medical devices, payment systems and electronics manufacturing."
        path="/clients"
        keywords="Walnut Technologies clients, OEM customers, medical device clients, payment system partners"
      />
      <Clients />
    </>
  );
}
