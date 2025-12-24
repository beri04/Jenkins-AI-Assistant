from pydantic import BaseModel

class SignupRequest(BaseModel):
    email: str
    username: str
    password: str