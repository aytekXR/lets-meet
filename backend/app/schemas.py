from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class EventCreate(BaseModel):
    name: str
    description: Optional[str] = None
    creator_name: str
    creator_email: str
    potential_dates: List[str]

class Event(EventCreate):
    id: int
    code: str
    created_at: datetime

    class Config:
        orm_mode = True

class AvailabilityCreate(BaseModel):
    participant_name: str
    participant_email: Optional[str] = None
    available_times: List[str]

class AvailabilityBase(BaseModel):
    participant_name: str
    participant_email: Optional[str] = None
    available_times: List[str]

class Availability(AvailabilityBase):
    id: int
    event_id: int

    class Config:
        orm_mode = True 