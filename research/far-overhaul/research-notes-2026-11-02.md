# FAR overhaul research notes (as of 2026-11-02)

Dataset: `far-research.json` (same folder). Built by `tools/build.py` + `tools/build2.py` from downloaded pages in `dl/` and `pdf/`.

## Fetched and used
- acquisition.gov: RFO home, FAR Part Deviation Guide (all 51 RFO parts with issuance/update dates and agency deviation PDF links), part pages 1, 2, 19, 52, FAQs, Policy & Guidance, You Said We Did, Practitioner Albums index, GSAR Overhaul, FAR browse index (Parts 20/21 reserved).
- acquisition.gov PDFs: OMB M-25-26; FAR Council deviation guidance (May 2, 2025); FAR Council E.O. 14402 guidance (June 25, 2026); FAR Council E.O. 14398 guidance; GSA RGO-2026-01; FAR Companion Version 3.0 (Oct 30, 2026); 68 agency Part 1 / Part 19 deviation PDFs; 46 DoD deviation PDFs (original versions).
- Federal Register API + full text: E.O. 14275; 8 RFO proposed rules (2026-12559/60/61/62, 2026-19158/59/60/62); GSAR proposed rules 2026-19331 and 2026-20317; FAR regulatory agenda 2026-16612; OFPP and DARS document lists since April 2025 (no RFO final rule; no DFARS RFO proposed rule).
- reginfo.gov Unified Agenda (pubId 202510) entries for RINs 9000-AO81..AO92.
- whitehouse.gov: Apr 16 2025, Aug 15 2025, Sept 26 2025, June 25 2026 releases. gsa.gov: May 6 2025 release.
- advocacy.sba.gov: June 25 2026 and Sept 21 2026 posts (via curl; WebFetch got 403).
- acq.osd.mil DPCAP "DFARS Revolutionary FAR Overhaul Class Deviations" list page (last updated Oct 22, 2026).

## Failed or partial
- acq.osd.mil: WebFetch failed ("unable to verify the first certificate"). The list page was downloaded once with curl TLS verification off; a second attempt for the Dec 19, 2025 rollout memo PDF was blocked, and I did not retry. DPCAP memo PDFs (revisions) were not read; DoD original memos were read from acquisition.gov instead.
- acq.osd.mil FAR case status report: DNS/TLS failure, not read.
- war.gov release on the Phase 2 input letter: 403. Not used.
- waru.edu (DoD acquisition university announcements): 403, and not a .gov/.mil domain anyway.
- Practitioner Albums (JavaScript packages): not read.
- regulations.gov dockets: not checked.

## Confidence by section
- phases: high (FR, OMB, acquisition.gov). DFARS phase date (Dec 19, 2025) is from a PDF file name only: medium.
- farParts: high for issuance/update dates (deviation guide) and proposed-rule mapping (FR + You Said We Did table). Parts 20/21 status left null (reserved; none of the four statuses fits).
- dfars: medium-high. List, numbers, revision dates from DPCAP page; original effective dates from acquisition.gov copies. No DFARS proposed rule found.
- agencyAdoption / agencyPartMatrix: high for which parts each agency has a posted deviation; medium for dates (extracted from PDF signatures or first date in memo, Parts 1 and 19 only, about 22 agencies). GSA Part 1 date (4/21/2025) is suspect.
- upcoming: high for dated items; undated items say "No date announced".
- topImpacts: facts high (FR text); ranking is judgment, basis given per item. Part 19 item rests on model deviation text, not a proposed rule.
- topTrends: high on evidence; selection is judgment.
- govMetrics: high (quoted government figures); DFARS count is a researcher count and labeled so.
- conflicts: 8 recorded, each with URLs.
- reviewClaims: 1 confirmed in part (FAR Companion 3.0: "past performance" not named in change log), 2 confirmed, 1 done.
