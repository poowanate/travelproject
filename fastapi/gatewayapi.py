from fastapi import FastAPI, Query
import httpx
from fastapi.responses import JSONResponse
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
origins = [
    
    "http://localhost",
    "http://localhost:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# URL of the JSON Server
json_server_url = "http://localhost:9000"

# Helper function to search through trips
def filter_trips(trips, search_query: str):
    filtered_trips = []
    for trip in trips:
        # Search in title, description, and tags
        if (search_query.lower() in trip["title"].lower() or
            search_query.lower() in trip["description"].lower() or
            any(search_query.lower() in tag.lower() for tag in trip["tags"])):
            filtered_trips.append(trip)
    return filtered_trips

@app.get("/api/trips")
async def get_trips(keyword: Optional[str] = Query(None, min_length=3)):
    # Fetch trips data from JSON Server
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{json_server_url}/trips")
        
        if response.status_code == 200:
            trips = response.json()
            
            # If search query is provided, filter trips based on the query
            if keyword:
                trips = filter_trips(trips, keyword)
            
            return JSONResponse(content=trips)
        else:
            return {"error": "Failed to fetch data from JSON Server"}
