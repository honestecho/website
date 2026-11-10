# Part 19 research notes (as of 2026-11-02)

## Fetched (all HTTP 200 unless noted; TLS verification left on everywhere)
- Current FAR Part 19: https://www.acquisition.gov/far/part-19 (FAC 2026-01, effective 03/13/2026). Parsed the full part, subparts 19.0 to 19.15.
- Current FAR Part 16 (for 16.505 order protest rules): https://www.acquisition.gov/far/part-16
- RFO Part 19 model text: https://www.acquisition.gov/far-overhaul/far-part-deviation-guide/far-overhaul-part-19 (read in full)
- RFO Parts 52 (52.219-x clauses), 16, 6, 7: same URL pattern with -part-52/-16/-6/-7
- Deviation guide: https://www.acquisition.gov/far-overhaul/far-part-deviation-guide (Part 19 header: "Issuance Date: September 26, 2025 UPDATE: February 20, 2026"; 31 agency PDFs listed)
- All 31 agency Part 19 deviation PDFs from /sites/default/files/page_file_uploads/ (read date lines plus the GSA memo in full)
- Practitioner Album (Articulate Rise). Decoded the embedded course JSON to get the change summary and the embedded "Line Out" redline of current Part 19 / 52.219.
- FAR Companion v3.0 (Oct 30, 2026) PDF, Part 19 section (pp. 70-72)
- FAR Overhaul landing page, FAQs, You Said We Did, Practitioner Albums index: no Part 19-specific FAQ or feedback entries
- Federal Register API (documents.json search plus document JSON and raw text for 2026-12559, -19158, -19160, -19162, -16603). No HTML pages were used.
- eCFR renderer API (needs `--compressed` and `chapter=I`): 13 CFR 125.2, 125.3, 121.406, 124.504, 127.504
- acq.osd.mil: class_deviations.html, dfars_far_overhaul_class_deviations.html, and the 2026-O0037 Rev 1 cover PDF. The certificate verified fine (ssl_verify_result=0), so no certificate failure to record.

## Failures and workarounds
- eCFR first returned a 302 and then a 406 (it requires compression). Fixed with the right headers; no data lost.
- DOE deviation PDF text is font-encoded, so I read the signature dates from a rendered image of the last page. No effective-date statement was read.
- The HHS file is Amendment 3 of a multi-part deviation, and no date was readable for it, so HHS is not in agencyDates.
- SSA memo prints "January 28, 2025". I recorded it as printed and logged it as a conflict.
- There is no standalone Part 19 redline PDF. The only redline is the Album's embedded line-out, which is high-level and misses some changes.
- No Part 19 proposed rule or FAR case exists in the Federal Register as of today.

## Confidence by section
- changes: mostly high. These are verbatim text comparisons of the codified FAR against the RFO model text.
  - Medium: nonmanufacturer-rule-split (the content is spread across clause, SBA rule and Companion); wosb-pending-application-path (this rests on what the RFO text leaves out, and it conflicts with 13 CFR 127.504); subcontractor-socioeconomic-certification (conflicts with 13 CFR 125.3(b)(4)); sb-specialist-and-pcr-review (only Parts 19 and 7 were checked for relocated text); coc-agency-appeal-removed (SBA's 13 CFR 125.5 not checked).
- unchanged: high (thresholds and percentages matched in both texts).
- status: high on dates and DoD numbers. "No Part 19 rulemaking" is high for the FR API as of today, but it is a negative finding.
- agencyDates: high where taken from a digital signature stamp or an explicit "effective" sentence; medium for the "first date in memo" rows (NARA, NSF, SSA).
- faq and actions: these interpret the changes above and inherit their confidence.

## Caveats for the explainer page
- Each agency's deviation controls only that agency's buys. The codified FAR still applies where an agency has not deviated, and to existing contracts unless they are modified. GSA's memo leaves open contracts to CO discretion.
- Several RFO positions conflict with current SBA regulations (order set-aside priority, WOSB pending applications, 8(a) release, subcontractor self-certification). The page should say these are unresolved and not present the RFO text as settled law.
- Quotes in the JSON are 15 words or fewer. Everything else is paraphrased.
