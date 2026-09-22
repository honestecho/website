import { Calendar, Clock, FileText, Landmark, Layers, Shield } from 'lucide-react';

/**
 * The ONE example opportunity the home page tells its story with. FitExplainer
 * ("See why an opportunity fits") reads it; the values mirror HeroPursuitCard's
 * inline readout exactly, so the visitor sees the hero's match explained — not a
 * second, invented example. Keep the two in step if the hero card ever changes.
 * Illustrative values: an example readout, not a live notice.
 */

export const EXAMPLE = {
  title: 'Zero Trust Encryption RFI',
  agency: 'Veterans Affairs, Department Of',
  naicsDescription: 'Other Computer Related Services',
  noticeType: 'Sources Sought',
  score: 73,
  fitLabel: 'Moderate Fit',
};

export const WHY = [
  'NAICS 541519 is one of your primary codes — award-proven match',
  'SDVOSB set-aside matches your certification',
  'Early stage — time to shape the requirement before the RFP',
  '"Encryption" appears in the title',
];

export const WATCH = 'VETERANS AFFAIRS, DEPARTMENT OF is not in your 50 target agencies';

// grid fills row-by-row → order so left col = Posted/Due/Agency, right col = Type/NAICS/Set-Aside
export const DETAILS: { Icon: typeof Calendar; label: string; value: string; accent?: boolean }[] = [
  { Icon: Calendar, label: 'Posted',      value: 'Today' },
  { Icon: FileText, label: 'Notice Type', value: EXAMPLE.noticeType },
  { Icon: Clock,    label: 'Due',         value: 'In 11 days' },
  { Icon: Layers,   label: 'NAICS',       value: '541519 — Other Computer Related Services', accent: true },
  { Icon: Landmark, label: 'Agency',      value: 'VETERANS AFFAIRS, DEPARTMENT OF' },
  { Icon: Shield,   label: 'Set-Aside',   value: 'SDVOSB — Service-Disabled Veteran-Owned …', accent: true },
];
