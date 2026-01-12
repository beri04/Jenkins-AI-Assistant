<p align="center">
  <img src="./image.png" alt="System Architecture" width="85%" />
</p>

# Jenkins AI Assistant — RAG-Powered Documentation Search System

> A production-style AI assistant that lets developers query Jenkins documentation using natural language.
>
> Built with FastAPI, PostgreSQL, FAISS, and Docker — deployed on AWS EC2.
>
> Focused on real backend, infra, and RAG engineering (not demos).

---

## Quick Facts

- **Domain:** AI × DevOps × Backend Systems  
- **Architecture:** Frontend → FastAPI → RAG → PostgreSQL  
- **Deployment:** Dockerized services on AWS EC2  
- **Purpose:** Demonstrate real-world backend, AI, and infrastructure engineering  

---

## 🧠 Problem Statement

Jenkins documentation is extensive, fragmented, and difficult to navigate during real engineering workflows.  
Developers often spend significant time searching across documentation pages, blogs, and outdated examples to find reliable answers.

Traditional keyword-based search systems fail to:
- Understand user intent  
- Provide context-aware responses  
- Maintain conversational continuity  

---

## ✅ Solution Overview

This project implements a **full-stack AI assistant** that allows users to ask natural-language questions about Jenkins and receive **context-aware answers grounded in official Jenkins documentation**.

**Key design principles:**
- Retrieval-Augmented Generation (RAG) to reduce hallucinations  
- Backend-centric architecture (no client-side AI logic)  
- Persistent, authenticated chat sessions  
- Containerized, cloud-ready deployment  
- For demonstration purposes, FAISS indexes and embedding artifacts are precomputed and included in the Docker image to allow fast startup without requiring an ingestion step.
In a production system, these artifacts would be generated dynamically or stored externally.

---

## 🤖 System Architecture

**High-level request flow:**
1. User submits a query via the frontend interface  
2. Request is validated and processed by the FastAPI backend  
3. Relevant Jenkins documentation chunks are retrieved using FAISS  
4. Retrieved context is injected into the LLM prompt  
5. The generated response is stored in PostgreSQL  
6. All services run as Docker containers on AWS EC2  

---

## 🧰 Tech Stack

### Frontend
- Web-based UI with authentication and chat interface  

### Backend
- FastAPI (Python)  
- JWT-based authentication  
- RESTful API design  

### AI / RAG
- Jenkins documentation ingestion and cleaning  
- Text chunking and embeddings  
- FAISS vector search  
- LLM-based answer generation  

### Database
- PostgreSQL  
- Persistent storage for users, sessions, and chat history  

### DevOps & Infrastructure
- Docker & Docker Compose  
- Docker Hub (image registry)  
- AWS EC2 (deployment environment)  

---

## 🚀 Core Features

- Secure user authentication (signup / login)  
- Multi-session chat history persistence  
- Retrieval-Augmented Generation (RAG) pipeline  
- Jenkins documentation-grounded responses  
- PostgreSQL-backed data storage  
- Fully containerized services  
- Cloud deployment on AWS EC2  

> Only implemented features are listed. No speculative roadmap.

---

### Run Locally

### Prerequisites
- Docker  
- Docker Compose  

### Environment Variables

Create a `.env` file using the provided `.env.example`:

```env
# AI / LLM
GROQ_API_KEY=your_groq_api_key_here

# Database
DATABASE_URL=postgresql://user:password@host:port/dbname

# Backend
NEXT_PUBLIC_API_URL=http://localhost:8000

# Frontend
FRONTEND_ORIGIN=http://localhost:3000
```

### ➡️ RUN LOCALLY
```
docker compose build --no-cache
docker compose up 
```
