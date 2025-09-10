from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from app.utils.jwt_handler import verify_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

async def authenticate(token: str = Depends(oauth2_scheme)):
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    return payload
