### Score breakdown

- Hierarchy & focal point: 16/20
- Result-card scannability: 16/20
- Typography & rhythm: 12/15
- Composition, alignment & consistency: 12/15
- Mobile translation: 6/10
- Trust & restraint: 9/10
- Copy: 8/10

This is still well below the 95 bar. The decisive failure is State B on mobile: the company-profile panel consumes the entire first viewport and continues below it. An email visitor sees no actual match and no claim action. “Check another company” is effectively the page’s first actionable link—the opposite of the intended journey.

Desktop cards are readable, but the giant `80/100` still competes with the deadline, while the set-aside and NAICS are compressed into one metadata sentence. The page presents a score faster than it presents the practical bid/no-bid facts.

### Top 6 fixes

1. **Put the matches before the company profile on mobile.** Preserve the desktop sidebar, but change the DOM/CSS order:

   - Results: `order-1 min-w-0 lg:order-2`
   - Profile: `order-2 mt-6 lg:order-1 lg:mt-0`
   - Grid: `grid gap-6 lg:grid-cols-[26rem_minmax(0,1fr)]`

   Keep the profile data intact. It belongs below the matches and claim block on mobile. The first pick—not a reference panel—must begin in the first viewport.

2. **Turn the card metadata into labeled decision fields.** Replace the running metadata sentence with:

   `grid gap-3 border-y border-[#1e2d4a] py-4 sm:grid-cols-[11rem_minmax(0,1fr)_7rem]`

   Use `DEADLINE`, `COMPETITION`, and `NAICS` as small labels. Set “Oct 15” to `text-base font-semibold text-white`; keep the set-aside and code `text-sm leading-5 text-[#a0b2c8]`. “Responses due Oct 15” buried beside two other facts is not five-second scanning.

3. **Demote the fit score.** Change `80` from roughly `text-3xl` to `text-2xl`, keep `/ 100` at `text-sm`, and use:

   `shrink-0 text-left md:text-right`

   On mobile, place it inline beneath the status label instead of reserving a pseudo-dashboard column. The deadline and disqualifying conditions matter more than an unexplained scoring model.

4. **Make the claim block visually conclusive.** Immediately after the near-miss, use:

   `mt-6 rounded-lg border-2 border-[#00c3ff] bg-[#0b1120] p-5 sm:p-6`

   Button:

   `mt-4 min-h-12 w-full rounded-md bg-[#00c3ff] px-5 font-semibold text-[#030b17] sm:w-auto`

   Keep the current CTA label. Rewrite the setup as: “Keep these matches and score new SAM.gov notices as they post. Your profile is already filled in from the SBA data above. Create a free account; no card.”

5. **Shorten the landing explanation and move the form upward.** Replace it with:

   “Enter your company name or UEI. We check your public SBA profile against open SAM.gov notices with at least a week left to respond. You’ll get the three worth pursuing, plus one that looks right and isn’t—with the reasons for each.”

   This removes the mechanical, clause-heavy phrasing and saves roughly one mobile line.

6. **Give the near-miss a different reading pattern.** Use `border-dashed opacity-90`, keep `LOOKS RIGHT — ISN’T` prominent, and place “Why we’d skip it” plus its reason directly beneath the title, before secondary agency metadata. The disqualifying reason is the product value; it should not read like the fourth ordinary result.

SCORE: 79/100
