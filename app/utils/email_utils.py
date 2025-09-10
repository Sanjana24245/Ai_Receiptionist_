import smtplib
from email.mime.text import MIMEText
from app.config import EMAIL_USER, EMAIL_PASS
import asyncio

async def send_otp(email: str, otp: str):
    def send_email():
        msg = MIMEText(f"Your OTP is {otp}. It will expire in 10 minutes.")
        msg["Subject"] = "OTP Verification"
        msg["From"] = EMAIL_USER
        msg["To"] = email

        try:
            with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
                server.login(EMAIL_USER, EMAIL_PASS)
                server.sendmail(EMAIL_USER, email, msg.as_string())
        except Exception as e:
            print("Failed to send OTP:", e)
            raise

    await asyncio.to_thread(send_email)
