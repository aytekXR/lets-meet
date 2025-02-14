from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from . import models, schemas, database
from datetime import datetime, timedelta
from fastapi.responses import Response
from icalendar import Calendar, Event as CalendarEvent
import random
import string

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables
models.Base.metadata.create_all(bind=database.engine)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

def generate_event_code():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

@app.post("/api/events", response_model=schemas.Event)
def create_event(event: schemas.EventCreate, db: Session = Depends(get_db)):
    db_event = models.Event(
        code=generate_event_code(),
        name=event.name,
        description=event.description,
        creator_name=event.creator_name,
        creator_email=event.creator_email,
        potential_dates=event.potential_dates,
        created_at=datetime.now()
    )
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

@app.get("/api/events/{event_code}", response_model=schemas.Event)
def get_event(event_code: str, db: Session = Depends(get_db)):
    event = db.query(models.Event).filter(models.Event.code == event_code).first()
    if event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    return event

@app.post("/api/events/{event_code}/availability")
def submit_availability(
    event_code: str,
    availability: schemas.AvailabilityCreate,
    db: Session = Depends(get_db)
):
    event = db.query(models.Event).filter(models.Event.code == event_code).first()
    if event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    
    db_availability = models.Availability(
        event_id=event.id,
        participant_name=availability.participant_name,
        participant_email=availability.participant_email,
        available_times=availability.available_times
    )
    db.add(db_availability)
    db.commit()
    return {"message": "Availability submitted successfully"}

@app.get("/api/events/{event_code}/stats")
def get_event_stats(event_code: str, db: Session = Depends(get_db)):
    event = db.query(models.Event).filter(models.Event.code == event_code).first()
    if event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    
    availabilities = event.availabilities
    total_responses = len(availabilities)
    
    # Calculate most popular time
    time_counts = {}
    for availability in availabilities:
        for time in availability.available_times:
            time_counts[time] = time_counts.get(time, 0) + 1
    
    most_popular_time = max(time_counts.items(), key=lambda x: x[1])[0] if time_counts else None
    available_people = max(time_counts.values()) if time_counts else 0
    
    return {
        "total_responses": total_responses,
        "most_popular_time": most_popular_time,
        "available_people": available_people
    }

@app.get("/api/events/{event_code}/calendar-file")
def get_calendar_file(event_code: str, db: Session = Depends(get_db)):
    event = db.query(models.Event).filter(models.Event.code == event_code).first()
    if event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    
    # Create calendar event
    cal = Calendar()
    cal.add('prodid', '-//Let\'s Meet Calendar//letsmeet.app//')
    cal.add('version', '2.0')

    # Get the most popular time
    availabilities = event.availabilities
    time_counts = {}
    for availability in availabilities:
        for time in availability.available_times:
            time_counts[time] = time_counts.get(time, 0) + 1
    
    most_popular_time = max(time_counts.items(), key=lambda x: x[1])[0] if time_counts else None
    
    if most_popular_time:
        cal_event = CalendarEvent()
        cal_event.add('summary', event.name)
        cal_event.add('description', event.description or '')
        
        # Parse the most popular time
        event_start = datetime.fromisoformat(most_popular_time.replace('Z', '+00:00'))
        event_end = event_start + timedelta(hours=1)  # Default 1-hour duration
        
        cal_event.add('dtstart', event_start)
        cal_event.add('dtend', event_end)
        cal_event.add('dtstamp', datetime.utcnow())
        cal_event.add('uid', f'letsmeet-{event.code}@yourdomain.com')
        
        cal.add_component(cal_event)

    # Generate the .ics file content
    calendar_data = cal.to_ical()
    
    # Return the calendar file with proper headers
    return Response(
        content=calendar_data,
        media_type="text/calendar",
        headers={
            "Content-Disposition": f"attachment; filename={event.name.replace(' ', '_')}.ics"
        }
    ) 