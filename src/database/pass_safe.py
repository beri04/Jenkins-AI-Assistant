# src/database/pass_safe.py

from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

# Hash password before saving to DB
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

# Verify password during login
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)
