from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, ARRAY
from sqlalchemy.orm import relationship
from .database import Base

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True)
    name = Column(String)
    description = Column(String, nullable=True)
    creator_name = Column(String)
    creator_email = Column(String)
    potential_dates = Column(ARRAY(String))
    created_at = Column(DateTime)
    availabilities = relationship("Availability", back_populates="event")

class Availability(Base):
    __tablename__ = "availabilities"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("events.id"))
    participant_name = Column(String)
    participant_email = Column(String, nullable=True)
    available_times = Column(ARRAY(String))
    event = relationship("Event", back_populates="availabilities") 