The page makes visitors read too much before they can follow the route. The cyan Triage enclosure competes with the path, the shortcut to Decision is hard to interpret, and the copy underexplains who makes the final call. It falls short of 95.

Hierarchy and focal point **15/20**; composition, alignment and rhythm **16/20**; glass and depth **11/15**; typography and legibility **13/15**; premium feel and restraint **8/10**; mobile translation **8/10**; copy **7/10**.

1. **Bring the map into the first screen. Images 1 and 4.**  
   The large empty band above the H1 and the long paragraph push the explanation below the fold. Set hero top padding to `80px` on desktop and `72px` on mobile; use `margin-top: 32px` before the panel. Replace the paragraph with:  
   **“Pursuit matches SAM.gov notices to your company profile. Five phases help you decide whether to bid, with options to park or close at Triage. Pursuit recommends a decision; you record the call. A Go opens the Bid Handoff.”**

2. **Make the highlighted route traceable from the actual call. Image 2.**  
   The cyan connection leaves the Triage tray, making the entire tray appear to advance. Start it at the right edge of **Continue**, then connect Eligibility → Alignment → Viability → Decision → Go → Bid Handoff. Use `stroke-width: 2px` for that route and `1px` with `rgba(169,182,203,.28)` for secondary threads. Give Caution its own neutral connection to Eligibility. Preserve orthogonal runs and rounded bends.

3. **Reduce the selected tray’s visual dominance. Images 1 and 2.**  
   The tall cyan outline grabs more attention than the thin route. Set the selected Triage border to `1px solid rgba(0,195,255,.4)` and remove its outer glow. Reserve full cyan intensity for the corner tabs and highlighted thread. The selected stepper segment already identifies the active phase; the tray does not need to shout again.

4. **Make the disqualification shortcut readable. Image 2.**  
   The rotated **Disqualifying issue** label reads like a diagram annotation squeezed into leftover space. Remove its rotation and place it horizontally beneath Eligibility, approximately screenshot position `left: 742px; top: 258px`, at `14px/20px`. Route its neutral thread visibly into the No-Go branch of Decision. Add **“Go unavailable”** beneath the label so the shortcut’s consequence is explicit.

5. **State decision ownership and distinguish the two outcomes. Image 2.**  
   The Decision cluster communicates destinations without explaining the recommendation versus the recorded choice. Replace the Decision phase summary with:  
   **“From your answers, Pursuit recommends Go, Conditional Go or No-Go; you record the decision.”**  
   Replace these vague sub-lines exactly:  
   **“Opens the handoff” → “Opens Bid Handoff”**  
   **“Reason on record” → “Records your reason”**  
   **“Into proposal planning” → “For proposal planning”**  
   **“Why you made the call” → “Why you passed”**

6. **Give trays, cards and panes distinct material roles. Images 2 and 3.**  
   Most cards currently read as the same opaque navy component, while Sources has a disproportionately strong teal wash. Use trays at `rgba(15,29,47,.55)`, cards with `linear-gradient(180deg,#1b2941,#111b2d)`, and detail panes at `#0b1120`. Give cards a restrained `0 6px 14px rgba(0,0,0,.24)` shadow. Reduce the panel’s dot texture to `.12` opacity.

7. **Align the detail panes and remove redundant furniture. Images 2 and 3.**  
   The right pane starts roughly `14px` above the left. Put both in one grid row with equal top edges, `gap:20px`, `padding:40px`, and `border-radius:28px`. Remove the **Phases / 5 / One question each** tile: the stepper and phase counter already communicate this. Set detail rows to `14px/22px` with `8px` row gaps.

8. **Recover mobile reading width. Image 5.**  
   Every paragraph inherits the title’s deep left indent, leaving only about `248px` for text. Keep the title inset at `54px` to clear the cyan tab, but set questions, summaries and rows to `padding-inline:20px`. Use `14px/20px` body text and `12px` between row groups. This reduces avoidable wrapping and the distance to later phases.

SCORE: 78/100.
