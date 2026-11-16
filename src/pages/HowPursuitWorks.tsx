import { useState } from 'react';
import type { ElementType, ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, ClipboardList, Database, Eye, FileText, TriangleAlert, User, X } from 'lucide-react';
import { track } from '../lib/analytics';
import './HowPursuitWorks.css';

// Same destination as the home hero's "Find My Opportunities — Free".
const DISCOVERY_TO = '/signup/?promo=fall2026';

// Every label, question and outcome below is the product's own wording, so the page
// cannot drift into describing a Pursuit that does not exist. Sources, in HE-Pursuit
// dashboard/src/components/pursuit-v2: JourneyV2.tsx (PHASES), Phase1TriageV2.tsx
// (TRIAGE_META), Phase2EligibilityV2.tsx (answers, VERDICT_CONFIG), Phase3AlignmentV2.tsx,
// Phase4ViabilityV2.tsx, Phase5DecisionV2.tsx (CALLS), HandoffV2.tsx; and
// dashboard/src/lib/phaseDeliverables.ts for the outputs.
type PhaseId = 1 | 2 | 3 | 4 | 5;
const PHASES: { id: PhaseId; label: string; question: string; summary: string; output: string; rows: [string, string][] }[] = [
  {
    id: 1, label: 'Triage', question: 'Should we keep going?', output: 'Solicitation Analysis',
    summary: 'A quick read of the notice, then one call: keep going, watch it, or pass.',
    rows: [
      ['Continue', 'Eligibility opens'],
      ['Continue with Caution', 'Eligibility opens · open questions carried'],
      ['Watch', 'Parked — monitoring for the solicitation'],
      ['No-Bid', 'Pursuit closed at triage'],
    ],
  },
  {
    id: 2, label: 'Eligibility', question: 'Can we actually bid this?', output: 'Compliance Matrix',
    summary: 'Answer a few questions about your company to get a bid recommendation.',
    rows: [
      ['Your answers', 'Meet now · Can meet before award · Use a partner · Cannot meet · Investigate · N/A'],
      ['Bid recommendation', 'Eligible · Eligible with risks to review · Eligible with a partner · Not eligible'],
      ['Disqualifying issue', 'The pursuit goes straight to Decision. A Go is not available unless that answer changes.'],
    ],
  },
  {
    id: 3, label: 'Alignment', question: 'Is this strategically worth pursuing?', output: 'Alignment Assessment',
    summary: 'We scored how well this fits your company. Check each reason and say whether you agree.',
    rows: [
      ['Each reason', 'Looks right · Challenge it'],
      ['Growth call', 'Core focus · Useful expansion · Outside our focus'],
    ],
  },
  {
    id: 4, label: 'Viability', question: 'What will it take to win?', output: 'Capture Plan',
    summary: 'Four judgment calls: can we win it, bid it, deliver it, and is it worth it.',
    rows: [
      ['Competitive position', 'Do we have a credible path to winning against likely competition?'],
      ['Pursuit effort', 'Can we submit a competitive proposal on time with the people and budget available?'],
      ['Delivery readiness', 'Can we staff, start, and sustain the work if we win?'],
      ['Commercial value', 'Does the expected return justify the pursuit costs and delivery risks?'],
    ],
  },
  {
    id: 5, label: 'Decision', question: 'Go or No-Go?', output: 'Decision Summary',
    summary: 'Pursuit recommends Go, Conditional Go or No-Go from your answers. You record Go — We Bid or No-Go — We Pass.',
    rows: [
      ['Go — We Bid', 'Commit to the pursuit and open the compliance handoff.'],
      ['No-Go — We Pass', 'Close the pursuit with the reason on record.'],
      ['After a Go', 'Bid Handoff'],
      ['After a No-Go', 'No-Go Decision Record'],
    ],
  },
];

// Threads are horizontal and vertical runs joined by quarter-circle bends, drawn on the
// map's 1232 x 520 canvas. A waypoint list in, an SVG path (M, H, V, A only) out.
type Pt = [number, number];
function threadPath(points: Pt[], radius = 12): string {
  const pts = points.map(p => [...p] as Pt);
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const next = pts[i + 1];
    const horizontal = y0 === y1;
    if (!next) { d += horizontal ? ` H${x1}` : ` V${y1}`; break; }
    const r = Math.min(radius, Math.abs(horizontal ? x1 - x0 : y1 - y0) / 2, Math.abs(horizontal ? next[1] - y1 : next[0] - x1) / 2);
    if (horizontal) {
      const sx = Math.sign(x1 - x0), sy = Math.sign(next[1] - y1);
      d += ` H${x1 - sx * r} A${r} ${r} 0 0 ${sx * sy > 0 ? 1 : 0} ${x1} ${y1 + sy * r}`;
      pts[i] = [x1, y1 + sy * r];
    } else {
      const sy = Math.sign(y1 - y0), sx = Math.sign(next[0] - x1);
      d += ` V${y1 - sy * r} A${r} ${r} 0 0 ${sx * sy > 0 ? 0 : 1} ${x1 + sx * r} ${y1}`;
      pts[i] = [x1 + sx * r, y1];
    }
  }
  return d;
}

// `bid` marks the one highlighted route: a notice that ends in a bid. `joins` means the
// thread's last point lands on another thread, so it gets no end dot.
const THREADS: { pts: Pt[]; bid?: boolean; joins?: boolean }[] = [
  { bid: true, pts: [[254, 139], [302, 139], [302, 25], [314, 25]] },        // SAM.gov notices → Triage
  { bid: true, pts: [[568, 89], [634, 89], [634, 49], [664, 49]] },          // Continue → Eligibility
  { bid: true, pts: [[882, 49], [978, 49]] },                                // Eligibility → Alignment
  { bid: true, pts: [[1087, 88], [1087, 130]] },                             // Alignment → Viability
  { bid: true, pts: [[978, 169], [773, 169], [773, 250]] },                  // Viability → Decision
  { bid: true, pts: [[882, 339], [978, 339]] },                              // Go → Bid Handoff
  { joins: true, pts: [[254, 238], [302, 238], [302, 120]] },                // Your profile joins the trunk
  // Caution also opens Eligibility: it joins Continue's run inside the tray, clear of the shortcut below.
  { joins: true, pts: [[568, 188], [586, 188], [586, 89]] },
  // A disqualifying issue skips Alignment and Viability and lands on No-Go, the only call left.
  { pts: [[676, 88], [676, 112], [616, 112], [616, 438], [664, 438]] },
  { pts: [[882, 438], [978, 438]] },                                         // No-Go → Decision Record
];

function Tab({ children }: { children: ReactNode }) {
  return <span className="fm-tab font-headline" data-tab aria-hidden="true">{children}</span>;
}

function Card({ at, Icon, title, sub, route }: { at: string; Icon: ElementType; title: string; sub: string; route?: boolean }) {
  return (
    <div className={`fm-node fm-at-${at}${route ? ' fm-on-route' : ''}`} data-node>
      <Tab><Icon strokeWidth={2.25} /></Tab>
      <span className="fm-t fm-title font-headline">{title}</span>
      <span className="fm-s">{sub}</span>
    </div>
  );
}

export default function HowPursuitWorks() {
  const [selected, setSelected] = useState<PhaseId>(1);
  const phase = PHASES[selected - 1];
  const select = (id: PhaseId) => {
    setSelected(id);
    track('how_pursuit_works_phase_selected', { phase: id });
  };

  const phaseCard = (id: PhaseId, at: string) => {
    const p = PHASES[id - 1];
    return (
      <button type="button" className={`fm-node fm-on-route fm-at-${at}`} data-node aria-pressed={selected === id} onClick={() => select(id)}>
        <Tab>{id}</Tab>
        <span className="fm-t fm-title font-headline">{p.label}</span>
        <span className="fm-s">{p.output}</span>
      </button>
    );
  };
  const phaseTray = (id: PhaseId, at: string, note?: string) => (
    <div className={`fm-tray fm-at-${at}`} data-tray data-selected={selected === id}>
      <button type="button" className="fm-head fm-title fm-label font-headline" aria-pressed={selected === id} onClick={() => select(id)}>
        <Tab>{id}</Tab>
        {PHASES[id - 1].label}
        {note && <span className="fm-headnote font-body">{note}</span>}
      </button>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>How Pursuit Works: From SAM.gov Notice to Go or No-Go — HE Pursuit</title>
        <meta name="description" content="The five phases Pursuit uses to take a SAM.gov notice toward a recorded Go or No-Go: Triage, Eligibility, Alignment, Viability and Decision, with the question each one answers and where a pursuit can stop." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://honestecho.com/how-pursuit-works" />
        <meta property="og:title" content="How Pursuit Works: From SAM.gov Notice to Go or No-Go — HE Pursuit" />
        <meta property="og:description" content="Five phases, one question each. A pursuit can stop at Triage; one that goes on ends in a recorded Go or No-Go, and a Go opens the Bid Handoff." />
        <meta property="og:image" content="https://honestecho.com/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="How Pursuit Works: From SAM.gov Notice to Go or No-Go — HE Pursuit" />
        <meta name="twitter:description" content="Five phases, one question each. A pursuit can stop at Triage; one that goes on ends in a recorded Go or No-Go, and a Go opens the Bid Handoff." />
        <meta name="twitter:image" content="https://honestecho.com/og-image.jpg" />
      </Helmet>

      {/* Hero, kept short so the map starts inside the first screen */}
      <section className="pt-14 lg:pt-16 pb-8 px-6 relative overflow-hidden">
        <div className="max-w-[1232px] mx-auto relative z-10">
          <h1 className="font-headline font-black text-4xl md:text-5xl xl:text-6xl text-white mb-4 tracking-tighter leading-tight drop-shadow-2xl">
            From opportunity to a clear decision.
          </h1>
          <p className="text-[#a0b2c8] text-lg leading-relaxed font-body max-w-3xl">
            Pursuit matches SAM.gov notices to your company profile. Five phases help you decide whether to bid, with options to park or close at Triage. Pursuit recommends a decision; you record the call. A Go opens the Bid Handoff.
          </p>
        </div>
      </section>

      <section className="px-4 sm:px-6 pb-24">
        <div className="fm font-body max-w-[1328px] mx-auto">
          {/* ── 1024px and up: the map ─────────────────────────────────────── */}
          <div className="hidden lg:block">
            <div className="fm-controls px-6 min-[1376px]:px-12 pt-6">
              <div className="fm-stepper" role="group" aria-label="Phases">
                {PHASES.map(p => (
                  <button key={p.id} type="button" className="fm-step" aria-pressed={selected === p.id} onClick={() => select(p.id)}>
                    <b className="font-headline">{p.id}</b> {p.label}
                  </button>
                ))}
              </div>
              <Link to={DISCOVERY_TO} onClick={() => track('how_pursuit_works_cta_clicked')} className="fm-cta font-headline">
                Find My Opportunities — Free
                <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
              </Link>
            </div>

            <p className="fm-legend px-6 min-[1376px]:px-12">
              <span className="fm-legend-line" aria-hidden="true"></span>
              Highlighted path: Continue to Go — We Bid
            </p>

            {/* The map is 1232px wide. The panel only has room for side padding from 1376px up; below 1280px it scrolls sideways. */}
            <div className="fm-scroll min-[1376px]:px-12 pt-3 pb-8">
              <div className="fm-map" role="group" aria-label="How a notice moves through Pursuit, from its sources to a recorded Go or No-Go">
                <svg className="fm-threads" viewBox="0 0 1232 520" aria-hidden="true">
                  {THREADS.map((t, i) => {
                    const first = t.pts[0], last = t.pts[t.pts.length - 1];
                    const focus = t.bid ? { 'data-path': 'focus', 'data-route': 'bid' } : {};
                    return (
                      <g key={i}>
                        <path data-thread="" {...focus} d={threadPath(t.pts)} />
                        <circle cx={first[0]} cy={first[1]} r={2.75} {...focus} />
                        {!t.joins && <circle cx={last[0]} cy={last[1]} r={2.75} {...focus} />}
                      </g>
                    );
                  })}
                </svg>

                <div className="fm-tray fm-at-sources" data-tray>
                  <div className="fm-head fm-title fm-label font-headline"><Tab><Database strokeWidth={2.25} /></Tab>Sources</div>
                </div>
                <Card at="sam" Icon={Database} title="SAM.gov notices" sub="Matched to your profile" route />
                <Card at="profile" Icon={User} title="Your profile" sub="Your capabilities" />

                {phaseTray(1, 'triage')}
                <Card at="continue" Icon={ArrowRight} title="Continue" sub="Opens Eligibility" route />
                <Card at="caution" Icon={TriangleAlert} title="Caution" sub="Carries open questions" />
                <Card at="watch" Icon={Eye} title="Watch" sub="Parked for monitoring" />
                <Card at="nobid" Icon={X} title="No-Bid" sub="Closed at triage" />

                {phaseCard(2, 'eligibility')}
                {phaseCard(3, 'alignment')}
                {phaseCard(4, 'viability')}
                <p className="fm-linelabel">Disqualifying issue<br />Go not available</p>

                {phaseTray(5, 'decision', 'You record the call')}
                <Card at="go" Icon={Check} title="Go — We Bid" sub="Opens Bid Handoff" route />
                <Card at="nogo" Icon={X} title="No-Go — We Pass" sub="Records your reason" />

                <div className="fm-tray fm-at-after" data-tray>
                  <div className="fm-head fm-title fm-label font-headline"><Tab><ClipboardList strokeWidth={2.25} /></Tab>After the decision</div>
                </div>
                <Card at="handoff" Icon={ClipboardList} title="Bid Handoff" sub="For proposal planning" route />
                <Card at="record" Icon={FileText} title="Decision Record" sub="Why you passed" />
              </div>
            </div>

            <div className="fm-panes px-6 min-[1376px]:px-12 pb-8 min-[1376px]:pb-12">
              <div className="fm-pane fm-pane-left" aria-live="polite">
                <div className="flex items-center gap-3.5">
                  <span className="fm-sq"><FileText aria-hidden="true" /></span>
                  <h2 className="fm-title fm-ptitle font-headline">{phase.label}</h2>
                  <span className="fm-cap">Phase {phase.id} of 5</span>
                </div>
                <p className="fm-title fm-label font-headline mt-5">{phase.question}</p>
                <p className="mt-2 max-w-xl">{phase.summary}</p>
                <dl className="fm-rows mt-6 max-w-3xl">
                  {phase.rows.map(([k, v]) => (
                    <div key={k} className="contents"><dt>{k}</dt><dd>{v}</dd></div>
                  ))}
                  <div className="contents"><dt>Output</dt><dd>{phase.output}</dd></div>
                </dl>
              </div>
              <div className="fm-pane fm-pane-right">
                <div className="flex items-center gap-3.5">
                  <span className="fm-sq"><ClipboardList aria-hidden="true" /></span>
                  <h2 className="fm-title fm-ptitle font-headline">Phase Outputs</h2>
                </div>
                <table className="fm-table mt-7">
                  <thead>
                    <tr><th scope="col">Phase</th><th scope="col">Question it answers</th><th scope="col">Output</th></tr>
                  </thead>
                  <tbody>
                    {PHASES.map(p => (
                      <tr key={p.id} data-selected={selected === p.id}><td>{p.label}</td><td>{p.question}</td><td>{p.output}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ── under 1024px: the same phases as a stack ───────────────────── */}
          <div className="lg:hidden p-5 relative">
            {/* The action leads on a phone, so it shows without scrolling. */}
            <Link to={DISCOVERY_TO} onClick={() => track('how_pursuit_works_cta_clicked')} className="fm-cta fm-cta-phone font-headline mb-5">
              Find My Opportunities — Free
            </Link>
            <div className="fm-stack-card mb-4" data-node>
              <Tab><Database strokeWidth={2.25} /></Tab>
              <h2 className="fm-title fm-label fm-stack-title font-headline">Sources</h2>
              <dl className="fm-groups fm-groups-2col mt-3">
                <div><dt>SAM.gov notices</dt><dd>Matched to your profile</dd></div>
                <div><dt>Your profile</dt><dd>Your capabilities</dd></div>
              </dl>
            </div>
            <ol className="grid gap-4">
              {PHASES.map(p => (
                <li key={p.id} className="fm-stack-card" data-node>
                  <Tab>{p.id}</Tab>
                  <h2 className="fm-title fm-label fm-stack-title font-headline">{p.label}</h2>
                  <p className="fm-title mt-2">{p.question}</p>
                  <p className="mt-2">{p.summary}</p>
                  <dl className="fm-groups mt-4">
                    {p.rows.map(([k, v]) => (
                      <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
                    ))}
                    <div className="fm-group-output"><dt>Output</dt><dd>{p.output}</dd></div>
                  </dl>
                </li>
              ))}
            </ol>
            {/* and again once the phases have been read */}
            <Link to={DISCOVERY_TO} onClick={() => track('how_pursuit_works_cta_clicked')} className="fm-cta fm-cta-phone font-headline mt-6">
              Find My Opportunities — Free
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
