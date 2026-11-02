The page still makes the Monday email feel secondary to a generic product signup. The remaining tone problem is administrative compression: fragments, provenance labels and caveats crowd the helpful explanation. Desktop scanning remains dense; mobile magnifies that density into a long succession of small text blocks.

Tone & copy: **21/25** · Signup hierarchy: **14/20** · List readability: **11/15** · Typography & rhythm: **11/15** · Mobile: **11/15** · Trust: **8/10**

1. **Make the existing primary CTA lead to the Monday signup.**

   “Start free” suggests creating a product account. That is a different commitment from receiving a free weekly email.

   Change the header CTA to **“Get the Monday email”**, linking to the existing form. Change the footer’s “Start Free →” to **“Get the Monday email →”** on this page.

   In the introduction, make the existing words **“free Monday email”** an anchor to the form. Keep the signup after row five.

2. **Replace the list preamble’s compressed housekeeping with readable guidance.**

   “List updated Nov 2, about once a week” is grammatically awkward. “Tags use the notice’s wording” sounds mechanical. The eligibility instruction and coverage caveat then arrive as a stack of conditions.

   Put this on its own metadata line:

   > 26 notices · Updated Nov 2 · Updated about once a week

   Replace the remaining helper text with:

   > We read each notice before adding it here and use its wording for the tags. You’ll find eligibility and submission details in the notice’s documents and any linked consortium portal. This list covers public SAM.gov notices; opportunities available only through member portals aren’t included.

   Use `text-sm leading-6 text-[#a0b2c8]`, with `mt-2` between metadata and explanation.

3. **Remove the repeated database voice from notice rows.**

   “Found in notice text” sounds like an extraction status, and its placement makes it look like part of the agency or office name.

   Replace each occurrence with:

   > OT/CSO mentioned in notice

   Place that existing annotation below the agency line using `text-xs leading-5`. Keep agency and office together. The annotation should explain why the notice appears here without interrupting identification of the buyer.

   Keep desktop deadlines in `w-40 shrink-0`, with a consistent divider and alignment. Give titles `text-base leading-6 font-semibold`, agency text `text-sm leading-5`, tags `text-xs`, and rows `py-5`.

4. **Give the signup a stronger typographic interruption.**

   The panel’s border alone does too much of the work. Its heading and supporting text remain too close to the surrounding list’s scale.

   Use `border-cyan-400/50 bg-[#0a1c2d] p-6 md:p-8`. Set the heading to `text-2xl leading-8 font-semibold`, supporting copy to `text-base leading-6`, and confirmation copy to `text-xs leading-5`.

   Keep **“Send me the Monday list.”** Keep the existing signup description and confirmation wording; the remaining problem there is presentation.

5. **Make mobile rows easier to finish reading and act on.**

   Long titles, tags and deadline details accumulate without enough breathing room. Use `gap-3` between the title/agency block and tags, then `mt-4` before the deadline/action area.

   Give “Check fit” `min-h-11 px-4`. Keep the stacked signup field and button, both `min-h-12 w-full`. Allow filter controls to wrap with `gap-2`; avoid shrinking their labels to fit.

6. **Finish the sentence-level cleanup without adding more reassurance.**

   The OT card still opens with a fragment:

   > An OT is a flexible agreement outside the usual contract, grant or cooperative agreement process. Most FAR rules don’t apply, and the terms are negotiated.

   Keep the required closing disclaimer in its existing location, at `text-xs leading-5`. Its current wording needs no further legal padding.

SCORE: 76/100.
