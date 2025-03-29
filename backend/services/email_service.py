from typing import Optional
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from ..config import settings
import logging
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig

logger = logging.getLogger(__name__)

class EmailService:
    def __init__(self):
        self.conf = ConnectionConfig(
            MAIL_USERNAME=settings.MAIL_USERNAME,
            MAIL_PASSWORD=settings.MAIL_PASSWORD,
            MAIL_FROM=settings.MAIL_FROM,
            MAIL_PORT=settings.MAIL_PORT,
            MAIL_SERVER=settings.MAIL_SERVER,
            MAIL_TLS=settings.MAIL_TLS,
            MAIL_SSL=settings.MAIL_SSL,
            USE_CREDENTIALS=True
        )
        self.fastmail = FastMail(self.conf)

    async def send_verification_email(self, email: str, token: str):
        """发送验证邮件"""
        try:
            verification_url = f"{settings.FRONTEND_URL}/verify-email?token={token}"
            message = MessageSchema(
                subject="验证您的邮箱",
                recipients=[email],
                body=f"""
                <html>
                    <body>
                        <h1>欢迎加入我们的平台！</h1>
                        <p>请点击下面的链接验证您的邮箱：</p>
                        <p><a href="{verification_url}">验证邮箱</a></p>
                        <p>如果您没有注册账号，请忽略此邮件。</p>
                        <p>此链接将在24小时后失效。</p>
                    </body>
                </html>
                """,
                subtype="html"
            )
            await self.fastmail.send_message(message)
            logger.info(f"Verification email sent to {email}")
        except Exception as e:
            logger.error(f"Failed to send verification email: {str(e)}")
            raise

    async def send_password_reset_email(self, email: str, token: str):
        """发送密码重置邮件"""
        try:
            reset_url = f"{settings.FRONTEND_URL}/reset-password?token={token}"
            message = MessageSchema(
                subject="重置密码",
                recipients=[email],
                body=f"""
                <html>
                    <body>
                        <h1>密码重置请求</h1>
                        <p>您请求重置密码，请点击下面的链接：</p>
                        <p><a href="{reset_url}">重置密码</a></p>
                        <p>如果您没有请求重置密码，请忽略此邮件。</p>
                        <p>此链接将在1小时后失效。</p>
                    </body>
                </html>
                """,
                subtype="html"
            )
            await self.fastmail.send_message(message)
            logger.info(f"Password reset email sent to {email}")
        except Exception as e:
            logger.error(f"Failed to send password reset email: {str(e)}")
            raise

    async def send_notification_email(self, to_email: str, subject: str, content: str) -> bool:
        """发送通知邮件"""
        try:
            msg = MIMEMultipart()
            msg['From'] = self.from_email
            msg['To'] = to_email
            msg['Subject'] = subject

            msg.attach(MIMEText(content, 'plain'))

            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_username, self.smtp_password)
                server.send_message(msg)

            return True
        except Exception as e:
            logger.error(f"Failed to send notification email: {str(e)}")
            return False 