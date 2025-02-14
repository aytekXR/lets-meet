from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime

class EventBase(BaseModel):
    name: str
    description: Optional[str] = None
    creator_name: str
    creator_email: str
    potential_dates: List[str]

class EventCreate(EventBase):
    pass

class Event(EventBase):
    id: int
    code: str
    created_at: datetime

    class Config:
        orm_mode = True

class AvailabilityBase(BaseModel):
    participant_name: str
    participant_email: Optional[str] = None
    available_times: List[str]

class AvailabilityCreate(AvailabilityBase):
    pass

class Availability(AvailabilityBase):
    id: int
    event_id: int

    class Config:
        orm_mode = True 