# 🇮🇳 BharatVoice AI 
**Empowering Rural Citizens through Jargon-Free Government Assistance**

Built for the **AMD Slingshot Hackathon 2026**.

## 🚀 The Problem
Millions of rural Indian citizens are eligible for government schemes like **PM-KISAN**, but the official documentation is often buried in complex legal jargon. This creates a "knowledge gap" where those who need help the most cannot access it.

## 💡 The Solution
**BharatVoice** is a mobile-first AI assistant that uses **Retrieval-Augmented Generation (RAG)** to provide accurate, simplified, and instant answers to scheme-related questions. It acts as a digital bridge between the government and the citizen.

## 🛠️ Technical Architecture
The system is split into two main components:
1. **Frontend:** React Native (Expo) mobile app providing a clean, accessible chat interface.
2. **Backend:** FastAPI (Python) server hosting the RAG pipeline.

### The RAG Pipeline (The "Brain"):
* **Vector Database:** ChromaDB stores chunks of official government PDFs.
* **Embeddings:** `all-MiniLM-L6-v2` (HuggingFace) transforms text into searchable vectors.
* **LLM:** Google Gemini 1.5 Flash generates simplified, empathetic responses.
* **Orchestration:** LangChain manages the flow between the user query, the retrieved documents, and the AI.



## 🏗️ Setup & Installation

### Backend
1. Navigate to `/bharat-voice-backend`
2. Install dependencies: `pip install -r requirements.txt`
3. Create a `.env` file with your `GEMINI_API_KEY`.
4. Run: `uvicorn main:app --host 0.0.0.0 --port 8000`

### Mobile App
1. Navigate to `/BHARAT-VOICE-APP`
2. Install dependencies: `npm install`
3. Update `index.tsx` with your Backend URL.
4. Run: `npx expo start`

## 🌟 Future Roadmap
* **Voice-to-Voice:** Multilingual support for Hindi, Marathi, and Tamil.
* **Offline Mode:** Local LLM execution for areas with poor connectivity.
* **Document Upload:** Allow users to snap a photo of a physical letter to get an explanation.
