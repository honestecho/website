import { Helmet } from 'react-helmet-async';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function Contact() {
  return (
    <>
      <Helmet>
        <title>Contact Us | Honest Echo</title>
        <meta name="description" content="Get in touch with Honest Echo for GovCon consulting or software tool inquiries." />
      </Helmet>
      
      <div className="max-w-7xl mx-auto px-6 py-24 min-h-[80vh] flex flex-col md:flex-row gap-16">
        {/* Left Side: Info */}
        <div className="w-full md:w-1/3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/20 border border-blue-700/30 mb-6 animate-fade-in">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00c3ff]"></div>
            <span className="text-xs font-bold text-blue-200 tracking-wide">Get in Touch</span>
          </div>

          <h1 className="font-headline font-black text-5xl text-white mb-6 tracking-tight">Let's talk <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00c3ff] to-purple-400">GovCon.</span></h1>
          <p className="text-lg text-[#a0b2c8] mb-12 font-body leading-relaxed">
            Reach out for consulting inquiries, enterprise tool access, or general questions about Honest Echo's pursuit engine.
          </p>
          
          <div className="space-y-8">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-[#0b1120] border border-[#1e2d4a] flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4 text-[#00c3ff]" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm mb-1">Email Us</h4>
                <p className="text-[#a0b2c8] font-body text-sm">hello@honestecho.com</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-[#0b1120] border border-[#1e2d4a] flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4 text-[#00c3ff]" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm mb-1">Call Us</h4>
                <p className="text-[#a0b2c8] font-body text-sm">+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-[#0b1120] border border-[#1e2d4a] flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-[#00c3ff]" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm mb-1">Headquarters</h4>
                <p className="text-[#a0b2c8] font-body text-sm leading-relaxed">100 Innovation Drive<br/>Suite 300<br/>Arlington, VA 22203</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-2/3">
          <form className="bg-[#0b1120] p-8 md:p-12 rounded-2xl border border-[#1e2d4a] shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#00c3ff]/5 to-transparent pointer-events-none"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="firstName" className="block text-xs font-bold text-[#a0b2c8] uppercase tracking-wider mb-2">First Name</label>
                <input type="text" id="firstName" className="w-full bg-[#030B17] border border-[#1e2d4a] rounded-lg px-4 py-3 text-white focus:border-[#00c3ff] focus:ring-1 focus:ring-[#00c3ff] focus:outline-none transition-all placeholder-[#1e2d4a]" placeholder="Jane" />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-xs font-bold text-[#a0b2c8] uppercase tracking-wider mb-2">Last Name</label>
                <input type="text" id="lastName" className="w-full bg-[#030B17] border border-[#1e2d4a] rounded-lg px-4 py-3 text-white focus:border-[#00c3ff] focus:ring-1 focus:ring-[#00c3ff] focus:outline-none transition-all placeholder-[#1e2d4a]" placeholder="Doe" />
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="email" className="block text-xs font-bold text-[#a0b2c8] uppercase tracking-wider mb-2">Work Email</label>
              <input type="email" id="email" className="w-full bg-[#030B17] border border-[#1e2d4a] rounded-lg px-4 py-3 text-white focus:border-[#00c3ff] focus:ring-1 focus:ring-[#00c3ff] focus:outline-none transition-all placeholder-[#1e2d4a]" placeholder="jane@company.com" />
            </div>
            
            <div className="mb-8">
              <label htmlFor="message" className="block text-xs font-bold text-[#a0b2c8] uppercase tracking-wider mb-2">Message</label>
              <textarea id="message" rows={5} className="w-full bg-[#030B17] border border-[#1e2d4a] rounded-lg px-4 py-3 text-white focus:border-[#00c3ff] focus:ring-1 focus:ring-[#00c3ff] focus:outline-none transition-all placeholder-[#1e2d4a]" placeholder="How can we help your team win?"></textarea>
            </div>
            
            <button type="button" className="w-full py-4 bg-[#00c3ff] text-[#030B17] font-bold rounded-lg hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(0,195,255,0.2)]">
              Send Message <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
