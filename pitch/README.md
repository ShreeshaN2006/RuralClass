# RuralClass — Hackathon Pitch Deck

A six-page deck mapped one-to-one to the judging criteria. Each page leads with the criterion, then gives the evidence a judge needs to score it.

| File | Use |
| --- | --- |
| [RuralClass_Pitch_Deck.pdf](RuralClass_Pitch_Deck.pdf) | Submission copy, presenting from any device, printing |
| [RuralClass_Pitch_Deck.pptx](RuralClass_Pitch_Deck.pptx) | Editable slides with speaker notes in PowerPoint or Google Slides |

## Page map

| Page | Criterion | What it proves |
| --- | --- | --- |
| 1 | **Impact** | The problem at national scale (ASER 2024, UDISE+ 2024-25), the intended user, and the benefit the product is designed around. |
| 2 | **Innovation** | Coordination — not content — is the missing layer: constraint-first scheduling, explainable recommendations, bilingual parity. |
| 3 | **Execution** | 13 connected views, four pure TypeScript engines, 13 passing tests, strict types, production build, Render blueprint. |
| 4 | **UI / UX** | The Plan → Teach → Support journey, a full Kannada interface, teacher-in-the-loop controls, and a stated accessibility gap. |
| 5 | **Demo** | A four-step walkthrough a judge can reproduce, with credentials, screenshots and visible state changes. |
| 6 | **Feasibility** | Static deployment, existing devices, running-cost assumptions, known constraints, and the 8-week pilot ask. |

## The 3-minute route

| Time | Page | Point |
| --- | --- | --- |
| 0:00–0:30 | 1. Impact | One teacher, five grades, one room — and why that is the norm. |
| 0:30–1:00 | 2. Innovation | The product schedules the whole room, not one lesson. |
| 1:00–1:25 | 3. Execution | A working system: 13 views, tested engines, a clean build. |
| 1:25–1:50 | 4. UI / UX | One interface to learn, Kannada as a first-class language. |
| 1:50–2:40 | 5. Demo | Sign in, generate, run a period, close the learner loop. |
| 2:40–3:00 | 6. Feasibility | Static hosting, stated constraints, three pilot schools. |

If you have five minutes, give the demo its full 90 seconds and use the speaker notes on pages 3 and 4 for the technical detail. Do not read the slides; the notes carry the argument.

## Demo access

- Open the sign-in screen and choose **Anita Teacher**, or use `teacher_anita` / `demo123`.
- The demo has 11 teacher profiles across three fictional Karnataka schools.
- No backend, API key or network service is needed.
- The fastest local path is `npm install && npm run dev`, then open **http://localhost:3000**.

## Before presenting

- The PDF is the safe option on a machine without Segoe UI; the PPTX uses Segoe UI and Consolas.
- The deck is a **front-end prototype** story. Demo authentication is not security, and domain state does not persist across reload. Say this on page 6 before a judge asks.
- The impact page cites national statistics, not measured product outcomes. The pilot targets on page 6 are explicitly labelled as targets, not results.
- If the Render deployment is live, add the public URL to the closing page or say it aloud. The deck does not currently claim a live URL.

## Sources

- **ASER 2024 National Findings** — 52.1% of government primary schools have fewer than 60 students enrolled (up from 44% in 2022). [asercentre.org](https://asercentre.org/wp-content/uploads/2022/12/ASER-2024-National-findings.pdf)
- **UDISE+ 2024-25, Ministry of Education** — 1,04,125 single-teacher schools out of 14.71 lakh schools (~7%). [UDISE+ reports](https://udiseplus.gov.in/)
- Product claims (13 views, 11 teacher profiles, 102 learners, 13 passing tests, no backend or secrets) come from this repository and were verified at build time.

## Rebuilding

The deck is generated with `python-pptx` from the screenshots in [`docs/screenshots`](../docs/screenshots). The generator and the PowerPoint export script are development tooling and are not part of the submitted deck.
