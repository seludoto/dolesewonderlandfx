"""
Email service for DoleSe Wonderland FX platform.
Handles email notifications, newsletters, and user communications.
"""

from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any
import json
import asyncio
from pydantic import BaseModel, EmailStr
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import sqlite3
from contextlib import contextmanager
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="DoleSe Wonderland FX - Email Service",
    description="Email notifications and communication service",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Email configuration (use environment variables in production)
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USERNAME = os.getenv("SMTP_USERNAME", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
FROM_EMAIL = os.getenv("FROM_EMAIL", "noreply@dolesewonderlandfx.com")

# Pydantic models
class SendEmailRequest(BaseModel):
    to_email: EmailStr
    subject: str
    body: str
    body_type: str = "html"  # 'html' or 'text'
    priority: str = "normal"  # 'low', 'normal', 'high'

class BulkEmailRequest(BaseModel):
    to_emails: List[EmailStr]
    subject: str
    body: str
    body_type: str = "html"
    priority: str = "normal"

class NewsletterRequest(BaseModel):
    subject: str
    content: str
    recipient_groups: List[str]  # ['all', 'active_users', 'instructors', 'subscribers']
    scheduled_time: Optional[datetime] = None

class TemplateEmailRequest(BaseModel):
    template_name: str
    to_email: EmailStr
    template_data: Dict[str, Any]
    priority: str = "normal"

# Database connection
@contextmanager
def get_db():
    """Database connection context manager."""
    db_path = os.path.join(os.path.dirname(__file__), "../../data/app.db")
    conn = sqlite3.connect(db_path)
    try:
        yield conn
    finally:
        conn.close()

# Email templates
EMAIL_TEMPLATES = {
    "welcome": {
        "subject": "Welcome to DoleSe Wonderland FX!",
        "html_body": """
        <html>
        <body>
            <h1>Welcome to DoleSe Wonderland FX, {{name}}!</h1>
            <p>Thank you for joining our trading community.</p>
            <p>Your account has been successfully created and you can now:</p>
            <ul>
                <li>Access our comprehensive trading courses</li>
                <li>Practice with paper trading</li>
                <li>Connect with fellow traders</li>
                <li>Receive market insights and analysis</li>
            </ul>
            <p>Get started: <a href="{{login_url}}">Login to your account</a></p>
            <p>Best regards,<br>The DoleSe Wonderland FX Team</p>
        </body>
        </html>
        """
    },
    "password_reset": {
        "subject": "Password Reset Request",
        "html_body": """
        <html>
        <body>
            <h1>Password Reset Request</h1>
            <p>Hello {{name}},</p>
            <p>You requested a password reset for your DoleSe Wonderland FX account.</p>
            <p>Click the link below to reset your password:</p>
            <p><a href="{{reset_url}}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this reset, please ignore this email.</p>
            <p>Best regards,<br>The DoleSe Wonderland FX Team</p>
        </body>
        </html>
        """
    },
    "trade_alert": {
        "subject": "Trade Alert: {{symbol}}",
        "html_body": """
        <html>
        <body>
            <h1>Trade Alert</h1>
            <p>Hello {{name}},</p>
            <p>A significant trading opportunity has been detected:</p>
            <div style="background-color: #f0f0f0; padding: 20px; border-radius: 5px;">
                <h2>{{symbol}} - {{action}}</h2>
                <p><strong>Entry Price:</strong> {{entry_price}}</p>
                <p><strong>Stop Loss:</strong> {{stop_loss}}</p>
                <p><strong>Take Profit:</strong> {{take_profit}}</p>
                <p><strong>Reason:</strong> {{reason}}</p>
                <p><strong>Confidence:</strong> {{confidence}}%</p>
            </div>
            <p>Remember to always use proper risk management.</p>
            <p>Happy trading!</p>
        </body>
        </html>
        """
    },
    "weekly_insights": {
        "subject": "Weekly Market Insights",
        "html_body": """
        <html>
        <body>
            <h1>Weekly Market Insights</h1>
            <p>Hello {{name}},</p>
            <p>Here's your weekly market analysis and trading insights:</p>

            <h2>Market Overview</h2>
            <p>{{market_overview}}</p>

            <h2>Key Opportunities</h2>
            <ul>
                {{opportunities}}
            </ul>

            <h2>Risk Warnings</h2>
            <ul>
                {{risk_warnings}}
            </ul>

            <h2>Educational Content</h2>
            <p>{{educational_content}}</p>

            <p>Stay informed and trade wisely!</p>
            <p>The DoleSe Wonderland FX Team</p>
        </body>
        </html>
        """
    }
}

async def send_email_smtp(to_email: str, subject: str, body: str, body_type: str = "html", priority: str = "normal"):
    """Send email using SMTP."""
    try:
        # Create message
        msg = MIMEMultipart()
        msg['From'] = FROM_EMAIL
        msg['To'] = to_email
        msg['Subject'] = subject

        # Set priority
        if priority == "high":
            msg['X-Priority'] = '1'
        elif priority == "low":
            msg['X-Priority'] = '5'

        # Attach body
        if body_type == "html":
            msg.attach(MIMEText(body, 'html'))
        else:
            msg.attach(MIMEText(body, 'plain'))

        # Send email (mock implementation - replace with actual SMTP in production)
        logger.info(f"Email sent to {to_email}: {subject}")

        # In production, uncomment and configure:
        # server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        # server.starttls()
        # server.login(SMTP_USERNAME, SMTP_PASSWORD)
        # server.send_message(msg)
        # server.quit()

        return {"status": "sent", "to": to_email, "subject": subject}

    except Exception as e:
        logger.error(f"Failed to send email to {to_email}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Email sending failed: {str(e)}")

async def render_template(template_name: str, template_data: Dict[str, Any]) -> Dict[str, str]:
    """Render email template with data."""
    if template_name not in EMAIL_TEMPLATES:
        raise HTTPException(status_code=404, detail=f"Template '{template_name}' not found")

    template = EMAIL_TEMPLATES[template_name]

    # Simple template rendering (use Jinja2 in production)
    subject = template["subject"]
    body = template["html_body"]

    for key, value in template_data.items():
        subject = subject.replace(f"{{{{key}}}}", str(value))
        body = body.replace(f"{{{{key}}}}", str(value))

    return {"subject": subject, "body": body}

async def get_recipients_by_group(group: str) -> List[str]:
    """Get email addresses for a recipient group."""
    # Mock implementation - replace with database queries
    groups = {
        "all": ["user1@example.com", "user2@example.com"],
        "active_users": ["active1@example.com", "active2@example.com"],
        "instructors": ["instructor1@example.com"],
        "subscribers": ["subscriber1@example.com", "subscriber2@example.com"]
    }

    return groups.get(group, [])

# API endpoints
@app.post("/api/v1/email/send")
async def send_single_email(request: SendEmailRequest, background_tasks: BackgroundTasks):
    """Send a single email."""
    result = await send_email_smtp(
        request.to_email,
        request.subject,
        request.body,
        request.body_type,
        request.priority
    )

    # Log email in database
    background_tasks.add_task(log_email, request.to_email, request.subject, "sent")

    return {"message": "Email sent successfully", "details": result}

@app.post("/api/v1/email/send-bulk")
async def send_bulk_email(request: BulkEmailRequest, background_tasks: BackgroundTasks):
    """Send bulk email to multiple recipients."""
    results = []

    for email in request.to_emails:
        try:
            result = await send_email_smtp(
                email,
                request.subject,
                request.body,
                request.body_type,
                request.priority
            )
            results.append({"email": email, "status": "sent"})
        except Exception as e:
            results.append({"email": email, "status": "failed", "error": str(e)})

    # Log bulk email
    background_tasks.add_task(log_bulk_email, len(request.to_emails), request.subject, len([r for r in results if r["status"] == "sent"]))

    return {"message": "Bulk email sent", "results": results}

@app.post("/api/v1/email/send-template")
async def send_template_email(request: TemplateEmailRequest, background_tasks: BackgroundTasks):
    """Send email using a template."""
    template_result = await render_template(request.template_name, request.template_data)

    result = await send_email_smtp(
        request.to_email,
        template_result["subject"],
        template_result["body"],
        "html",
        request.priority
    )

    # Log template email
    background_tasks.add_task(log_email, request.to_email, template_result["subject"], "sent")

    return {"message": "Template email sent successfully", "details": result}

@app.post("/api/v1/email/newsletter")
async def send_newsletter(request: NewsletterRequest, background_tasks: BackgroundTasks):
    """Send newsletter to recipient groups."""
    all_recipients = []

    for group in request.recipient_groups:
        recipients = await get_recipients_by_group(group)
        all_recipients.extend(recipients)

    # Remove duplicates
    all_recipients = list(set(all_recipients))

    if not all_recipients:
        raise HTTPException(status_code=400, detail="No recipients found for specified groups")

    # Schedule or send immediately
    if request.scheduled_time and request.scheduled_time > datetime.utcnow():
        # Schedule for later (mock implementation)
        background_tasks.add_task(schedule_newsletter, request, all_recipients)
        return {"message": f"Newsletter scheduled for {request.scheduled_time}", "recipients": len(all_recipients)}
    else:
        # Send immediately
        results = []
        for email in all_recipients:
            try:
                result = await send_email_smtp(email, request.subject, request.content, "html")
                results.append({"email": email, "status": "sent"})
            except Exception as e:
                results.append({"email": email, "status": "failed", "error": str(e)})

        background_tasks.add_task(log_newsletter, request.subject, len(all_recipients), len([r for r in results if r["status"] == "sent"]))

        return {"message": "Newsletter sent", "recipients": len(all_recipients), "results": results}

@app.get("/api/v1/email/templates")
async def list_templates():
    """List available email templates."""
    return {
        "templates": [
            {
                "name": name,
                "subject": template["subject"],
                "description": f"Template for {name.replace('_', ' ')}"
            }
            for name, template in EMAIL_TEMPLATES.items()
        ]
    }

@app.get("/api/v1/email/stats")
async def get_email_stats():
    """Get email sending statistics."""
    # Mock statistics - replace with database queries
    return {
        "total_sent_today": 150,
        "total_sent_week": 1050,
        "total_sent_month": 4200,
        "bounce_rate": 0.02,
        "open_rate": 0.35,
        "click_rate": 0.12,
        "templates_used": list(EMAIL_TEMPLATES.keys())
    }

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "email",
        "smtp_configured": bool(SMTP_USERNAME and SMTP_PASSWORD)
    }

# Background tasks
async def log_email(to_email: str, subject: str, status: str):
    """Log email sending in database."""
    # TODO: Implement database logging
    logger.info(f"Logged email: {to_email} - {subject} - {status}")

async def log_bulk_email(recipient_count: int, subject: str, sent_count: int):
    """Log bulk email sending."""
    logger.info(f"Logged bulk email: {subject} - {sent_count}/{recipient_count} sent")

async def log_newsletter(subject: str, recipient_count: int, sent_count: int):
    """Log newsletter sending."""
    logger.info(f"Logged newsletter: {subject} - {sent_count}/{recipient_count} sent")

async def schedule_newsletter(request: NewsletterRequest, recipients: List[str]):
    """Schedule newsletter for later sending."""
    # Mock scheduling - implement with task queue in production
    logger.info(f"Newsletter scheduled: {request.subject} for {len(recipients)} recipients")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8006)