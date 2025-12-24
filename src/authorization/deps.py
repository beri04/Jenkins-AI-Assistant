from fastapi import HTTPException, Request, Header, Depends
from jose import jwt, JWTError
import logging
from src.database.get_db import get_db_conn
from src.database.db_logging import execute_query
from src.database.access_tokens import SECRET_KEY, ALGORITHM

def get_current_user(request: Request,Authorization: str = Header(None)):
    """
    Accepts:
    - Raw JWT token
    - OR 'Bearer <token>' (optional)
    - OR no token (dev fallback)
    """

    # -------------------------
    # TOKEN HANDLING
    # -------------------------
    if Authorization:
        token = Authorization.strip()

        # If someone still sends "Bearer xyz", strip it
        if token.lower().startswith("bearer "):
            token = token[7:].strip()

        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            user_id = payload.get("user_id")

            if not user_id:
                raise HTTPException(status_code=401, detail="Invalid token")

        except JWTError as e:
            logging.error(f"[AUTH ERROR] {e}")
            raise HTTPException(status_code=401, detail="Invalid or expired token")

    else:
        # -------------------------
        # DEV MODE FALLBACK
        # -------------------------
        user_id = 1
        logging.warning("[AUTH] No token provided → DEV user_id=1")

    # -------------------------
    # FETCH USER FROM DB
    # -------------------------
    conn = get_db_conn()
    cur = conn.cursor()

    execute_query(
        cur,
        "SELECT id, email, username FROM users WHERE id = %s",
        (user_id,)
    )
    user = cur.fetchone()
    conn.close()

    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    request.state.user_id = user[0]

    return {
        "id": user[0],
        "email": user[1],
        "username":user[2]
    }