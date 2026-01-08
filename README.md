# JENKINS - AI Assistant - RAG-Powered Documentation Search System 

An end-to-end AI System that enables developers to query Jenkins documentation using natural language, backed by a production-ready backend, retrieval-augmented generation (RAG), persistent storage, and cloud deployment.


## Problem Statement

Jenkins documentation is large, fragmented, and difficult to navigate efficiently during real engineering workflows.  
Developers often waste time searching across pages, blogs, and outdated examples to find accurate answers.

Traditional keyword search fails to:
- Understand intent
- Provide contextual answers
- Preserve conversation history

---

## Solution Overview

This project implements a **full-stack AI assistant** that allows users to ask natural-language questions about Jenkins and receive **context-aware answers grounded in official documentation**.

**Key ideas:**
- Retrieval-Augmented Generation (RAG) to prevent hallucinations
- Backend-driven architecture (no browser-side AI)
- Persistent chat sessions with authentication
- Cloud-ready, containerized deployment

---

## System Architecture

![Architecture Diagram](./architecture.png)

**High-level flow:**
1. User interacts with the frontend UI
2. Requests are sent to a FastAPI backend
3. Jenkins documentation is retrieved via FAISS vector search
4. Relevant context is injected into the LLM prompt
5. Responses are generated and stored in PostgreSQL
6. System is deployed as Dockerized services on AWS EC2

---

## Tech Stack

### Frontend
- Modern web UI (authentication + chat interface)

### Backend
- FastAPI (Python)
- JWT authentication
- RESTful API design

### AI / RAG
- Document ingestion & cleaning
- Text chunking
- Embeddings
- FAISS vector database
- LLM-based answer generation

### Database
- PostgreSQL
- Persistent user sessions and chat history

### DevOps & Infrastructure
- Docker & Docker Compose
- Docker Hub (image registry)
- AWS EC2 (deployment)

---

## Core Features

- Secure user authentication (signup / login)
- Multi-session chat history
- Retrieval-Augmented Generation (RAG)
- Jenkins documentation grounding
- Persistent storage with PostgreSQL
- Fully containerized services
- Cloud deployment on AWS EC2

> Only implemented features are listed here. No future claims.

---

## Local Setup

### Prerequisites
- Docker
- Docker Compose

### Environment Variables
Create a `.env` file using the example below:

```env
POSTGRES_USER=your_user
POSTGRES_PASSWORD=your_password
POSTGRES_DB=your_db
JWT_SECRET=your_secret
LLM_API_KEY=your_api_key