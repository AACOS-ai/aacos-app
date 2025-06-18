import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from qdrant_client import QdrantClient
import psycopg2
from openai import OpenAI

# טען משתני סביבה
load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
print("OpenAI KEY Loaded?", api_key is not None)
client = OpenAI(api_key=api_key)

app = FastAPI()
qdrant = QdrantClient(host="localhost", port=6333)

# דגם לקלט מהמשתמש
class GPTRequest(BaseModel):
    user_message: str

@app.get("/")
def root():
    return {"msg": "AACOS API is alive"}

# שאר ה-endpoints...

@app.post("/gpt")
def gpt_dynamic(request: GPTRequest):
    try:
        if not api_key:
            return JSONResponse(content={"error": "OpenAI API key missing!"}, status_code=500)
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": request.user_message}]
        )
        return {"gpt_response": response.choices[0].message.content}
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
