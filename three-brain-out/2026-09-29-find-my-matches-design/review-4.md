### Score breakdown

- Hierarchy & focal point: 17/20
- Result-card scannability: 18/20
- Typography & rhythm: 13/15
- Composition, alignment & consistency: 14/15
- Mobile translation: 8/10
- Trust & restraint: 9/10
- Copy: 9/10

The landing state now has an obvious action. The result state does not: in both screenshots, the only visible action is “Check another company,” while the conversion CTA remains several screens below. Mobile also withholds the matched company identity, forcing an email visitor to trust results before confirming that the correct business was scored.

### Top 6 fixes

1. **Keep the one claim CTA visible while results are reviewed.** Move the existing claim block into a restrained sticky footer; do not duplicate it:

   `sticky bottom-0 z-30 border-t border-[#1e2d4a] bg-[#030B17]/95 px-4 py-3 backdrop-blur`

   On mobile, use only the existing button copy in the sticky treatment. Keep the supporting two sentences in its current end-of-results position. On desktop, constrain it with `max-w-7xl mx-auto`. Right now the page’s conversion action is functionally absent.

2. **Confirm the matched company before the first mobile result.** Reorder the existing profile content responsively. Show this compact identity strip beneath the result timestamp:

   `PROFILE WE MATCHED`  
   `HEALTH FACILITY SOLUTIONS COMPANY · San Antonio, TX`

   Use `md:hidden border-y border-[#1e2d4a] py-3 mt-4`. Move the remaining mobile profile fields below the near-miss; do not duplicate or remove them. An outreach recipient must be able to verify the match immediately.

3. **Put deadline before fit score in the mobile scan path.** Move fit score out of its standalone row and make the first facts row:

   `grid grid-cols-2 gap-4 border-y border-[#1e2d4a] py-4`

   Left: `DEADLINE / Oct 15`. Right: `FIT SCORE / 80 / 100`. Put `NAICS` beside or above the full-width `WHO CAN BID` row below. The current card still asks readers to interpret an unexplained score before seeing the operational deadline.

4. **Remove another 60–80 pixels from every mobile card.** Use:

   `p-5 space-y-4`  
   title: `text-lg leading-[1.3]`  
   agency: `text-xs leading-4 tracking-[0.04em]`  
   reasons: `space-y-2 text-sm leading-5`  
   SAM.gov link: `pt-4`

   Three cards should not each consume most of a viewport when every field can remain legible at this density.

5. **Stop forcing the desktop landing headline into three lines.** Give only the heading more width:

   `max-w-[880px] text-[58px] leading-[1.04] tracking-[-0.04em]`

   Keep the explanation and form at their current narrower width. The isolated cyan “time.” creates unnecessary hero height and makes the headline feel like display advertising rather than a utility.

6. **Replace the remaining manufactured-sounding copy.**

   Replace the landing explanation with:

   “Enter your company name or UEI. We’ll match your public SBA profile against open SAM.gov notices with at least a week left. You’ll see the three worth pursuing, plus one that looks right and isn’t—and why.”

   Replace “Three decisions instead of fifty candidates” with:

   “A short list, with reasons.”

   “Fifty candidates” is an unsupported rhetorical number, and “hands you every notice” sounds inflated. Use: “A NAICS search can surface notices that mention your code. We also check the work, set-aside, required vehicles, and response deadline before ranking the matches.”

SCORE: 88/100.
