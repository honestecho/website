import { Helmet } from 'react-helmet-async';

export default function About() {
  return (
    <>
      <Helmet>
        <title>About Us | Honest Echo</title>
        <meta name="description" content="Learn about Honest Echo and our mission to provide sovereign intelligence for GovCon small businesses." />
      </Helmet>
      
      <div className="max-w-4xl mx-auto px-6 py-24 min-h-[70vh]">
        <h1 className="font-headline font-black text-5xl md:text-6xl text-white mb-10">About Honest Echo</h1>
        <div className="prose prose-invert prose-lg max-w-none">
          <p className="text-on-surface-variant text-xl leading-relaxed mb-8">
            Honest Echo was built out of necessity. We are a team of experienced government contractors who grew frustrated with generic CRM tools that did nothing to help us actually win business.
          </p>
          <h2 className="text-white text-3xl font-bold mb-6 mt-12">Our Mission</h2>
          <p className="text-on-surface-variant text-lg leading-relaxed mb-8">
            Our mission is to arm small and mid-sized contractors with sovereign intelligence. We build systems that enforce discipline in the pursuit phase, ensuring that when you bid, your probability of win justifies the effort expended.
          </p>
          <div className="bg-surface-container p-8 rounded-xl border border-outline-variant/10 my-12">
            <blockquote className="text-2xl font-headline font-bold text-white italic border-l-4 border-primary-container pl-6">
              "Most tools track opportunities. We help you decide whether to pursue them."
            </blockquote>
          </div>
          <h2 className="text-white text-3xl font-bold mb-6 mt-12">The Team</h2>
          <p className="text-on-surface-variant text-lg leading-relaxed mb-8">
            Founded by capture managers, proposal writers, and systems engineers who have successfully won and executed hundreds of millions in federal contracts. 
          </p>
        </div>
      </div>
    </>
  );
}
