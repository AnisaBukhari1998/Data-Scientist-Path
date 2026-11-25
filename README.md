# Data Scientist Path

A self-paced data science learning app that organizes **free, legally available** courses, books, videos and practice sites into a structured roadmap, with progress tracking, flashcards, quizzes, a Python/SQL sandbox, mock interviews and portfolio tools.

## Roadmap

| Phase | Focus |
| --- | --- |
| 1 — Foundations | Python, math, SQL, statistics |
| 2 — Core ML | Classical machine learning and model pipelines |
| 3 — Deep Learning & Deployment | Neural networks, NLP, shipping models |
| 4 — Capstone & Job Readiness | Portfolio projects, interview prep |
| 5 — AI Engineering, MLOps & GenAI | Explainability, deployment, RAG, agents |

All resources live in [`src/data/roadmap.js`](src/data/roadmap.js).

### Resource policy

- Only link to resources that are free to use (free courses, audit tracks, official free editions of books).
- Books are **never** bundled in this repository. A book entry links to the author's or publisher's free edition ("Read Free"), or, for paid books, to an [Open Library](https://openlibrary.org/) search where it can be borrowed ("Find Book").
- Progress is stored by item position, so **add new resources to the end of a section** rather than inserting or reordering, to keep learners' saved progress intact.

## Development

```bash
npm install
npm run dev       # http://localhost:5173
npm run lint
npm run build
```


Authentication, sync and the AI tutor use Firebase (see `src/firebase.js`, `firestore.rules`).
