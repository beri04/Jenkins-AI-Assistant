from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from src.database.postgres_db import get_db, Users
from src.database.signup import SignupRequest
from src.database.token_response import TokenResponse
from src.database.pass_safe import hash_password, verify_password
from src.database.access_tokens import create_access_token
from src.database.token_resp import TokenResponse
from src.database.login import LoginRequest
from src.authorization.deps import get_current_user

router = APIRouter()

@router.post("/signup")
def signup_user(payload: SignupRequest, db: Session = Depends(get_db)):

    print("DEBUG → Received password:", payload.password)
    
    user_exists = db.query(Users).filter(Users.email == payload.email).first()

    if user_exists:
        raise HTTPException(status_code=400,detail="User Already Exists")
    
    hashed_pass = hash_password(payload.password)

    new_user = Users(email = payload.email, username = payload.username,password_hash = hashed_pass)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message":"User Created Successfully"}

@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(Users).filter(Users.email == payload.email).first()

    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=400,detail="Invalid email or password")
    
    token = create_access_token({"user_id": user.id})

    return TokenResponse(access_token=token,token_type="bearer")

@router.get("/me")
def get_me(current_user = Depends(get_current_user)):
    return {
        "id": current_user["id"],
        "email":current_user["email"],
        "username":current_user["username"]
    }