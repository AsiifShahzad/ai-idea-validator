# AI Idea Validator — Multi-Agent System

> Agentic AI workflow that evaluates startup and business ideas across demand, competition, and risk dimensions — delivering structured verdicts in under 1 second.

[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat&logo=python&logoColor=white)](https://python.org)
[![LangGraph](https://img.shields.io/badge/LangGraph-0.1+-1C3C3C?style=flat)](https://github.com/langchain-ai/langgraph)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Status](https://img.shields.io/badge/Status-Production-brightgreen?style=flat)]()

---

## Problem Statement

Validating a business or product idea typically takes days of manual research — competitor analysis, market sizing, trend checks, and risk assessment. This system compresses that into a sub-second automated workflow using specialized AI agents that operate in parallel, each focused on a single dimension of validation.

---

## Key Results

| Metric | Result |
|--------|--------|
| End-to-end evaluation time | < 1 second |
| Validation dimensions | 3 parallel agents (demand, competition, risk) |
| Output format | Structured JSON verdict with scores |
| Deployment | REST API via FastAPI |

---

## System Architecture

```
User Idea Input
       │
       ▼
┌──────────────────┐
│  Orchestrator    │  ← LangGraph supervisor node
│  (Router Agent)  │
└──┬───────────────┘
   │
   ├──────────────────────────────────────┐
   │                                      │
   ▼                                      ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│ Demand Agent │   │  Competition │   │  Risk Agent  │
│              │   │  Agent       │   │              │
│ • Market size│   │ • Competitor │   │ • Entry      │
│ • Trend data │   │   landscape  │   │   barriers   │
│ • Search vol │   │ • Saturation │   │ • Red flags  │
└──────┬───────┘   └──────┬───────┘   └──────┬───────┘
       │                  │                   │
       └──────────────────┴───────────────────┘
                          │
                          ▼
              ┌───────────────────┐
              │  Synthesis Agent  │  ← Aggregates scores + rationale
              └─────────┬─────────┘
                        │
                        ▼
              ┌───────────────────┐
              │  Structured JSON  │  ← Verdict, scores, recommendations
              └───────────────────┘
```

---

## Tech Stack

| Layer | Tools |
|-------|-------|
| Agent Orchestration | LangGraph |
| LLM | Groq Api |
| Web Search Tool | Tavily Search API |
| API Layer | FastAPI |
| Output Schema | Pydantic |
| Environment | Python 3.10+|

---

## Features

- **Multi-agent parallelism** — demand, competition, and risk agents run concurrently
- **Live web search** — agents query real-time data via Tavily for current market signals
- **Structured output** — Pydantic-validated JSON with dimension scores and summary
- **Supervisor routing** — LangGraph orchestrator manages agent flow and error handling
- **Sub-second latency** — optimized async execution across agents
- **REST API** — single `/validate` endpoint, ready for product integration

---

## Setup & Usage

```bash
# 1. Clone the repo
git clone https://github.com/asiifshahzad/ai-idea-validator.git
cd ai-idea-validator

# 2. Set up environment
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# 3. Configure API keys
cp .env.example .env
# Add: OPENAI_API_KEY, TAVILY_API_KEY

# 4. Run the API
uvicorn api.main:app --reload
```

**Validate an idea:**
```bash
curl -X POST "http://localhost:8000/validate" \
  -H "Content-Type: application/json" \
  -d '{"idea": "An AI-powered tool that helps freelancers write better proposals"}'
```

**Sample response:**
```json
{
  "idea": "AI-powered freelance proposal writer",
  "verdict": "VIABLE",
  "scores": {
    "demand": 8.2,
    "competition": 5.5,
    "risk": 3.1
  },
  "overall_score": 7.1,
  "summary": "Strong demand signal in the freelance economy. Moderate competition from Jasper/Copy.ai but no direct niche focus. Low technical risk. Recommend validating pricing with target segment.",
  "recommendations": [
    "Target Upwork/Fiverr users as initial segment",
    "Differentiate via platform-specific templates",
    "Test willingness to pay before building"
  ]
}
```

---

## Agent Details

### Demand Agent
Assesses market size, Google Trends signals, and search volume for the idea's core problem. Outputs a demand score (0–10).

### Competition Agent
Identifies direct and indirect competitors, evaluates market saturation, and flags dominant players. Outputs a competition score (0–10, lower = less crowded).

### Risk Agent
Evaluates entry barriers, regulatory concerns, technical complexity, and capital requirements. Outputs a risk score (0–10, lower = less risky).

### Synthesis Agent
Aggregates all scores, generates a plain-English verdict (VIABLE / RISKY / AVOID), and produces actionable recommendations.

---

## 👤 Author

**Asif Shahzad** — AI/ML Engineer  
[Portfolio](https://asiifshahzad.vercel.app/) · [LinkedIn](https://www.linkedin.com/in/asiifshahzad) · [Email](mailto:shahzadasif041@gmail.com)
