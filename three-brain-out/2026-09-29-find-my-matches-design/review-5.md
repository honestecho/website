### Score breakdown

- Hierarchy & focal point: 19/20
- Result-card scannability: 18/20
- Typography & rhythm: 14/15
- Composition, alignment & consistency: 14/15
- Mobile translation: 9/10
- Trust & restraint: 10/10
- Copy: 9/10

The desktop states now have clear primary actions. The remaining failure is mobile result comprehension: the first screen shows who can bid, but not a single reason the opportunity was selected. The sticky CTA also consumes too much of the smallest viewport and wraps poorly.

### Top 6 fixes

1. **Surface “Why it fits” earlier on mobile.** After the deadline/fit-score row, show the existing reasons before `NAICS` and `WHO CAN BID`. Preserve the desktop order:

   `reasons: order-3 md:order-4`  
   `eligibility: order-4 md:order-3`

   This gets pick, agency, deadline, and rationale into the initial scan without dropping data.

2. **Stop giving “Check another company” its own prominent band.** It currently competes with the result and adds roughly 60 pixels before card one. Keep it inside the matched-company strip:

   `mt-2 inline-block text-sm text-[#a0b2c8] underline decoration-[#51657f] underline-offset-4`

   Remove its separate top/bottom spacing and divider. The company identity—not the escape link—should dominate that block.

3. **Reduce and rebalance the mobile sticky CTA.** The awkward “already / filled in” wrap makes the bar feel unfinished. Use:

   `py-3`  
   `min-h-[64px]`  
   `text-[15px] leading-5 text-left text-balance pr-10`  
   arrow: `absolute right-5 top-1/2 -translate-y-1/2`

   Add `pb-24 md:pb-20` to the results container so the fixed bar never covers the final card or profile details.

4. **Remove the desktop CTA’s repeated “already filled in.”** The support line and button currently say the same thing side by side. Change the support line to:

   “Keep these matches and score new SAM.gov notices. Free account; no card.”

   Keep the button text unchanged. This states the benefit instead of echoing the button.

5. **Make the near-miss read as a ruled-out result immediately.** Put the existing “Why we’d skip it” reason before the long notice title on mobile and give the panel a restrained exclusion treatment:

   `border-l-2 border-l-[#a0b2c8] bg-[#080f1d]`

   Do not use cyan for the near-miss label; cyan currently means positive selection and action.

6. **Correct the overbroad lower-page copy.** “Every open federal notice on SAM.gov” contradicts the stated one-week filter. Replace the entire “What we check” paragraph with:

   “SAM.gov notices with at least a week left: the work, set-aside, NAICS code, required vehicles, and response deadline.”

   Also replace the form helper with the more direct:

   “We use SBA’s Small Business Search. Enter your 12-character UEI to match the exact company.”

SCORE: 93/100
