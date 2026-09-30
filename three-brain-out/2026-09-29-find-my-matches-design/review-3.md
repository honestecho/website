### Score breakdown

- Hierarchy & focal point: 17/20
- Result-card scannability: 18/20
- Typography & rhythm: 13/15
- Composition, alignment & consistency: 13/15
- Mobile translation: 8/10
- Trust & restraint: 9/10
- Copy: 8/10

State B’s mobile ordering is corrected, but conversion is still structurally slow: three tall result cards plus the near-miss put the claim CTA several screens away. The first card communicates the decision inputs, yet its score still outranks the deadline visually. “Check another company” is also the only cyan action near the results heading, giving the escape route more prominence than it deserves.

### Top 6 fixes

1. **Compress the mobile results without hiding information.** Each card is nearly a viewport tall. Put deadline and NAICS on one row, with eligibility spanning the next:

   `grid grid-cols-2 gap-x-4 gap-y-4 border-y border-[#1e2d4a] py-4`

   Give the eligibility field `col-span-2`. Use `space-y-2` for the reasons and `text-sm leading-5`. This materially shortens the route to the near-miss and claim block while retaining every required field.

2. **Stop making “Check another company” the results header’s focal action.** Change it from cyan to:

   `text-sm font-medium text-[#a0b2c8] underline underline-offset-4 hover:text-[#00c3ff]`

   On mobile, add `mt-2`; on desktop, keep it right-aligned. It is a utility exit, not the next step for an email visitor.

3. **Make the deadline more important than the unexplained score.** Set the score to `text-xl font-semibold`; set the deadline value to `text-xl font-bold text-white`. Use `text-[#a0b2c8]` for `/ 100`. The current `80` still wins the scan despite “Oct 15” being the operational decision.

4. **Replace internal-sounding metadata labels with contractor language.**

   - `RESPONSES DUE` → `DEADLINE`
   - `COMPETITION` → `WHO CAN BID`
   - `PROFILE FIT` → `FIT SCORE`
   - `COMPANY PROFILE USED FOR THIS MATCH` → `PROFILE WE MATCHED`

   These are chrome changes only; retain every underlying value exactly.

5. **Clarify why three are shown when the count says sixteen.** Replace:

   “16 strong matches and 30 worth a look in 5,059 open notices.”

   With:

   “Your top 3 of 16 strong matches, from 5,059 open notices. Another 30 are worth a look.”

   The current line makes “The 3 worth pursuing” look inconsistent with the result count.

6. **Tighten the mobile landing hero so the secondary path begins sooner.** Use `text-base leading-6` for the explanatory paragraph below `sm`, reduce the title-to-copy gap to `mt-4`, and the copy-to-form gap to `mt-7`. Keep `sm:text-lg sm:leading-7`. The primary CTA is visible, but the upload path feels buried rather than deliberately secondary.

SCORE: 86/100
