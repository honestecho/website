import { prerenderToNodeStream } from 'react-dom/static';
import { StaticRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import type { HelmetServerState } from 'react-helmet-async';
import App from './App';

type HelmetContext = { helmet?: HelmetServerState | null };

// Minimal structural type for the Node Readable returned by
// prerenderToNodeStream — avoids pulling @types/node into the browser tsconfig.
interface NodeReadableLike {
  setEncoding(encoding: string): void;
  on(event: 'data', listener: (chunk: string) => void): void;
  on(event: 'end', listener: () => void): void;
  on(event: 'error', listener: (err: unknown) => void): void;
}

// Async prerender. Unlike renderToString (synchronous, cannot resolve
// React.lazy — it would emit Suspense fallbacks), prerenderToNodeStream waits
// for every Suspense/lazy boundary to settle before resolving, so deep routes
// render their full markup and their per-route <Helmet> head runs. This is what
// lets App.tsx keep client code-splitting AND still produce real static HTML.
export async function render(url: string): Promise<{ html: string; helmetContext: HelmetContext }> {
  const helmetContext: HelmetContext = {};

  const { prelude } = await prerenderToNodeStream(
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </HelmetProvider>
  );

  // prerenderToNodeStream yields a Node Readable at runtime; the bundled types
  // widen it to a web ReadableStream, so narrow it back here.
  const stream = prelude as unknown as NodeReadableLike;
  const html: string = await new Promise((resolve, reject) => {
    let data = '';
    stream.setEncoding('utf-8');
    stream.on('data', (chunk: string) => { data += chunk; });
    stream.on('end', () => resolve(data));
    stream.on('error', reject);
  });

  return { html, helmetContext };
}
