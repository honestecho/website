The remaining gap is visual hierarchy: the white button dominates the panel, while the highlighted route depends too heavily on following thin connectors. Every cyan corner tab carries similar emphasis, including outcomes outside that route. On mobile, the explanation occupies a narrow reading column inside several layers of padding.

| Criterion | Score |
|---|---:|
| Hierarchy and focal point | 18/20 |
| Composition, alignment and rhythm | 18/20 |
| Glass material and depth | 13/15 |
| Typography and legibility | 14/15 |
| Premium feel and restraint | 9/10 |
| Mobile translation | 9/10 |
| Copy | 9/10 |

1. **Make the highlighted route identifiable through its cards. Image 2.**  
   Continue, Watch and No-Bid currently have nearly identical visual weight. Apply `box-shadow:inset 0 0 0 1px rgba(0,195,255,.4)` to the seven cards on the highlighted route: SAM.gov notices, Continue, Eligibility, Alignment, Viability, Go — We Bid and Bid Handoff. Preserve every corner tab and the existing connector weights. The route should remain readable when someone stops tracing its threads.

2. **Reduce the desktop button’s visual dominance. Images 1 and 2.**  
   The approximately `334 × 66px` white block wins the first glance over the map. Above `1024px`, use `width:304px; height:56px; font-size:16px; line-height:24px`, with a `16px` arrow and `12px` label-to-arrow gap. Keep it solid white. Vertically center it beside the stepper; retain the mobile treatment.

3. **Make the alternative branches readable. Image 2.**  
   The grey Caution connection and disqualifying shortcut nearly disappear against the trays. Their existence changes the meaning of the process. Set these connectors and the No-Go connection to `stroke:#a9b6cb; stroke-opacity:.5; stroke-width:1px`. Keep their current routing and clearance. Visitors should see the alternatives without needing to enlarge the image.

4. **Recover mobile reading width. Images 4 and 5.**  
   At `390px`, the panel begins at `24px`, cards at `44px`, and body text at `64px`. That leaves only about `262px` for explanations. Below `640px`, change the panel’s horizontal margin to `16px`, retaining its existing internal padding and card padding. Cards become approximately `318px` wide, giving text another `16px` without tightening the corrected vertical rhythm.

5. **Separate tray material from card material. Images 1 and 2.**  
   The large enclosing trays still read as dark containers more than glass; their fills flatten the space behind the cards. For Sources, Triage, Decision and After the decision, use `background:rgba(11,25,42,.55); backdrop-filter:blur(8px); border:1px solid rgba(169,182,203,.16)`. Retain the cards’ current gradient and the detail panes’ darker fill. Keep the selected Triage border cyan.

6. **Resolve the desktop hero’s stray left alignment. Image 1.**  
   The hero starts at approximately `80px`; the stepper, legend and map content start at `104px`. Align the desktop hero to the panel’s inner content edge with `max-width:1232px; margin-inline:auto`. Keep the panel’s outer width. The present `24px` discrepancy makes the hero and explanation feel independently positioned.

7. **Provide the action after the mobile explanation. Images 4 and 5.**  
   The shown button precedes Sources and all five phases. Repeat **“Find My Opportunities — Free”** immediately after the final phase card, with `margin-top:24px`, using the same mobile button styling. Someone who reads through the decision process should have the action available at that point.

8. **Remove the remaining clipped, mechanical sub-lines. Images 1 and 2.**  
   Make these exact replacements in the map’s editable sub-lines:

   - **“Eligibility opens” → “Opens Eligibility”**
   - **“Open questions carried” → “Carries open questions”**
   - **“Parked, monitoring” → “Parked for monitoring”**

   These describe what happens in ordinary English. Preserve the fixed detail rows, hero paragraph and Decision summary.

SCORE: 90/100.
