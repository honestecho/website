**85/100.** The map still leaves two distinctions too implicit: the cyan route is one possible path, and the Decision cards represent the user’s recorded choice. On mobile, the Sources card consumes too much of the first screen, while Triage’s repeated text slows progress toward the later phases.

| Criterion | Score |
|---|---:|
| Hierarchy and focal point | 17/20 |
| Composition, alignment and rhythm | 17/20 |
| Glass material and depth | 13/15 |
| Typography and legibility | 13/15 |
| Premium feel and restraint | 9/10 |
| Mobile translation | 8/10 |
| Copy | 8/10 |

1. **Identify what the cyan route represents. Image 2.**  
   Nothing explicitly tells visitors that the highlighted route illustrates a pursuit ending in a bid. Add **“Highlighted path: Continue to Go — We Bid”** at `14px/20px`, in `#a9b6cb`, between the controls and map. Use the existing space above the Triage tray: `margin-top:12px`, aligned with the panel’s left content edge. Keep the map’s current vertical position.

2. **Put decision ownership directly on the map. Image 2.**  
   The crucial explanation currently lives in prose or a selected detail state. Beside the **Decision** tray heading, add **“You record the call”** at `14px/20px`, muted, with a `12px` gap. It fits within the heading row without moving the outcome cards. Visitors should understand who commits the decision while tracing the route.

3. **Separate the two grey Eligibility connections. Image 2.**  
   Caution’s approach and the disqualification shortcut crowd the same narrow corridor beneath Eligibility. Their relationship requires close inspection. Give them separate routing lanes with at least `16px` clearance. Join Caution into the incoming run **before** its upward bend; start the disqualification shortcut from Eligibility’s bottom edge and retain its termination at No-Go. Preserve the existing thread weights.

4. **Remove the detail panes’ empty lower shelf. Image 3.**  
   Both panes continue substantially below their final rows. That empty area makes the panel feel like a dashboard container waiting for content. Remove the panes’ fixed height or minimum height: `height:auto; min-height:0`. Keep equal heights through grid stretching and retain `40px` padding. The visible content calls for approximately `350px` total height, rather than roughly `444px`.

5. **Compact Sources on mobile. Images 4 and 5.**  
   The Sources card takes about `160px` to communicate two short inputs, pushing Triage below the fold. Below `1024px`, place its two source groups in `grid-template-columns:repeat(2,minmax(0,1fr))` with `gap:12px`. Keep the title above them and `20px` content padding. Target a card height around `128px`; retain the existing text sizes.

6. **Give mobile outcome rows a steadier rhythm. Image 5.**  
   The wrapped Caution explanation creates an uneven sequence of dense text blocks. Apply a consistent `16px` gap between outcome groups and `2px` between each label and explanation. Keep body copy at `14px/20px`. Separate the final **Output** group with `padding-top:12px` and a `1px solid #1e2d4a` top border so the deliverable reads separately from the calls.

7. **Make the Decision summary distinguish recommendation from recording. Relevant to the phase selector in Image 2.**  
   Replace the supplied summary with:  
   **“Pursuit recommends Go, Conditional Go or No-Go from your answers. You record Go — We Bid or No-Go — We Pass.”**  
   This resolves the otherwise unanswered question of how three recommendations lead to two recorded outcomes.

8. **Replace the remaining vague source sub-lines. Images 1 and 2.**  
   **“Open notices” → “Matched to your profile”**  
   **“What you do” → “Your company’s capabilities”**  
   The current phrases name generic content. These replacements explain why the two inputs belong together. Keep the revised hero; another rewrite would have less impact than these map-level clarifications.

SCORE: 85/100.
