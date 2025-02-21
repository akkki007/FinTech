import os
import fitz  # PyMuPDF
from dotenv import load_dotenv
from fastapi import FastAPI
from pydantic import BaseModel
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_ollama import OllamaEmbeddings, OllamaLLM
from langchain_community.vectorstores import FAISS
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains import create_retrieval_chain

# Load environment variables
load_dotenv()
os.environ["LANGCHAIN_TRACING_V2"] = "true"

# Load and preprocess the document
PDF_PATH = "data_training.pdf"  # Make sure this PDF is in the same directory

def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    text = "\n".join([page.get_text("text") for page in doc])
    return text

def initialize_retriever():
    if not os.path.exists(PDF_PATH):
        raise FileNotFoundError(f"PDF file '{PDF_PATH}' not found.")
    
    text = extract_text_from_pdf(PDF_PATH)
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1500, chunk_overlap=500)
    texts = text_splitter.create_documents([text])

    embed = OllamaEmbeddings(model="llama3.1")
    db = FAISS.from_documents(texts, embed)
    return db.as_retriever()

retriever = initialize_retriever()

# Define prompt template
prompt = ChatPromptTemplate.from_template(
    """Based on the {context} provided, please answer the following question:
    Question: {input}
    Answer:"""
)

# Initialize model
model = OllamaLLM(model='llama3.1')

# Create document retrieval and processing chains
combine_docs_chain = create_stuff_documents_chain(model, prompt)
retrieval_chain = create_retrieval_chain(retriever, combine_docs_chain)

# Create FastAPI instance
app = FastAPI()

class QueryRequest(BaseModel):
    query: str

@app.post("/ask")
async def ask_question(request: QueryRequest):
    result = retrieval_chain.invoke({'input': request.query})
    return {"answer": result["answer"]}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
