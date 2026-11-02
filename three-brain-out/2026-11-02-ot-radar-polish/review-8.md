**Tone & copy: 23/25 · Signup hierarchy: 19/20 · List readability: 14/15 · Typography & rhythm: 13/15 · Mobile: 14/15 · Trust: 9/10**

The remaining distance from 95 is mostly readability and administrative phrasing. The mobile list still demands too much close reading, and the signup description repeats information instead of making the benefit immediate. The explainer definitions sound institutional in places; making them shorter alone would risk making them curt.

Keep the previously approved hero paragraph, list introduction and confirmation wording. Keep the closing disclaimer verbatim, including “general information, not legal advice.” Its restrained placement does not make it read as a warning barked at visitors.

1. **Make the signup’s supporting copy earn its space.**

   Current:

   “Each Monday, we’ll send you a free email with new OT and CSO notices from public SAM.gov postings, so you can browse them in one place.”

   This repeats the heading and arrives at the benefit late. Replace with:

   **“Browse the OT and CSO notices we’ve added from public SAM.gov postings in one free weekly email.”**

   Keep the existing Monday heading and submit label. This also makes “new” mean newly added to this list, without implying comprehensive coverage.

2. **Raise the mobile list’s supporting text above fine-print size.**

   Agency, deadline and classification text remain difficult to scan in the supplied mobile view. Long official titles already consume considerable attention; the supporting details need to help visitors navigate.

   Use `text-sm leading-5` for agency and classification. Give the due date `text-sm font-medium leading-5`, with days left below it. Keep the existing bottom deadline/action grouping and full title wrapping. Maintain `min-h-11` on “Check fit.”

3. **Rewrite the two institutional definitions.**

   The OT card’s “outside the usual … process” construction and “terms are negotiated” passive voice create distance. Replace its body with:

   **“An OT gives an agency flexibility to negotiate an agreement outside the usual contract, grant or cooperative agreement process. Most Federal Acquisition Regulation (FAR) rules don’t apply.”**

   The CSO card’s “Awards can be” sounds like procurement guidance written for an internal handbook. Replace its body with:

   **“Through a CSO, an agency invites businesses to propose commercial products and services. Depending on the opening, the award may be a fixed-price contract or an OT.”**

   Leave the consortium card unchanged. Further simplification would lose useful distinctions.

4. **Give the tags enough room to be useful.**

   The statutory citations and source-derived labels become tiny texture, particularly on mobile. Preserve their wording, but use `text-xs leading-5 px-2 py-0.5` and `flex flex-wrap gap-1.5`. Keep `mt-2` between agency/context and tags.

   Do not compensate by bolding every tag. Titles should remain the first reading level, agency and deadline the second, tags the third.

5. **Make the Type filter easier to operate on mobile.**

   The compact outlined options require precision immediately before a long scroll. Use `min-h-10 px-3 text-sm`, with `flex flex-wrap gap-2`. Keep “Type” as a separate label above the controls on narrow screens.

   Preserve the existing options and selected cyan treatment. The filter needs larger targets, without acquiring more visual weight than the signup action.

6. **Explain why an apparently open notice might disappear.**

   The weekly refresh statement does not explain the removal policy. That omission can look like inconsistent maintenance when someone returns before a deadline.

   Append this exact sentence to the existing process paragraph:

   **“Notices stay on this list until the day before they close.”**

   Keep it in normal supporting text, without a warning box or legal styling. This supplies a concrete expectation without changing the previously approved introduction.

SCORE: 92/100.
