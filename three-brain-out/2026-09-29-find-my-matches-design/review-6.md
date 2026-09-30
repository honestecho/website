### Score breakdown

- Hierarchy & focal point: 20/20
- Result-card scannability: 19/20
- Typography & rhythm: 14/15
- Composition, alignment & consistency: 14/15
- Mobile translation: 9/10
- Trust & restraint: 10/10
- Copy: 9/10

The remaining defects are compression and secondary-action emphasis—not the core information architecture.

### Top 6 fixes

1. **Separate the matched company from its location on mobile.** The centered dot makes “San Antonio, TX” look like part of the company name and creates an ugly break after “San.” Match the desktop treatment:

   ```html
   <div class="font-semibold leading-5">HEALTH FACILITY SOLUTIONS COMPANY</div>
   <div class="mt-0.5 text-sm text-[#a0b2c8]">San Antonio, TX</div>
   ```

2. **Reduce the sticky claim bar from 80px to roughly 64px.** It still consumes too much of the result viewport and obscures more content than necessary:

   ```txt
   wrapper: py-2 min-h-16
   button: min-h-12 px-4 pr-11 text-[14px] leading-5
   arrow: absolute right-4 top-1/2 -translate-y-1/2
   page: pb-[calc(5rem+env(safe-area-inset-bottom))]
   ```

3. **Stop making the upload button full-width on mobile.** Its footprint is nearly equal to the primary lookup CTA, weakening the required entry-path hierarchy. Use:

   ```txt
   w-fit min-w-[160px] px-5
   ```

   Keep the outlined treatment. Do not reduce the upload explanation or hide the path.

4. **Make the agency line easier to scan inside result cards.** It is currently cramped, heavily capitalized, and visually close to metadata noise. Preserve the supplied agency text but use:

   ```txt
   mt-1.5 text-[13px] leading-[18px] tracking-[0.02em] text-[#a0b2c8]
   ```

   Avoid `tracking-wider`; long contracting-office names already wrap enough.

5. **Fix the desktop alignment jump below the landing form.** The hero and form begin around `x:280`, while “A short list, with reasons” abruptly returns to `x:80`. Put the explanatory section in the same contained column:

   ```txt
   max-w-[880px] mx-auto px-5 md:px-0
   ```

   This also makes the landing and result panels feel like the same product.

6. **Rewrite the hero paragraph’s mechanical “match against” construction.** Use:

   “Enter your company name or UEI. We’ll find your public SBA profile and compare it with open SAM.gov notices that have at least a week left. You’ll see the three worth pursuing, plus one that looks right and isn’t—with the reason for each.”

   Also change `PROFILE WE MATCHED` to `MATCHED COMPANY`; the current label describes an internal process instead of what the visitor is looking at.

SCORE: 95/100
