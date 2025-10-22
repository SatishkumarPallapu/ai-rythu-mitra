from sqlalchemy import Column, String, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
from backend.config.database import Base

class GeneratedReport(Base):
    __tablename__ = "generated_reports"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String)
    report_type = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    file_url = Column(String) # URL to stored PDF
