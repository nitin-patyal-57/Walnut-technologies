import { useRef, useEffect, useState, useCallback } from 'react';
import { FiArrowLeft, FiCheckCircle, FiCpu, FiActivity, FiHeart, FiWifi, FiMonitor, FiZap, FiTarget, FiShield } from 'react-icons/fi';

const keyFeatures = [
  { icon: FiCpu, label: 'AI-Assisted Therapy', value: 'Machine learning algorithms personalize rehabilitation protocols' },
  { icon: FiActivity, label: 'Real-time Monitoring', value: 'Live tracking of patient progress and gait parameters' },
  { icon: FiHeart, label: 'Patient Dashboard', value: 'Comprehensive visualization of recovery milestones' },
  { icon: FiWifi, label: 'Tele-Rehab Ready', value: 'Remote therapy sessions and monitoring capabilities' },
  { icon: FiMonitor, label: 'Gait Analysis', value: 'Detailed biomechanical analysis of walking patterns' },
  { icon: FiZap, label: 'Motor Recovery', value: 'Advanced neuroplasticity-based rehabilitation techniques' },
  { icon: FiTarget, label: 'Precision Control', value: 'Fine-tuned resistance and assistance levels' },
  { icon: FiShield, label: 'Safety First', value: 'Multiple safety sensors and emergency stop features' },
];

const capabilities = [
  {
    number: 1,
    title: 'Neuro Rehabilitation Solutions',
    subtitle: 'Comprehensive therapy systems',
    description: 'End-to-end rehabilitation solutions designed for hospitals, clinics, and recovery centers. Our systems support stroke recovery, spinal cord injuries, and neurological conditions.',
    bulletPoints: ['Stroke Rehabilitation', 'Spinal Cord Injury Recovery', 'Traumatic Brain Injury Therapy', 'Neurological Disease Management'],
  },
  {
    number: 2,
    title: 'AI-Powered Therapy',
    subtitle: 'Personalized recovery protocols',
    description: 'Leveraging artificial intelligence to create personalized therapy plans that adapt to patient progress in real-time.',
    bulletPoints: ['Adaptive Therapy Protocols', 'Progress Tracking & Analytics', 'Predictive Recovery Modeling', 'Evidence-Based Recommendations'],
  },
  {
    number: 3,
    title: 'Remote Monitoring Platform',
    subtitle: 'Tele-rehabilitation capabilities',
    description: 'Enable patients to continue their rehabilitation journey from home with our comprehensive tele-rehab platform.',
    bulletPoints: ['Video Consultation Integration', 'Home Exercise Monitoring', 'Progress Reports for Clinicians', 'Emergency Alert System'],
  },
  {
    number: 4,
    title: 'Research & Development',
    subtitle: 'Innovation in neuro rehab',
    description: 'Continuous R&D efforts to advance neuro rehabilitation technology and improve patient outcomes through cutting-edge research.',
    bulletPoints: ['Clinical Trial Support', 'University Partnerships', 'Publication & Studies', 'Technology Innovation'],
  },
];

function useAnimateOnScroll() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

export default function NeuroShowcase({ onBack }) {
  const [heroRef, heroVisible] = useAnimateOnScroll();
  const [featRef, featVisible] = useAnimateOnScroll();
  const [prodRef, prodVisible] = useAnimateOnScroll();
  const [capRef, capVisible] = useAnimateOnScroll();

  return (
    <div className="min-h-screen bg-slate-50">
      <section ref={heroRef} className="relative">
        <button
          onClick={onBack}
          className="absolute top-16 left-4 sm:top-20 sm:left-6 z-20 flex items-center gap-2 bg-white/95 backdrop-blur-sm text-[#0f172a] border border-slate-200 rounded-full px-5 py-2.5 shadow-md hover:shadow-lg hover:bg-white transition-all duration-300 cursor-pointer"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">All Divisions</span>
        </button>
        <div className={`transition-opacity duration-500 ${heroVisible ? 'opacity-100' : 'opacity-0'}`}>
          <img src="/neuro.jpeg" alt="Neuro Rehab Devices" className="w-full h-auto" loading="eager" />
        </div>
      </section>

      <section ref={featRef} className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-12 transition-all duration-500 ${featVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
            <p className="text-blue-500 font-semibold text-sm uppercase tracking-wider mb-2">Key Features</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a]">Neuro Rehabilitation Excellence</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {keyFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.label}
                  className={`flex items-start gap-3 p-4 bg-white border border-slate-100 rounded-xl hover:shadow-lg hover:border-blue-100 transition-all duration-300 group ${featVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                  style={{ transitionDelay: featVisible ? `${index * 50}ms` : '0ms' }}
                >
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                    <Icon className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-[#0f172a] text-sm leading-tight">{feature.label}</p>
                    <p className="text-slate-500 text-sm mt-0.5 leading-snug">{feature.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section ref={prodRef} className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-12 transition-all duration-500 ${prodVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
            <p className="text-blue-500 font-semibold text-sm uppercase tracking-wider mb-2">Our Products</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a]">Our Product</h2>
          </div>
          <div className={`bg-white border border-slate-100 rounded-2xl p-6 lg:p-8 transition-all duration-500 ${prodVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
            <div className="flex items-start gap-5">
              <div className="w-24 h-24 lg:w-32 lg:h-32 bg-slate-50 rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
                <img src="/walklab 3.0.jpeg" alt="WalkLab" className="w-full h-full object-contain mix-blend-multiply" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-[#0f172a] text-lg leading-tight mb-1">WalkLab Gait Training System</h3>
                <p className="text-blue-500 text-sm font-medium mb-2">Advanced rehabilitation robot</p>
                <p className="text-slate-600 text-sm leading-relaxed mb-3">Advanced rehabilitation robot for gait training and motor recovery. AI-assisted therapy with real-time patient monitoring and tele-rehab capabilities.</p>
                <div className="flex flex-wrap gap-2">
                  {['Rehabilitation Robot', 'AI-Assisted Therapy', 'Patient Dashboard', 'Tele-Rehab Ready'].map((h) => (
                    <span key={h} className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 text-xs font-medium px-3 py-1.5 rounded-full">
                      <FiCheckCircle className="w-3 h-3" />{h}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section ref={capRef} className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-12 transition-all duration-500 ${capVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
            <p className="text-blue-500 font-semibold text-sm uppercase tracking-wider mb-2">Our Capabilities</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a]">End-to-End Neuro Rehab Solutions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {capabilities.map((cap, index) => (
              <div
                key={cap.number}
                className={`bg-white border border-slate-100 rounded-2xl p-6 lg:p-8 hover:shadow-xl transition-all duration-300 ${capVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
                style={{ transitionDelay: capVisible ? `${index * 80}ms` : '0ms' }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-lg shadow-blue-500/20">
                    {cap.number}
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0f172a] text-lg leading-tight">{cap.title}</h3>
                    <p className="text-blue-500 text-sm font-medium">{cap.subtitle}</p>
                  </div>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">{cap.description}</p>
                <ul className="space-y-2">
                  {cap.bulletPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                      <FiCheckCircle className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
