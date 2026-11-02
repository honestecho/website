**Tone & copy: 23/25 · Signup hierarchy: 18/20 · List readability: 13/15 · Typography & rhythm: 13/15 · Mobile: 13/15 · Trust: 9/10**

The remaining tone problem is administrative distance. Repeated classification notes make the page sound like a database export. Visually, the mobile page becomes a long column of similarly weighted text, and the invitation to subscribe lacks enough prominence before that scroll begins.

The closing disclaimer is not the source of the harshness. Keep its wording, including “general information, not legal advice.” Keep the previously revised hero paragraph, list introduction and confirmation wording; another rewrite would add churn.

1. **Make the hero signup action visibly substantial.**

   “Get the free Monday email” still looks like a secondary utility link. It needs to establish the page’s primary action before visitors reach the notices.

   Use `inline-flex min-h-12 items-center justify-center rounded-md border border-cyan-400/60 px-5 text-base font-semibold`. On mobile, use `w-full sm:w-auto`. Keep its anchor pointed directly to the existing signup form and retain the form button as the strongest cyan surface.

2. **Remove the repeated database-field phrasing.**

   The outstanding stilted line is:

   > Notice mentions OT or CSO

   Replace every occurrence with the previously requested:

   > Mentions an OT or CSO

   Render it as secondary context: `text-sm leading-5 text-[#a0b2c8]`, without italics. Its repetition already gives it substantial visual presence; it does not need additional emphasis. Preserve official notice titles and source-derived tags.

3. **Strengthen the mobile row hierarchy.**

   Long titles, agency names, annotations and tags currently form dense blocks. The deadline and “Check fit” need a clearer place to land after that information.

   Use `text-base font-semibold leading-6` for titles, `text-sm leading-5` for agency and annotation, and `mt-3 flex flex-wrap gap-1.5` for tags. Put the existing deadline and action in a bottom group with `mt-4 flex items-end justify-between gap-3`; keep due date and days left stacked together. Give “Check fit” `min-h-11 px-3`. Allow titles to wrap fully.

4. **Make the signup feel like an invitation with readable supporting text.**

   The form’s placement after five rows is fixed; its internal spacing must distinguish it from another notice. Use `p-5 md:p-7`, a `text-xl leading-7 font-semibold` heading, and `mt-2 text-base leading-6` description.

   Stack input and submit button on mobile with `gap-3`; give both `min-h-12` and the input `text-base`. Set confirmation copy to `mt-4 text-base leading-6 md:text-sm`. The current small-print treatment makes helpful confirmation details feel contractual.

5. **Group the list introduction so it stops sounding like consecutive status announcements.**

   The count, update date, refresh sentence and process explanation create a stop-start rhythm. Preserve their approved wording, but present them as two deliberate groups.

   Keep count/date and refresh frequency together in `space-y-1 text-sm leading-6`. Give the process paragraph `mt-3 mb-5 max-w-prose text-base leading-6`. Do not give each sentence its own generous vertical break. The visitor should reach the Type filter without reading a stack of administrative notices.

6. **Correct the inconsistent days-left display.**

   The Nov 30 Yokota notice says “27 days left”; other Nov 30 notices say “28 days left.” That makes deadline accuracy look uncertain.

   Calculate “days left” from calendar dates in the same displayed timezone. With Nov 2 as the reference date, Nov 30 should consistently display **28 days left**. Keep exact deadline times visible and retain the existing removal policy.

SCORE: 89/100.
