import { useState, useRef, useEffect } from "react";

const SERVICES = [
  {
    num: "01",
    title: "Food Testing",
    desc: "Full-scope food testing through EIAC and ISO certified labs. We cover chemical, microbiological, and physical parameters — including nutritional profiling, allergen detection, pathogen screening, contaminant analysis, and shelf-life studies. Every test is conducted under accredited methodology with results you can present to regulators with confidence.",
    tags: ["Chemical Analysis", "Microbiological Testing", "Physical Parameters", "Allergen & Shelf-Life"],
  },
  {
    num: "02",
    title: "Calibration Services",
    desc: "Keep your instruments operating within certified tolerances. TASA connects you to EIAC accredited calibration providers for thermometers, pH meters, balances, pressure gauges, and more — fully traceable to international standards, with certificates issued and on-site service available where needed.",
    tags: ["EIAC Accredited", "On-Site Available", "Traceable Certificates", "ISO/IEC 17025"],
  },
];

const STATS = [
  { value: "1", label: "Platform. All services." },
  { value: "48h", label: "Avg. turnaround" },
  { value: "EIAC", label: "& ISO certified labs" },
  { value: "5–20%", label: "Platform savings" },
];

const SERVICE_OPTIONS = [
  "Food Testing",
  "Calibration Services",
  "Both Services",
  "Risk Analysis / Consultation",
  "Other / Not Sure",
];

export default function Index() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    serviceType: "",
    message: "",
  });
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [navScrolled, setNavScrolled] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) setInvoiceFile(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setInvoiceFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => fd.append(k, v));
      if (invoiceFile) fd.append("invoice", invoiceFile);

      const res = await fetch("/api/submit", { method: "POST", body: fd });
      const data = await res.json();

      if (!res.ok || !data.success) throw new Error(data.error || "Submission failed");
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-[#F0F5F0] overflow-x-hidden">

      {/* NAV */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: navScrolled ? "rgba(15,23,42,0.95)" : "transparent",
          backdropFilter: navScrolled ? "blur(12px)" : "none",
          borderBottom: navScrolled ? "1px solid rgba(16,185,129,0.1)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 2L32 10V26L18 34L4 26V10L18 2Z" fill="#0F172A" stroke="#10B981" strokeWidth="1.5"/>
              <path d="M10 10L26 26" stroke="rgba(16,185,129,0.2)" strokeWidth="0.8" strokeLinecap="round"/>
              <path d="M10 13H26" stroke="#10B981" strokeWidth="2.2" strokeLinecap="round"/>
              <path d="M18 13V25" stroke="#10B981" strokeWidth="2.2" strokeLinecap="round"/>
              <circle cx="10" cy="13" r="1.5" fill="#10B981"/>
              <circle cx="26" cy="13" r="1.5" fill="#10B981"/>
              <circle cx="18" cy="25" r="1.5" fill="#10B981"/>
              <circle cx="18" cy="13" r="0.8" fill="#0F172A"/>
            </svg>
            <div className="flex flex-col leading-tight">
              <span style={{ fontFamily: "var(--font-display)" }} className="text-xl tracking-widest text-[#F0F5F0]">
                TASA
              </span>
              <span style={{ fontFamily: "var(--font-body)", fontSize: "0.58rem" }} className="text-[#10B981] tracking-widest uppercase hidden md:block">
                Simplifying Testing. Strengthening Safety.
              </span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-[#94A3B8]" style={{ fontFamily: "var(--font-body)" }}>
            <a href="#services" className="hover:text-[#10B981] transition-colors">Services</a>
            <a href="#platform" className="hover:text-[#10B981] transition-colors">Platform</a>
            <a href="#dashboard" className="hover:text-[#10B981] transition-colors">Dashboard</a>
            <a href="#claim" className="hover:text-[#10B981] transition-colors">Get Started</a>
          </div>
          <button
            onClick={scrollToForm}
            className="btn-primary px-5 py-2 text-sm font-semibold"
            style={{ fontFamily: "var(--font-display)", letterSpacing: "0.1em" }}
          >
            GET STARTED
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
        <div className="hero-gradient absolute inset-0 pointer-events-none" />

        {/* BG grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(rgba(16,185,129,1) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,1) 1px, transparent 1px)",
            backgroundSize: "60px 60px"
          }}
        />

        {/* Large background text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(6rem, 18vw, 22rem)",
            color: "rgba(16,185,129,0.03)",
            letterSpacing: "0.05em",
            whiteSpace: "nowrap",
          }}>
          TASA
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">
          <div className="max-w-4xl">
            {/* Tag */}
            <div className="inline-flex items-center gap-2 mb-8">
              <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse" />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem" }} className="text-[#10B981] tracking-[0.2em] uppercase">
                Testing as a Service
              </span>
            </div>

            {/* Headline */}
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(3.5rem, 9vw, 9rem)",
                lineHeight: "0.95",
                letterSpacing: "0.02em",
              }}
              className="mb-6"
            >
              <span className="text-[#F0F5F0]">ONE PLATFORM.</span>
              <br />
              <span className="text-[#10B981] glow-text">ALL YOUR</span>
              <br />
              <span className="text-[#F0F5F0]">FOOD SAFETY</span>
              <br />
              <span className="text-[#F0F5F0]">NEEDS.</span>
            </h1>

            <p className="text-[#94A3B8] text-lg md:text-xl max-w-xl leading-relaxed mb-4">
              TASA aggregates <span className="text-[#10B981] font-semibold">EIAC and ISO certified labs</span> into one <span className="text-[#F0F5F0]">Testing as a Service</span> platform. Manage food testing, calibration, risk analysis, and food safety in one place — with a single point of contact, consolidated reporting, and proactive insights that keep your business ahead of compliance.
            </p>
            <p className="text-[#94A3B8] text-base max-w-xl leading-relaxed mb-10">
              Built for food manufacturers, processors, and exporters who demand reliability.
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={scrollToForm}
                className="btn-primary px-8 py-4 text-base"
                style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", letterSpacing: "0.12em" }}
              >
                START YOUR REQUEST →
              </button>
              <a
                href="#services"
                className="px-8 py-4 text-base border border-[rgba(16,185,129,0.3)] text-[#10B981] hover:border-[#10B981] hover:bg-[rgba(16,185,129,0.05)] transition-all"
                style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", letterSpacing: "0.12em" }}
              >
                EXPLORE SERVICES
              </a>
            </div>
          </div>
        </div>

        {/* STATS bar */}
        <div className="relative z-10 border-t border-b border-[rgba(16,185,129,0.1)] bg-[#1E293B]">
          <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div
                  style={{ fontFamily: "var(--font-display)", fontSize: "2.2rem", color: "#10B981" }}
                  className="leading-none mb-1"
                >
                  {s.value}
                </div>
                <div className="text-[#94A3B8] text-xs tracking-widest uppercase" style={{ fontFamily: "var(--font-mono)" }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-28 relative">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="flex items-end justify-between mb-16 flex-wrap gap-4">
            <div>
              <span className="text-[#10B981] text-xs tracking-[0.25em] uppercase" style={{ fontFamily: "var(--font-mono)" }}>
                What TASA Covers
              </span>
              <h2
                style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
                className="mt-2 text-[#F0F5F0]"
              >
                OUR SERVICES
              </h2>
            </div>
            <div className="text-[#94A3B8] max-w-sm text-sm leading-relaxed">
              All services are fulfilled through EIAC and ISO certified lab partners. One platform. No fragmented vendors. No compliance gaps.
            </div>
          </div>

          {/* Service cards */}
          <div className="space-y-6">
            {SERVICES.map((s) => (
              <div
                key={s.num}
                className="glow-border card-gradient relative overflow-hidden border border-[rgba(16,185,129,0.12)] p-8 md:p-10 transition-all duration-300"
                style={{ background: "#1E293B" }}
              >
                <span className="number-badge right-6 top-0" style={{ fontSize: "clamp(4rem, 10vw, 8rem)" }}>
                  {s.num}
                </span>

                <div className="relative z-10 flex flex-col md:flex-row md:items-start gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-[#10B981] text-xs tracking-[0.2em]" style={{ fontFamily: "var(--font-mono)" }}>
                        {s.num}
                      </span>
                    </div>
                    <h3
                      style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem, 3vw, 2.5rem)" }}
                      className="text-[#F0F5F0] mb-3"
                    >
                      {s.title}
                    </h3>
                    <p className="text-[#94A3B8] text-base leading-relaxed max-w-lg">
                      {s.desc}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 md:max-w-xs">
                    {s.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-3 py-1 border border-[rgba(16,185,129,0.2)] text-[#94A3B8] rounded-sm"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ background: "#10B981" }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLATFORM / WHY TASA */}
      <section id="platform" className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(16,185,129,0.07) 0%, transparent 70%)" }}
        />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div>
              <span className="text-[#10B981] text-xs tracking-[0.25em] uppercase" style={{ fontFamily: "var(--font-mono)" }}>
                The TASA Advantage
              </span>
              <h2
                style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem, 6vw, 5rem)", lineHeight: "0.95" }}
                className="mt-2 text-[#F0F5F0] mb-6"
              >
                ONE PLATFORM.
                <br />
                <span className="text-[#10B981] glow-text">TOTAL CONTROL.</span>
                <br />
                ZERO GAPS.
              </h2>
              <p className="text-[#94A3B8] text-base leading-relaxed max-w-md mb-8">
                Stop managing labs, chasing certificates, and second-guessing compliance. TASA brings everything under one platform — certified labs, structured workflows, and risk intelligence — so your food safety is proactive, not reactive.
              </p>
              <div className="space-y-4">
                {[
                  "One point of contact for all testing and calibration needs",
                  "EIAC and ISO certified labs — verified, accredited, reliable",
                  "All certificates and reports consolidated in your dashboard",
                  "48-hour average turnaround on standard tests",
                  "Ongoing risk analysis to identify gaps before they become failures",
                  "Platform aggregation delivers 5–20% better value vs. direct lab pricing",
                ].map((step, i) => (
                  <div key={step} className="flex items-start gap-4">
                    <div className="w-7 h-7 border border-[#10B981] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[#10B981] text-xs" style={{ fontFamily: "var(--font-mono)" }}>{i + 1}</span>
                    </div>
                    <span className="text-[#94A3B8] text-sm leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={scrollToForm}
                className="btn-primary mt-10 px-8 py-4 text-base inline-block"
                style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", letterSpacing: "0.12em" }}
              >
                REQUEST A QUOTE →
              </button>
            </div>

            {/* Right — visual */}
            <div className="relative">
              <div className="glow-border border border-[rgba(16,185,129,0.15)] p-10 relative overflow-hidden animate-float"
                style={{ background: "linear-gradient(135deg, #1E293B, #0F172A)" }}>
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full"
                  style={{ background: "radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)" }} />
                <div className="text-center relative z-10">
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "5rem", color: "#10B981", lineHeight: 1 }}
                    className="glow-text">
                    5–20%
                  </div>
                  <div className="text-[#94A3B8] text-sm tracking-widest uppercase mt-2 mb-8" style={{ fontFamily: "var(--font-mono)" }}>
                    Indicative Platform Savings
                  </div>
                  <div className="space-y-3">
                    {[
                      { service: "Food Testing", discount: "Up to 15%" },
                      { service: "Calibration Services", discount: "Up to 20%" },
                      { service: "Combined Services", discount: "Up to 20%" },
                    ].map((item) => (
                      <div key={item.service} className="flex items-center justify-between py-3 border-b border-[rgba(16,185,129,0.1)]">
                        <span className="text-[#94A3B8] text-sm">{item.service}</span>
                        <span className="text-[#10B981] text-sm font-semibold" style={{ fontFamily: "var(--font-mono)" }}>
                          {item.discount}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 text-xs text-[#94A3B8]" style={{ fontFamily: "var(--font-mono)" }}>
                    Based on comparison vs. standard direct-lab pricing. Exact savings confirmed on quote.
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 w-20 h-20 border-b-2 border-r-2 border-[#10B981] opacity-30" />
              <div className="absolute -top-4 -left-4 w-20 h-20 border-t-2 border-l-2 border-[#10B981] opacity-30" />
            </div>
          </div>
        </div>
      </section>

      {/* DASHBOARD SECTION */}
      <section id="dashboard" className="py-28 border-t border-[rgba(16,185,129,0.1)] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{ backgroundImage: "repeating-linear-gradient(0deg, #10B981 0px, #10B981 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, #10B981 0px, #10B981 1px, transparent 1px, transparent 40px)" }} />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <span className="text-[#10B981] text-xs tracking-[0.25em] uppercase" style={{ fontFamily: "var(--font-mono)" }}>
              Coming Soon
            </span>
            <h2
              style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
              className="mt-2 text-[#F0F5F0]"
            >
              MANAGE EVERYTHING<br />IN ONE DASHBOARD
            </h2>
            <p className="text-[#94A3B8] mt-4 text-base max-w-xl mx-auto leading-relaxed">
              Your TASA dashboard gives you a live, centralised view of every sample, order, certificate, and risk insight — from submission to final result, all in one place.
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: (
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <rect x="2" y="2" width="8" height="8" rx="1" stroke="#10B981" strokeWidth="1.5"/>
                    <rect x="12" y="2" width="8" height="8" rx="1" stroke="#10B981" strokeWidth="1.5"/>
                    <rect x="2" y="12" width="8" height="8" rx="1" stroke="#10B981" strokeWidth="1.5"/>
                    <rect x="12" y="12" width="8" height="8" rx="1" stroke="#10B981" strokeWidth="1.5" strokeDasharray="2 2"/>
                  </svg>
                ),
                title: "Sample Tracking",
                desc: "Track every sample from submission to lab receipt to final result. Know exactly where each test stands in real time.",
              },
              {
                icon: (
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <circle cx="11" cy="11" r="9" stroke="#10B981" strokeWidth="1.5"/>
                    <path d="M11 6v5l3 3" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                ),
                title: "Order Status",
                desc: "View live status updates across all active orders — pending, in-progress, or completed — with estimated turnaround times.",
              },
              {
                icon: (
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <path d="M4 2h10l4 4v14H4V2z" stroke="#10B981" strokeWidth="1.5" strokeLinejoin="round"/>
                    <path d="M13 2v5h5" stroke="#10B981" strokeWidth="1.5" strokeLinejoin="round"/>
                    <path d="M7 10h8M7 13h6M7 16h4" stroke="#10B981" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                ),
                title: "Results & Reports",
                desc: "Access, review, and download all test certificates and calibration reports in one organised library. Ready to share with auditors on demand.",
              },
              {
                icon: (
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <path d="M11 2L20 7V15L11 20L2 15V7L11 2Z" stroke="#10B981" strokeWidth="1.5"/>
                    <path d="M11 8v4M11 14v.5" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                ),
                title: "Risk Insights",
                desc: "Receive automated risk flags and advisory notes based on your test history — so you can act on food safety gaps before they escalate.",
              },
              {
                icon: (
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <rect x="2" y="5" width="18" height="14" rx="1.5" stroke="#10B981" strokeWidth="1.5"/>
                    <path d="M6 5V3M16 5V3M2 9h18" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M6 13h4M6 16h2" stroke="#10B981" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                ),
                title: "Multi-Order Management",
                desc: "Manage testing across multiple products, production lines, or facilities — all from a single account with full visibility and control.",
              },
              {
                icon: (
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <path d="M3 17L7 11L11 14L15 8L19 5" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="19" cy="5" r="2" fill="#10B981"/>
                  </svg>
                ),
                title: "Compliance Overview",
                desc: "A live compliance score across all your active tests and calibration schedules — so you always know where you stand.",
              },
            ].map((feature) => (
              <div key={feature.title}
                className="glow-border border border-[rgba(16,185,129,0.12)] p-6 relative"
                style={{ background: "#1E293B" }}>
                <div className="absolute left-0 top-0 bottom-0 w-[2px]" style={{ background: "rgba(16,185,129,0.4)" }} />
                <div className="w-10 h-10 border border-[rgba(16,185,129,0.3)] flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", letterSpacing: "0.05em" }}
                  className="text-[#F0F5F0] mb-2">{feature.title}</h3>
                <p className="text-[#94A3B8] text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* Preview bar */}
          <div className="border border-[rgba(16,185,129,0.15)] px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-4"
            style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.05), rgba(16,185,129,0.02))" }}>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse" />
              <span className="text-[#94A3B8] text-sm" style={{ fontFamily: "var(--font-mono)" }}>
                DASHBOARD IN DEVELOPMENT — Available to all TASA clients at launch
              </span>
            </div>
            <button
              onClick={scrollToForm}
              className="text-[#10B981] text-sm border border-[rgba(16,185,129,0.3)] px-5 py-2 hover:border-[#10B981] hover:bg-[rgba(16,185,129,0.05)] transition-all"
              style={{ fontFamily: "var(--font-display)", letterSpacing: "0.1em" }}
            >
              GET EARLY ACCESS →
            </button>
          </div>
        </div>
      </section>

      {/* GET STARTED FORM */}
      <section id="claim" className="py-28 border-t border-[rgba(16,185,129,0.1)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[#10B981] text-xs tracking-[0.25em] uppercase" style={{ fontFamily: "var(--font-mono)" }}>
              Get Started
            </span>
            <h2
              style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
              className="mt-2 text-[#F0F5F0]"
            >
              REQUEST A QUOTE
            </h2>
            <p className="text-[#94A3B8] mt-4 text-base max-w-lg mx-auto leading-relaxed">
              Submit your requirements and a TASA specialist will respond within 24 hours with a tailored proposal — including EIAC and ISO certified lab options, turnaround times, and transparent platform pricing.
            </p>
            <p className="text-[#94A3B8] mt-2 text-sm max-w-md mx-auto">
              Already working with a lab? Upload your current invoice and we'll provide a like-for-like comparison.
            </p>
          </div>

          <div ref={formRef} className="max-w-3xl mx-auto">
            {submitted ? (
              <div className="glow-border border border-[rgba(16,185,129,0.3)] p-12 text-center"
                style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.06), rgba(16,185,129,0.02))" }}>
                <div className="w-16 h-16 border-2 border-[#10B981] rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <path d="M6 14l6 6 10-12" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "2rem" }} className="text-[#10B981] mb-3">
                  REQUEST RECEIVED
                </h3>
                <p className="text-[#94A3B8] text-base leading-relaxed">
                  Thank you. A TASA specialist will review your requirements and respond within 24 hours with certified lab options and a tailored proposal.
                </p>
                <div className="mt-2 text-xs text-[#94A3B8]" style={{ fontFamily: "var(--font-mono)" }}>
                  ● UNDER REVIEW
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    { label: "Full Name", name: "name", placeholder: "John Doe", type: "text", required: true },
                    { label: "Email Address", name: "email", placeholder: "john@company.com", type: "email", required: true },
                    { label: "Phone Number", name: "phone", placeholder: "+971 50 000 0000", type: "tel", required: true },
                    { label: "Company Name", name: "company", placeholder: "Your Company Ltd.", type: "text", required: true },
                  ].map((field) => (
                    <div key={field.name}>
                      <label className="block text-xs tracking-widest uppercase text-[#94A3B8] mb-2" style={{ fontFamily: "var(--font-mono)" }}>
                        {field.label} {field.required && <span className="text-[#10B981]">*</span>}
                      </label>
                      <input
                        type={field.type}
                        name={field.name}
                        placeholder={field.placeholder}
                        value={(formData as any)[field.name]}
                        onChange={handleInput}
                        required={field.required}
                        className="w-full px-4 py-3 border border-[rgba(16,185,129,0.2)] text-[#F0F5F0] placeholder-[#475569] text-sm transition-all"
                        style={{ background: "#1E293B", fontFamily: "var(--font-body)" }}
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-xs tracking-widest uppercase text-[#94A3B8] mb-2" style={{ fontFamily: "var(--font-mono)" }}>
                    Service Required <span className="text-[#10B981]">*</span>
                  </label>
                  <select
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleInput}
                    required
                    className="w-full px-4 py-3 border border-[rgba(16,185,129,0.2)] text-[#F0F5F0] text-sm transition-all appearance-none"
                    style={{ background: "#1E293B", fontFamily: "var(--font-body)" }}
                  >
                    <option value="" disabled>Select a service...</option>
                    {SERVICE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs tracking-widest uppercase text-[#94A3B8] mb-2" style={{ fontFamily: "var(--font-mono)" }}>
                    Upload Existing Invoice <span className="text-[rgba(16,185,129,0.5)]">(Optional — enables direct comparison)</span>
                  </label>
                  <div
                    className={`upload-zone p-8 text-center cursor-pointer ${dragOver ? "drag-over" : ""}`}
                    style={{ background: "#0F172A" }}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleFileDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    {invoiceFile ? (
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-8 h-8 border border-[#10B981] flex items-center justify-center">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M4 2h6l3 3v9H4V2z" stroke="#10B981" strokeWidth="1.2"/>
                            <path d="M9 2v3h3" stroke="#10B981" strokeWidth="1.2"/>
                          </svg>
                        </div>
                        <div className="text-left">
                          <div className="text-[#F0F5F0] text-sm">{invoiceFile.name}</div>
                          <div className="text-[#94A3B8] text-xs">{(invoiceFile.size / 1024).toFixed(1)} KB</div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setInvoiceFile(null); }}
                          className="ml-4 text-[#94A3B8] hover:text-[#FF4C4C] transition-colors text-lg leading-none"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div className="w-12 h-12 border border-[rgba(16,185,129,0.3)] flex items-center justify-center mx-auto mb-4">
                          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                            <path d="M11 2v13M5 8l6-6 6 6" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M2 17v1a2 2 0 002 2h14a2 2 0 002-2v-1" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                        </div>
                        <p className="text-[#94A3B8] text-sm mb-1">
                          <span className="text-[#10B981]">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-[#475569] text-xs" style={{ fontFamily: "var(--font-mono)" }}>
                          PDF, JPG, PNG, DOC — max 10MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs tracking-widest uppercase text-[#94A3B8] mb-2" style={{ fontFamily: "var(--font-mono)" }}>
                    Tell Us About Your Requirements <span className="text-[rgba(16,185,129,0.5)]">(Optional)</span>
                  </label>
                  <textarea
                    name="message"
                    placeholder="Describe your products, testing scope, volumes, or any specific compliance or certification requirements..."
                    value={formData.message}
                    onChange={handleInput}
                    rows={4}
                    className="w-full px-4 py-3 border border-[rgba(16,185,129,0.2)] text-[#F0F5F0] placeholder-[#475569] text-sm transition-all resize-none"
                    style={{ background: "#1E293B", fontFamily: "var(--font-body)" }}
                  />
                </div>

                {error && (
                  <div className="border border-red-800 bg-red-950/30 px-4 py-3 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full py-5 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", letterSpacing: "0.15em" }}
                >
                  {submitting ? "SENDING..." : "SUBMIT REQUEST →"}
                </button>

                <p className="text-center text-[#475569] text-xs" style={{ fontFamily: "var(--font-mono)" }}>
                  We respond within 24 hours. Your information is kept strictly confidential.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="py-24 border-t border-[rgba(16,185,129,0.1)] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: "repeating-linear-gradient(45deg, #10B981 0px, #10B981 1px, transparent 1px, transparent 40px)",
          }}
        />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-3 gap-12 items-center">
            <div className="md:col-span-2">
              <span className="text-[#10B981] text-xs tracking-[0.25em] uppercase" style={{ fontFamily: "var(--font-mono)" }}>
                About TASA
              </span>
              <h2
                style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 5vw, 4rem)" }}
                className="mt-2 text-[#F0F5F0] mb-6"
              >
                THE PLATFORM BEHIND YOUR FOOD SAFETY
              </h2>
              <p className="text-[#94A3B8] text-base leading-relaxed mb-4">
                TASA is a <span className="text-[#F0F5F0]">Testing as a Service</span> platform that unifies food testing, calibration, risk analysis, and food safety management under one roof. We aggregate a vetted network of <span className="text-[#10B981]">EIAC and ISO certified labs</span> — giving food manufacturers, processors, and exporters a single, reliable system to manage all compliance needs without the complexity of multiple vendor relationships.
              </p>
              <p className="text-[#94A3B8] text-base leading-relaxed mb-6">
                We go beyond test booking. TASA delivers risk analysis and food safety advisory to help you identify vulnerabilities before they lead to compliance failures, product recalls, or reputational damage. Think of us as your long-term food safety partner — always on, always certified.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  "EIAC & ISO certified lab partners only",
                  "Consolidated reporting & certificates",
                  "Risk analysis & food safety advisory",
                  "Single invoice. Multiple services.",
                ].map((point) => (
                  <div key={point} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-[#10B981] rounded-full mt-2 flex-shrink-0" />
                    <span className="text-[#94A3B8] text-sm leading-relaxed">{point}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="glow-border border border-[rgba(16,185,129,0.12)] p-8 text-center"
              style={{ background: "#1E293B" }}>
              <div className="flex items-center justify-center gap-3 mb-2">
                <svg width="44" height="44" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 2L32 10V26L18 34L4 26V10L18 2Z" fill="#0F172A" stroke="#10B981" strokeWidth="1.5"/>
                  <path d="M10 10L26 26" stroke="rgba(16,185,129,0.2)" strokeWidth="0.8" strokeLinecap="round"/>
                  <path d="M10 13H26" stroke="#10B981" strokeWidth="2.2" strokeLinecap="round"/>
                  <path d="M18 13V25" stroke="#10B981" strokeWidth="2.2" strokeLinecap="round"/>
                  <circle cx="10" cy="13" r="1.5" fill="#10B981"/>
                  <circle cx="26" cy="13" r="1.5" fill="#10B981"/>
                  <circle cx="18" cy="25" r="1.5" fill="#10B981"/>
                  <circle cx="18" cy="13" r="0.8" fill="#0F172A"/>
                </svg>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "3rem", color: "#10B981", lineHeight: 1 }}>TASA</span>
              </div>
              <div className="section-divider my-4" />
              <p className="text-[#94A3B8] text-sm leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                EIAC & ISO Certified Labs.<br />One Platform. Full Compliance.<br />Stronger Food Safety.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[rgba(16,185,129,0.1)] py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <svg width="22" height="22" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 2L32 10V26L18 34L4 26V10L18 2Z" fill="#0F172A" stroke="#10B981" strokeWidth="1.5"/>
              <path d="M10 10L26 26" stroke="rgba(16,185,129,0.2)" strokeWidth="0.8" strokeLinecap="round"/>
              <path d="M10 13H26" stroke="#10B981" strokeWidth="2.2" strokeLinecap="round"/>
              <path d="M18 13V25" stroke="#10B981" strokeWidth="2.2" strokeLinecap="round"/>
              <circle cx="10" cy="13" r="1.5" fill="#10B981"/>
              <circle cx="26" cy="13" r="1.5" fill="#10B981"/>
              <circle cx="18" cy="25" r="1.5" fill="#10B981"/>
              <circle cx="18" cy="13" r="0.8" fill="#0F172A"/>
            </svg>
            <span style={{ fontFamily: "var(--font-display)" }} className="text-[#94A3B8] tracking-widest">
              TASA
            </span>
          </div>
          <p className="text-[#475569] text-xs" style={{ fontFamily: "var(--font-mono)" }}>
            © {new Date().getFullYear()} TASA. All rights reserved. | Testing as a Service — EIAC & ISO Certified Labs
          </p>
          <div className="flex gap-6 text-xs text-[#475569]" style={{ fontFamily: "var(--font-mono)" }}>
            <a href="#services" className="hover:text-[#10B981] transition-colors">Services</a>
            <a href="#platform" className="hover:text-[#10B981] transition-colors">Platform</a>
            <a href="#dashboard" className="hover:text-[#10B981] transition-colors">Dashboard</a>
            <a href="#claim" className="hover:text-[#10B981] transition-colors">Get Started</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
