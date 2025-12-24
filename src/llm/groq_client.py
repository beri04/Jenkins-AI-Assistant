from dotenv import load_dotenv
from groq import Groq
import os
load_dotenv()

class GroqClient:
    def __init__(self):
        self.api_key = os.getenv('GROQ_API_KEY')
        self.client = Groq(api_key=self.api_key)


    def generate(self, system_prompt: str, user_prompt: str, model="llama-3.1-8b-instant", temperature=0.6):
        try:
            messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
            ]
            response = self.client.chat.completions.create(
                model = model,
                messages =messages  ,
                temperature = temperature
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"\n [ERROR] LLM error: {e}")
            return "Error: Failed to generate response from Groq."