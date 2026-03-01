import os
from dotenv import load_dotenv
from fastapi import FastAPI
from pydantic import BaseModel

# Updated LangChain Imports
from langchain_text_splitters import CharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_classic.chains import RetrievalQA

# Load the hidden variables from your .env file
load_dotenv()

app = FastAPI()

# 1. Simulate a Government Document
sample_scheme_text = """
The Pradhan Mantri Kisan Samman Nidhi (PM-KISAN) is a Central Sector scheme with 100% funding from Government of India. 
Under the scheme an income support of 6,000/- per year in three equal installments will be provided to all land holding farmer families. 
Definition of family for the scheme is husband, wife and minor children. 
State Government and UT administration will identify the farmer families which are eligible for support as per scheme guidelines. 
The fund will be directly transferred to the bank accounts of the beneficiaries.
"""

# 2. Initialize RAG Components
text_splitter = CharacterTextSplitter(chunk_size=200, chunk_overlap=0)
texts = text_splitter.split_text(sample_scheme_text)

# Using a free, local embedding model
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
vectorstore = Chroma.from_texts(texts, embeddings)

# Initialize the Free Gemini LLM securely using os.getenv
llm = ChatGoogleGenerativeAI(
    model="gemini-3-flash-preview", 
    google_api_key=os.getenv("GEMINI_API_KEY") 
) 
qa_chain = RetrievalQA.from_chain_type(llm=llm, chain_type="stuff", retriever=vectorstore.as_retriever())

# 3. API Endpoint
class QueryRequest(BaseModel):
    question: str

@app.post("/ask")
async def ask_bharat_voice(req: QueryRequest):
    # Instruct the AI to act as the navigator
    prompt = f"Explain this simply to a citizen in plain language, avoiding jargon: {req.question}"
    answer = qa_chain.run(prompt)
    return {"answer": answer}