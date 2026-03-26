import { Helmet } from 'react-helmet-async';

export default function Consulting() {
  return (
    <>
      <Helmet>
        <title>Consulting | Honest Echo</title>
        <meta name="description" content="GovCon Consulting: Capture strategy, acquisition support, and proposal guidance." />
      </Helmet>
      <div className="relative max-w-7xl mx-auto px-6 py-24 min-h-[70vh] overflow-hidden">
        {/* Crisp grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:48px_48px] z-0"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#00c3ff]/10 via-transparent to-transparent z-0 pointer-events-none blur-3xl w-full h-1/2"></div>
        
        <div className="relative z-10 w-full">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-900/20 border border-blue-700/30 mb-8 animate-fade-in">
             <div className="w-1.5 h-1.5 rounded-full bg-[#00c3ff]"></div>
             <span className="text-sm font-bold text-blue-200 tracking-wide">B2B GovCon Consulting</span>
          </div>
          <h1 className="font-headline font-black text-5xl md:text-7xl text-white mb-16 tracking-tighter">Consulting</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
          <div className="space-y-16">
            <section className="bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-8 shadow-xl">
              <h2 className="text-3xl font-headline font-bold text-white mb-6">What we do</h2>
              <p className="text-[#a0b2c8] text-lg leading-relaxed">
                We provide targeted capture strategy, acquisition support, and proposal guidance. 
                Our approach is deeply rooted in practical experience and proven GovCon workflows.
              </p>
            </section>
            <section className="bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-8 shadow-xl">
              <h2 className="text-3xl font-headline font-bold text-white mb-6">Who we help</h2>
              <p className="text-[#a0b2c8] text-lg leading-relaxed">
                Small to mid-sized businesses looking to mature their BD processes, win complex prime contracts, and stop wasting resources on bad bids.
              </p>
            </section>
          </div>
          <div className="space-y-16">
            <section className="bg-[#0b1120] border border-[#1e2d4a] rounded-2xl p-8 shadow-xl">
              <h2 className="text-3xl font-headline font-bold text-white mb-6">Experience</h2>
              <p className="text-[#a0b2c8] text-lg leading-relaxed">
                Decades of verifiable, on-the-ground experience submitting and winning RFPs, managing pipelines, and orchestrating proposal teams. We are government contractors primarily, not just a software company.
              </p>
            </section>
            <section className="bg-[#00c3ff]/10 border border-[#00c3ff]/30 rounded-2xl p-8 shadow-[0_0_30px_rgba(0,195,255,0.1)]">
              <h2 className="text-3xl font-headline font-bold text-white mb-6">Contact</h2>
              <p className="text-[#a0b2c8] text-lg leading-relaxed mb-8">
                Ready to elevate your strategy? Reach out to start a conversation.
              </p>
              <button className="px-8 py-3 bg-[#00c3ff] text-[#030B17] font-bold rounded-lg hover:bg-white hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#00c3ff]/20">
                Contact Us
              </button>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
