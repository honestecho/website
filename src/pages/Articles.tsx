import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function Articles() {
  const articles = [
    { title: 'How to decide whether to bid', slug: 'how-to-decide-to-bid', date: 'Oct 12, 2024' },
    { title: 'Sources sought vs RFI', slug: 'rfi-vs-sources-sought', date: 'Oct 05, 2024' },
    { title: 'How to read a solicitation', slug: 'reading-solicitation', date: 'Sep 28, 2024' },
    { title: 'Set-aside rules you must know', slug: 'set-aside-rules', date: 'Sep 15, 2024' },
    { title: 'NAICS codes explained', slug: 'naics-explained', date: 'Sep 02, 2024' },
    { title: 'When to team vs prime', slug: 'teaming-vs-prime', date: 'Aug 20, 2024' }
  ];

  return (
    <>
      <Helmet>
        <title>Insights & Articles | Honest Echo</title>
        <meta name="description" content="GovCon strategies, pipeline management, and technical insights from the Honest Echo team." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-6 py-24 min-h-[70vh]">
        <h1 className="font-headline font-black text-5xl md:text-7xl text-white mb-6">Insights</h1>
        <p className="text-xl text-on-surface-variant max-w-2xl leading-relaxed mb-16">
          High-value intelligence on government contracting, proposal writing, and pipeline management.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Link key={article.slug} to={`/articles/${article.slug}`} className="group block h-full">
              <article className="bg-surface-container-low border border-outline-variant/10 rounded-xl p-8 h-full flex flex-col justify-between hover:border-primary-container/30 transition-all group-hover:bg-surface-container">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-outline text-xs font-label tracking-wide uppercase">Strategy</span>
                    <span className="text-on-surface-variant text-xs">{article.date}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-primary transition-colors leading-snug">{article.title}</h2>
                </div>
                <div className="flex items-center text-primary-container font-bold text-sm mt-8">
                  Read More <ArrowRight className="w-4 h-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"/>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
