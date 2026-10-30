# RuralClass — Hackathon Pitch Deck

Two versions of the same 12-slide deck:

| File | Use |
| --- | --- |
| [RuralClass_Pitch_Deck.pdf](RuralClass_Pitch_Deck.pdf) | Submission copy, presenting from any device, printing |
| [RuralClass_Pitch_Deck.pptx](RuralClass_Pitch_Deck.pptx) | Editable slides with speaker notes in PowerPoint or Google Slides |

## The 3-minute route

If you have three minutes, present slides **1 → 2 → 3 → 4 → 5 → 6 → 8 → 12** and keep the rest as backup:

| Time | Slide | Point |
| --- | --- | --- |
| 0:00–0:20 | 1. Cover | One teacher, five grades, one classroom. |
| 0:20–0:55 | 2. Problem | Small rural schools make multi-grade teaching the operating model. |
| 0:55–1:20 | 3. Insight | The missing layer is coordination, not content. |
| 1:20–1:45 | 4. Solution | Plan, Teach, Support in one workspace. |
| 1:45–2:15 | 5. Product | Show the working prototype. |
| 2:15–2:35 | 6. Timetable | Conflict-free by construction. |
| 2:35–2:50 | 8. Last mile | Bilingual, low-resource, local-first, privacy-minimal. |
| 2:50–3:00 | 12. Ask | Three pilot schools, teacher feedback, mentorship. |

Slides **7, 9, 10 and 11** are the detail backup: intervention rules, impact measurement, architecture and roadmap. Use them for Q&A.

## Before presenting

- If the Render deployment is live, replace the closing card's **“Run locally with npm install && npm run dev”** line with the public URL. The QR code currently opens the GitHub repository.
- The deck uses **Segoe UI**, available on Windows. The PDF is the safe option for presenting from another machine.
- Demo access shown on the closing slide: teacher ID `anita`, password `demo123`.

## Sources used

- **ASER 2024 National Findings** — 52.1% of government primary schools have fewer than 60 students enrolled (up from 44% in 2022). [asercentre.org](https://asercentre.org/wp-content/uploads/2022/12/ASER-2024-National-findings.pdf)
- **UDISE+ 2024-25, Ministry of Education** — 1,04,125 single-teacher schools out of 14.71 lakh schools (~7%). [UDISE+ reports](https://udiseplus.gov.in/)
- Product claims (13 workflows, 11 demo accounts, 102 learners, 13 passing tests) come from this repository and were verified at build time.

## Rebuilding

The deck was generated with `python-pptx` and the screenshots in [`docs/screenshots`](../docs/screenshots). The generator and PowerPoint export script are development tooling and are not part of the submitted deck.
