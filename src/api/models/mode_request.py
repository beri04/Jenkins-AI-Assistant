from pydantic import BaseModel
class ModeRequest(BaseModel):
    session_id: str
    mode: str