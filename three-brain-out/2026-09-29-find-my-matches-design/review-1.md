### Score breakdown

- Hierarchy & focal point: 12/20
- Result-card scannability: 13/20
- Typography & rhythm: 11/15
- Composition, alignment & consistency: 11/15
- Mobile translation: 7/10
- Trust & restraint: 8/10
- Copy: 7/10

The result state has the wrong opening. An outreach visitor lands on an entire search-page hero before seeing the matches they were promised. On mobile, that consumes more than a full screen. The page effectively asks them to search again instead of validating the email.

The result cards bury the decision-making fields. Deadline, competition type, and NAICS are small, low-contrast metadata, while an unexplained `80/100` receives disproportionate emphasis. Titles are allowed to become dense paragraphs. The desktop layout also changes abruptly from a centered 768px hero to a nearly full-width results grid.

### Top 6 fixes

1. **Remove the landing hero and search form from State B.** Start the result state directly below navigation:

   `#results class="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8 lg:pt-14"`

   Keep “Check another company” as a tertiary link back to State A. Do not show a second primary action before the matches. This single change fixes the desktop and mobile result-state hierarchy.

2. **Rebuild each result card around the five-second decision.** Use:

   `grid gap-4 md:grid-cols-[minmax(0,1fr)_7rem] md:gap-x-8`

   Put status, title, agency, then a visibly separated metadata row. Style the deadline as `font-semibold text-white`; keep set-aside and NAICS at `text-sm text-[#a0b2c8]`. Relabel `FIT` to `PROFILE FIT` so `80/100` has context. Use `text-lg leading-6 md:text-xl md:leading-7` for titles rather than compressing them.

3. **Make the existing claim block the unmistakable conclusion.** Keep it immediately after the near-miss, inside the results column and before any explanatory page content:

   `mt-6 rounded-lg border border-[#1e2d4a] bg-[#0b1120] p-5 md:p-6`

   Button: `mt-4 min-h-12 w-full bg-[#00c3ff] font-semibold text-[#030b17] md:w-auto`

   Rewrite its lead to: “Save these matches and score new notices as they post. We’ve already filled in your profile from the SBA data shown here. Create a free account; no card.”

4. **Use one desktop alignment system.** Wrap both states in `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`. In State A, place the hero and form in `max-w-3xl` aligned to that container’s left edge. The current jump from `x336` in the hero to `x80` in results makes the page feel assembled from separate templates.

5. **Tighten mobile without shrinking important text.** Use `text-[38px] leading-[1.06] tracking-[-0.035em]` for the headline, `text-[17px] leading-[1.55]` for its paragraph, and `p-4` for panels. Stack card metadata with `gap-2`; keep deadlines and reasons at least `text-sm leading-5`. The result state must begin with its heading and first pick in the first viewport—not the search form.

6. **Remove the stilted and inaccurate copy.** Replace the landing paragraph with: “Enter your company name or UEI. We match your public SBA profile against open SAM.gov notices with at least a week left and show the three worth pursuing, plus one that looks right and isn’t. See what to pursue, what to skip, and why.”

   Also replace:

   - “The 3 worth your pursuit time” → “The 3 worth pursuing”
   - “HOW WE READ YOUR COMPANY” → “COMPANY PROFILE USED FOR THIS MATCH”
   - “Your 12-character UEI goes straight to your matches.” → “Enter your 12-character UEI for an exact company match.”
   - “A first screen” → “A first-pass screen”

SCORE: 69/100
