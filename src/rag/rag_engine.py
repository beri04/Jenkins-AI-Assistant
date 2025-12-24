from src.embeddings.embedder import EmbeddingGenerator
from src.rag import prompt
import os
from src.llm.groq_client import GroqClient
from dotenv import load_dotenv
load_dotenv()
class RAG_ENGINE:
    def __init__(self):
        self.embedder = EmbeddingGenerator()
        self.llm = GroqClient()

    # ---------------------------
    # RETRIEVAL
    # ---------------------------
    def retrieve(self, query, top_k=5):
        try:
            chunks = self.embedder.search(query, top_k)
            return chunks if chunks else []
        except Exception as e:
            print("FAISS Retrieval Error:", e)
            return []

    # ---------------------------
    # PROMPT BUILDER
    # ---------------------------
    def build_prompt(self, context, query, mode):
        MODE_MAP = {
            "friendly": prompt.FRIENDLY_PROMPT,
            "professional": prompt.PROFESSIONAL_PROMPT,
            "rude": prompt.RUDE_DEVOPS_PROMPT,
            "teaching": prompt.TEACHING_PROMPT,
            "hinglish": prompt.HINGLISH_PROMPT,
        }

        system_prompt = MODE_MAP.get(mode, prompt.PROFESSIONAL_PROMPT)

        user_prompt = f"""
            use only the context below to answer the questions
            Context:
            {context}

            Question:
            {query}

            """
        return system_prompt, user_prompt
    # ---------------------------
    # FINAL ANSWER
    # ---------------------------
    def answer(self, query, history=None, top_k=5, mode="professional"):
        # 1) Retrieve context
        chunks = self.retrieve(query, top_k)
        context = "\n\n".join([c["text"] for c in chunks]) if chunks else "No relevant context found."

        # 2) Build initial prompt
        system_prompt, user_prompt = self.build_prompt(context, query, mode)

        # 3) Add memory support
        if history:
            try:
                past = history.as_string()
                user_prompt = past + "\n\n" + user_prompt
            except:
                pass
        
        meta = {
            "mode": mode,
            "top_k": top_k,
            "chunks_used": len(chunks),
            "sources": [
                c.get("source") for c in chunks if isinstance(c, dict)
            ]
        }

        # 4) Call Groq
        return self.llm.generate(system_prompt, user_prompt),meta
    


# --------------------------------------- OLD CODE ------------------------------------------------

# class RAG_ENGINE():
#     def __init__(self):
#         self.embedder = EmbeddingGenerator()
#         self.llm = GroqClient()

#     def retrieve(self,query,top_k = 5):
#         return self.embedder.search(query,top_k)
    
#     def build_prompt(self,context,query,mode):
#         if mode == "1":
#             return prompt.FRIENDLY_PROMPT.format(context = context, query = query)
#         elif mode == "2":
#             return prompt.PROFESSIONAL_PROMPT.format(context = context, query = query)
#         elif mode == "3":
#             return prompt.RUDE_DEVOPS_PROMPT.format(context = context, query = query)
#         elif mode == "4":
#             return prompt.TEACHING_PROMPT.format(context = context, query = query)
#         elif mode == "5":
#             return prompt.HINGLISH_PROMPT.format(context = context, query = query)
        
#         return prompt.PROFESSIONAL_PROMPT.format(context = context, query = query)
        

#     # def build_context(self,chunks):
#     #     return "\n\n".join([c["text"] for c in chunks])
#     def answer(self,query,top_k=1,mode = "professional"):
#         chunks = self.retrieve(query,top_k)
#         context = "\n\n".join([c["text"] for c in chunks])

#         # prompt = f"""
#         #     You are a friendly and highly relatable Jenkins Expert.
#         #     Think of yourself as the user’s DevOps teammate — someone who explains things simply, 
#         #     helps them debug issues, and never talks down to them.

#         #     Your goal is to make Jenkins easy, clear, and stress-free for the user.

#         #     IMPORTANT:
#         #     Use ONLY the context provided. If the context does not contain the answer, 
#         #     clearly say so and guide the user on what information or logs they should share next.

#         #     CONTEXT:
#         #     {context}

#         #     QUESTION:
#         #     {query}

#         #     BEHAVIOR RULES:
#         #     1. Speak in a friendly, calm, and encouraging tone — like you're helping a colleague.
#         #     2. Give short, clear, step-by-step answers. No long theory unless user asks.
#         #     3. If the user mentions an issue without showing logs, politely ask for logs.
#         #     Example: "Can you paste the pipeline logs here so I can point out the exact issue?"
#         #     4. If the question is about pipeline failures, agents offline, missing plugins, 
#         #     or permission issues — ALWAYS ask for logs.
#         #     5. If context is missing the answer, never guess. Say it honestly and guide them.
#         #     6. At the end, give:
#         #     - one helpful extra tip related to their issue, AND
#         #     - ask if they need help with anything else.

#         #     Voice & Personality:
#         #     - Friendly
#         #     - Human-like
#         #     - Supportive
#         #     - Clear
#         #     - Zero attitude
#         #     - Encouraging
#         #     - No jargon unless required

#         # """
#         prompt = self.build_prompt(context,query,mode)

#         # response = self.client.chat.completions.create(
#         #     model = "llama-3.1-8b-instant",
#         #     messages = [{"role":"user", "content":prompt}],
#         #     temperature = 0.6
#         # )

#         # # return {
#         # #     "answer":response.choices[0].message.content
#         # # }
#         # return response.choices[0].message.content
#         return self.llm.generate(prompt)
# # if __name__ == "__main__":
# #     engine = RAG_ENGINE()
# #     print(engine.answer("I have issues in the jenkinsfile in the build stage where pyhton creates a problem."))