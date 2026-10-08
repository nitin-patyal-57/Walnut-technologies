import { useRef, useEffect, useState, useCallback } from 'react';
import { FiArrowLeft, FiCheckCircle, FiCpu, FiActivity, FiHeart, FiWifi, FiMonitor, FiZap, FiTarget, FiShield } from 'react-icons/fi';
import Picture from '../components/Picture';

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

const walklabFeatures = [
  'Neural Gait Retraining',
  'VR Multitask Training',
  'Real-time Audio & Visual Feedback',
  'Objective Progress per Session',
];

const tiltFeatures = [
  'Progressive Verticalization',
  'Alternating Stepping Motion',
  'Maintains Venous Return',
  'Prevents Bed-Rest Complications',
];

const walklabStats = [
  { value: '150 kg', label: 'Max patient weight' },
  { value: '1.8–4 km/h', label: 'Treadmill speed' },
  { value: '<10 min', label: 'Therapist setup time' },
];

const tiltStats = [
  { value: '0–90°', label: 'Tilt range' },
  { value: '45°', label: 'Leg stroke range' },
  { value: '20–39', label: 'Steps/min · 3 cadences' },
];

function ProductTile({ index, image, alt, badge, badgeIcon: BadgeIcon, title, subtitle, description, features, stats, visible, delay = '0ms', flip = false }) {
  return (
    <article
      className={`relative rounded-3xl overflow-hidden bg-white border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-100/40 transition-all duration-700 group ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: visible ? delay : '0ms' }}
    >
      <div className="relative h-56 sm:h-72 lg:h-80 overflow-hidden bg-white">
        <div
          className={
            flip
              ? 'absolute inset-0 bg-[radial-gradient(circle_at_70%_45%,rgba(59,130,246,0.22),transparent_62%)]'
              : 'absolute inset-0 bg-[radial-gradient(circle_at_30%_45%,rgba(59,130,246,0.22),transparent_62%)]'
          }
        />
        <span className="absolute top-3 right-6 text-[5.5rem] lg:text-[7rem] font-black text-slate-200/90 leading-none select-none z-10 pointer-events-none">
          {index}
        </span>
        <Picture sizes="(max-width: 640px) 100vw, (max-width: 1024px) 66vw, 40vw"
          loading="lazy"
          decoding="async"
          src={image}
          alt={alt}
          className={`relative z-10 w-full h-full object-contain p-5 lg:p-7 mix-blend-multiply group-hover:scale-105 transition-transform duration-700 ease-out ${flip ? 'scale-100' : ''}`}
        />
        <div className="absolute left-5 top-5 z-20">
          <span className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-sm text-blue-600 text-[11px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
            <BadgeIcon className="w-3.5 h-3.5" /> {badge}
          </span>
        </div>
      </div>

      <div className="p-6 lg:p-8">
        <h3 className="text-2xl lg:text-[1.75rem] font-bold text-[#0f172a] mb-1.5 leading-tight">{title}</h3>
        <p className="text-blue-500 font-semibold text-sm mb-3">{subtitle}</p>
        <p className="text-slate-600 text-sm leading-relaxed mb-5">{description}</p>
        <div className="flex flex-wrap gap-2">
          {features.map((f) => (
            <span
              key={f}
              className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50/70 px-3 py-1.5 text-[11px] font-semibold text-blue-700 transition-colors group-hover:border-blue-200 group-hover:bg-blue-50"
            >
              <FiCheckCircle className="w-3.5 h-3.5 shrink-0" />
              {f}
            </span>
          ))}
        </div>

        <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-3">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`min-w-0 px-3 first:pl-0 last:pr-0 ${i > 0 ? 'border-l border-slate-100' : ''}`}
            >
              <p className="text-base sm:text-lg font-black text-[#0f172a] leading-none tracking-tight">{s.value}</p>
              <p className="mt-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 leading-snug">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

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
      <section ref={heroRef} className="relative pt-14">
        <button
          onClick={onBack}
          className="absolute top-24 left-4 sm:top-28 sm:left-6 z-20 flex items-center gap-2 bg-white/95 backdrop-blur-sm text-[#0f172a] border border-slate-200 rounded-full px-5 py-2.5 shadow-md hover:shadow-lg hover:bg-white transition-all duration-300 cursor-pointer"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">All Divisions</span>
        </button>
        <div className={`transition-opacity duration-500 md:-mt-32 ${heroVisible ? 'opacity-100' : 'opacity-0'}`}>
          <Picture sizes="100vw" src="/images/products/neuro.webp" alt="Neuro Rehab Devices" width="1920" height="1077" className="w-full h-auto" loading="lazy" />
        </div>
      </section>

      <section ref={featRef} className="py-16 md:py-24 bg-white">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
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

      <section ref={prodRef} className="py-16 md:py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-14 transition-all duration-500 ${prodVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
            <p className="text-blue-500 font-semibold text-sm uppercase tracking-wider mb-2">Our Products</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a]">Our Products</h2>
            <p className="text-slate-500 text-sm mt-3 max-w-lg mx-auto">Two powerful systems working together to deliver complete neuro rehabilitation — from gait retraining to therapeutic positioning.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <ProductTile
              index="01"
              image="/images/products/walklab-product.webp"
              alt="WalkLab Gait Training System"
              badge="Flagship Product"
              badgeIcon={FiCpu}
              title="WalkLab Gait Training System"
              subtitle="Lower Limb Gait Training System"
              description="A high-level gait training platform that improves gait outcomes, accelerates recovery and reduces cost of care through intensive, repetitive retraining of normal movement. Sensors track lower-limb kinematics and muscle activation to guide each step with the correct timing and force, with instant audio and visual feedback — for stroke, TBI, spinal cord injury, cerebral palsy, MS, Parkinson's and orthopedic conditions."
              features={walklabFeatures}
              stats={walklabStats}
              visible={prodVisible}
            />

            <ProductTile
              index="02"
              flip
              image="/images/products/tilt-bed.webp"
              alt="Tilt Bed Therapeutic Positioning System"
              badge="Therapeutic System"
              badgeIcon={FiTarget}
              title="Tilt Bed"
              subtitle="Motorised Tilt Table with Leg Stepping"
              description="A motorised tilt table with an integrated leg-stepping mechanism. The patient lies supine and is strapped in, the table is raised gradually toward vertical while the legs move in a continuous alternating stepping pattern. Working the calf muscle pump maintains venous return, so blood pressure holds and verticalization can start earlier and be tolerated longer — for early mobilization after stroke, traumatic brain injury, spinal cord injury and prolonged ICU stays."
              features={tiltFeatures}
              stats={tiltStats}
              visible={prodVisible}
              delay="150ms"
            />
          </div>

        </div>
      </section>

      <section ref={capRef} className="py-16 md:py-24 bg-white">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
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
