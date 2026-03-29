# IdeaValidator

An AI-powered platform that validates business ideas using a multi-agent pipeline backed by real market data.

Live Demo: [your-deployed-url-here](https://your-deployed-url-here)

---

## Problem

Founders and builders spend days manually researching whether an idea is worth pursuing — scanning Reddit, Google, competitor sites — and still end up with incomplete, biased conclusions. There is no structured, repeatable way to stress-test an idea against real market data before investing time and money into it.

---

## Impact

- Reduces idea validation time from days to seconds
- Pulls signals from 8 real data sources (Tavily, Reddit, GitHub, Google Trends, Arxiv, News API, Product Hunt, Pinecone)
- Returns a structured verdict — score, confidence, demand, competition, risk — not just a summary
- Streams results in real time so users see each agent's progress as it runs

---

## Solution

A full-stack application with a LangGraph multi-agent pipeline orchestrated on a FastAPI backend and a React frontend.

The pipeline runs in two phases. First, a classifier categorizes the idea (business, dev project, research, content, physical product, or social impact) and a research node pulls background data from all 8 sources. Then three agents run in parallel — one each for demand, competition, and risk — before a decision node synthesizes the scores and a reflection node generates the final output.

Every validation returns a verdict (Promising / Questionable / High-Risk), an overall score out of 100, confidence percentage, success factors, failure reasons, and strategic notes.

---

## Tech Stack

FastAPI · LangGraph · Groq API · React · Vite · Tailwind CSS · Tavily · Pinecone · LangSmith

Deployed on Render (backend) and Vercel (frontend).

---

## Author

**Asif Shahzad** — AI/ML Engineer  
[Portfolio](https://asiifshahzad.vercel.app) · [LinkedIn](https://www.linkedin.com/in/asiifshahzad) · [Email](mailto:shahzadasif041@gmail.com)
