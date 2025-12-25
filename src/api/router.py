import os
import uuid
from fastapi import APIRouter, File, UploadFile, Depends, HTTPException, Request
from src.api.models.chat_request import ChatRequest
from src.api.models.mode_request import ModeRequest 
from src.rag.rag_engine import RAG_ENGINE
from src.memory.memory import Memory
from src.config.settings import SAVE_JENKINS_UPLOADS
from src.rag.rag_engine import RAG_ENGINE
from src.authorization.deps import get_current_user
from sqlalchemy.orm import Session
from src.database.get_db import get_db_conn
from src.database.chat_msg import ChatMessage
from src.database.db_logging import execute_query
import logging
import time
router = APIRouter()

engine = RAG_ENGINE()
sessions = {}
modes = {}  # session_id → mode

@router.post("/sessions/{session_id}/chat")
def chat_with_ai(session_id: str, body: ChatMessage, current_user = Depends(get_current_user)):
    start_time = time.time()
    
    logging.info(f"[CHAT] User={current_user["id"]} | Session={session_id} | Msg='{body.content}'")

    conn = get_db_conn()
    cur = conn.cursor()

    # --------------------------------------------------
    # 1. VALIDATE SESSION
    # --------------------------------------------------
    execute_query(
        cur,
        "SELECT user_id, mode FROM sessions WHERE id = %s",
        (session_id,)
    )
    session = cur.fetchone()

    if not session:
        logging.warning(f"[CHAT] Invalid session {session_id}")
        raise HTTPException(status_code=404, detail="Session not found")

    if session[0] != current_user["id"]:
        logging.warning(
            f"[AUTH] User {current_user["id"]} attempted access to session owned by {session[0]}"
        )
        raise HTTPException(status_code=403, detail="Not your session")

    session_mode = session[1] or "professional"
    user_msg = body.content
    user_msg_id = str(uuid.uuid4())

    # --------------------------------------------------
    # 2. INSERT USER MESSAGE
    # --------------------------------------------------
    execute_query(
        cur,
        """
        INSERT INTO messages (id, session_id, role, content)
        VALUES (%s, %s, %s, %s)
        """,
        (user_msg_id, session_id, "user", user_msg)
    )
    logging.info(f"[SQL] User message inserted | id={user_msg_id}")

    # --------------------------------------------------
    # 3. FETCH CHAT HISTORY
    # --------------------------------------------------
    execute_query(
        cur,
        """
        SELECT role, content 
        FROM messages
        WHERE session_id = %s
        ORDER BY created_at ASC
        """,
        (session_id,)
    )
    rows = cur.fetchall()
    history = [{"role": r[0], "content": r[1]} for r in rows]

    # --------------------------------------------------
    # 4. RUN RAG ENGINE
    # --------------------------------------------------
    rag_start = time.time()
    answer, meta = engine.answer(
        query=user_msg,
        history=history,
        top_k=5,
        mode=session_mode
    )
    rag_end = time.time()

    logging.info(
        f"[RAG] Session={session_id} | Mode={session_mode} | "
        f"Query='{user_msg[:50]}' | Time={(rag_end - rag_start)*1000:.2f}ms"
        # f"[RAG-META] Chunks={meta['chunks']} | Tokens={meta['tokens']}"
    )

    # --------------------------------------------------
    # 5. SAVE ASSISTANT MESSAGE
    # --------------------------------------------------
    bot_msg_id = str(uuid.uuid4())
    execute_query(
        cur,
        """
        INSERT INTO messages (id, session_id, role, content)
        VALUES (%s, %s, %s, %s)
        """,
        (bot_msg_id, session_id, "assistant", answer)
    )
    logging.info(f"[SQL] Assistant message inserted | id={bot_msg_id}")

    # --------------------------------------------------
    # 6. UPDATE SESSION TIMESTAMP
    # --------------------------------------------------
    execute_query(
        cur,
        "UPDATE sessions SET updated_at = NOW() WHERE id = %s",
        (session_id,)
    )

    conn.commit()
    conn.close()

    # --------------------------------------------------
    # 7. ENDPOINT TIMING LOG
    # --------------------------------------------------
    total_time = (time.time() - start_time) * 1000
    logging.info(
        f"[CHAT-END] Session={session_id} | TotalTime={total_time:.2f}ms\n"
    )
    # raise ValueError("Testing error.log")

    return {
        "content": answer,
    }
    





# @router.post("/ask-ai")
# def ask_ai(request: ChatRequest, current_user = Depends(get_current_user)):
#     session_id = request.session_id
#     query = request.query

#     # Create memory for first-time users
#     if session_id not in sessions:
#         sessions[session_id] = Memory()

#     chat_memory = sessions[session_id]

#     # Get mode (default = "professional")
#     mode = modes.get(session_id, "professional")

#     # Full RAG flow with mode + memory
#     answer = engine.answer(
#         query=query,
#         history=chat_memory,
#         top_k=5,
#         mode=mode
#     )

#     # Save in memory
#     chat_memory.add(query, answer)

#     return {
#         "session_id": session_id,
#         "mode": mode,
#         "answer": answer,
#         "user": current_user.username
#     }

@router.post("/sessions")
def generate_sessions(current_user = Depends(get_current_user)):
    conn = get_db_conn()
    cur = conn.cursor()

    session_id = str(uuid.uuid4())

    cur.execute(
        """
        insert into sessions (id, user_id, title, mode)
        values (%s, %s, %s, %s)
        """,
        (session_id,current_user["id"], "", "professional")
    )

    conn.commit()
    conn.close()
    return {"session_id": session_id, "mode": "professional"}


@router.get("/sessions")
def list_sessions(current_user = Depends(get_current_user)):
    conn = get_db_conn()
    cur = conn.cursor()

    cur.execute(
        """
        select id, title, updated_at
        from sessions
        where user_id = %s
        order by updated_at desc
        """,
        (current_user["id"],)
    )
    rows = cur.fetchall()
    conn.close()

    session_list = [
        {"session_id": r[0], "title":r[1], "updated_at":r[2]}
        for r in rows
    ]

    return session_list


@router.post("/sessions/{session_id}/set-mode")
def set_mode(session_id:str, body: ModeRequest,request:Request, current_user = Depends(get_current_user)):
    # modes[request.session_id] = request.mode
    # return {"status": "mode updated", "mode": request.mode}
    request.state.session_id = session_id
    conn = get_db_conn()
    cur = conn.cursor()

    cur.execute("""
        update sessions set mode = %s where id = %s and user_id = %s
        """,
    (body.mode, session_id, current_user["id"]))

    conn.commit()
    conn.close()

    return{
        "mode":body.mode,
        "message":"Mode Updated"
    }


@router.post("/sessions/{session_id}/upload-pipeline")
async def upload_file(session_id:str, file: UploadFile = File(...), current_user = Depends(get_current_user)):
    allowed_ext = [".groovy",".txt",".md",".log",".json",".yaml",".yml",".adoc",]
    file_name = file.filename
    ext = os.path.splitext(file_name)[1]

    if ext not in allowed_ext:
        return {"error":"Only JenkinsFile, .groovy, .txt files allowed"}
    
    
    os.makedirs(SAVE_JENKINS_UPLOADS, exist_ok=True)

    save_path = SAVE_JENKINS_UPLOADS / file_name

    with open(save_path, "wb") as f:
        f.write(await file.read())

    return{"status":"Uploaded",
           "session_id":session_id,
           "filename":file_name,
           "path":str(save_path)        
    }

@ router.get("/sessions/{session_id}/messages")
def get_messages(session_id: str,current_user = Depends(get_current_user)):
    conn = get_db_conn()
    cur = conn.cursor()

    cur.execute("select user_id from sessions where id = %s",
                (session_id,))
    
    row = cur.fetchone()

    if not row:
        raise HTTPException(status_code=404,detail="Session not found!")
    
    if row[0] != current_user["id"]:
        raise HTTPException(status_code=403,detail="User not found!")
    
    cur.execute(
        """
        select role, content, created_at
        from messages
        where session_id = %s
        order by created_at ASC
        """,
        (session_id,)
    )

    rows = cur.fetchall()

    conn.commit()
    conn.close()
    return [
        {
            "role":r[0],
            "content":r[1],
            "created_at":r[2]
        }
        for r in rows
    ]
# --------------------------------------------- OLD CODE ----------------------------------------------
# router = APIRouter()

# engine = RAG_ENGINE()
# sessions = {}
# modes = {}

# @router.post("/ask-ai")
# def ask_ai(request: ChatRequest):
#     if request.session_id not in sessions:
#         sessions[request.session_id] = Memory()

#     chat_memory = sessions[request.session_id]

#     answer = engine.answer(query=request.query)

#     chat_memory.add(request.query, answer)

#     return {"answer": answer}

# @router.post("/set-mode")
# def set_mode(request: ModeRequest):
#     modes[request.session_id] = request.mode

#     return {"status" : "mode updated"}

# @router.post("/sessions/{session_id}/chat")
# def chat_with_ai(session_id: str, body:ChatMessage, current_user = Depends(get_current_user)):
#     start_time = time.time()
#     logging.info(f"[CHAT] User:{current_user["id"]} | Sessions:{session_id} | Message:{body.content}")


#     conn = get_db_conn()
#     cur = conn.cursor()

#     #  Validate session
#     try:
#         cur.execute("select user_id, mode from sessions where id = %s",(session_id))
#         session = cur.fetchone()
#     except Exception as e:
#         logging.error(f"[SQL ERROR]  Failed SELECT on sessions | {str(e)}")
#         raise HTTPException(status_code=500, detail="DB error")


#     # 1. Validate session exists
#     cur.execute("SELECT user_id, mode FROM sessions WHERE id = %s",(session_id,))
#     session = cur.fetchone()

#     if not session:
#         raise HTTPException(status_code=404, detail="Session not found")
    
#     if session[0] != current_user["id"]:
#         raise HTTPException(status_code=403, detail="Not your session")
    
#     session_mode = session[1] or "professional"

#     user_msg = body.content

#     user_msg_id = str(uuid.uuid4())
    

#     # 2. Insert user message
#     # ------------------------
#     try:
#         cur.execute("""
#             insert into messages (id, session_id, role, content)
#             values (%s, %s, %s, %s)
#         """,(user_msg_id,session_id,"user", user_msg))
#     except Exception as e:
#         logging.error(f"[SQL ERROR] Insert user message failed | {str(e)}")
#         raise HTTPException(status_code=500, detail="DB error")


#     try:
#         cur.execute("""
#             select role, content from messages
#             where session_id = %s order by created_at ASC    
#         """,(session_id))
#     except Exception as e:
#         logging.error(f"[SQL Error] Fetch history failed | {str(e)}")
#         raise HTTPException(status_code=500, detail="DB error")


#     cur.execute(
#          """
#         INSERT INTO messages (id, session_id, role, content)
#         VALUES (%s, %s, %s, %s)
#         """,
#         (user_msg_id, session_id, "user", user_msg)
#     )
    
#     # 3. Load Chat History
#     cur.execute(
#         """
#         select role, content from messages
#         where session_id = %s order by created_at ASC         
#     """,
#     (session_id,)
#     )

#     rows = cur.fetchall()
#     history = [{"role": r[0], "content": r[1]} for r in rows]

#     # 4. Run the Engine
#     rag_start = time.time()
#     answer = engine.answer(
#         query=user_msg,
#         history=history,
#         top_k=5,
#         mode=session_mode
#     )
#     rag_end = time.time()
#     logging.info(
#         f"[RAG] Session:{session_id} | Mode: {session_mode}"
#         f"Query: '{user_msg[:50]}' | Rag TIme: {(rag_end-rag_start) * 1000:.2f}ms"
#     )


#     # 5. Save assistant message
#     bot_msg_id = str(uuid.uuid4())
#     try:
#         cur.execute("""
#             INSERT INTO messages (id, session_id, role, content)
#             VALUES (%s, %s, %s, %s)
#         """, (bot_msg_id, session_id, "assistant", answer))
#         logging.info(f"[SQL] Insert assistant message | id={bot_msg_id}")
#     except Exception as e:
#         logging.error(f"[SQL ERROR] Insert assistant failed | {str(e)}")
#         raise HTTPException(status_code=500, detail="DB error")
    

#     cur.execute(
#         """
#         insert into messages (id, session_id, role, content)
#         values(%s,%s,%s,%s)
#         """,
#         (bot_msg_id,session_id,"assistant",answer)
#     )

#      # 6. Update session timestamp
#     try:
#         cur.execute("UPDATE sessions SET updated_at = NOW() WHERE id = %s", (session_id,))
#     except Exception as e:
#         logging.error(f"[SQL ERROR] Update session timestamp failed | {str(e)}")


#     cur.execute("update sessions set updated_at = NOW() where id = %s",(session_id,))

#     conn.commit()
#     conn.close()

#     total_time = (time.time() - start_time) * 1000
#     logging.info(f"[CHAT END] Sessions:{session_id} | Total Time:{total_time:.2f}ms")

#     return {
#         "session_id":session_id,
#         "answer":answer,
#         "mode":session_mode,
#         "user":current_user.username
#     }
from jose import jwt
from src.database.access_tokens import SECRET_KEY, ALGORITHM
if __name__ == "__main__":
    token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJleHAiOjE3NjY2NTQ4MTJ9.jt92dQH9bXHYERl6cm0-So2byptvaMnawBeTyYnajgU"
    print(jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM]))