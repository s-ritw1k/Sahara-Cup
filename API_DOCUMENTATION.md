# Knockout Tournament API Documentation

## Overview
The Knockout Tournament API allows you to manage live matches, set match results and scores, and automatically update the tournament bracket. The system uses real-time WebSocket connections to broadcast updates to all connected clients.

## Base URL
```
http://localhost:3001/api
```

## Authentication
All admin endpoints require username and password in the request body:
```json
{
  "username": "admin",
  "password": "admin123"
}
```

## Public Endpoints

### Get Knockout Bracket
```http
GET /api/knockout
```
Returns the current knockout bracket with all matches and their status.

**Response:**
```json
[
  {
    "id": "ko1",
    "round": "round16",
    "matchNumber": 1,
    "player1Id": "p21",
    "player2Id": "p1",
    "player1Score": 0,
    "player2Score": 0,
    "status": "upcoming",
    "winnerId": null,
    "player1Source": { "type": "group", "value": "g1" },
    "player2Source": { "type": "group", "value": "g2" }
  }
]
```

### Get Qualified Players
```http
GET /api/knockout/qualified-players
```
Returns the qualified players from each group (winner and runner-up).

**Response:**
```json
{
  "g1": { "winner": "p21", "runnerUp": "p5" },
  "g2": { "winner": "p13", "runnerUp": "p1" }
}
```

## Admin Endpoints

### Start a Knockout Match
```http
POST /api/admin/knockout/{matchId}/start
```

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:** Updated match object with status "live"

### Update Match Score and Status
```http
PUT /api/admin/knockout/{matchId}
```

**Request Body:**
```json
{
  "player1Score": 3,
  "player2Score": 1,
  "status": "completed",
  "username": "admin",
  "password": "admin123"
}
```

**Response:** Updated match object with winner determined

### Manually Set Match Players
```http
PUT /api/admin/knockout/{matchId}/players
```

**Request Body:**
```json
{
  "player1Id": "p21",
  "player2Id": "p13",
  "username": "admin",
  "password": "admin123"
}
```

**Response:** Updated match object with new players

## Match Status Values
- `"upcoming"` - Match not yet started
- `"live"` - Match currently in progress
- `"completed"` - Match finished with final score

## Round Values
- `"round16"` - Round of 16 (4 matches)
- `"quarterfinal"` - Quarter Finals (2 matches) 
- `"semifinal"` - Semi Finals (1 match)
- `"final"` - Championship Final (1 match)

## Real-time Updates
The system broadcasts the following WebSocket events:
- `knockoutMatchUpdated` - When a match is updated
- `knockoutBracketUpdated` - When the entire bracket changes

## Example Usage

### 1. Start a Round 16 Match
```bash
curl -X POST http://localhost:3001/api/admin/knockout/ko1/start \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

### 2. Update Live Match Score
```bash
curl -X PUT http://localhost:3001/api/admin/knockout/ko1 \
  -H "Content-Type: application/json" \
  -d '{
    "player1Score": 2,
    "player2Score": 1,
    "status": "live",
    "username": "admin",
    "password": "admin123"
  }'
```

### 3. Complete a Match
```bash
curl -X PUT http://localhost:3001/api/admin/knockout/ko1 \
  -H "Content-Type: application/json" \
  -d '{
    "player1Score": 3,
    "player2Score": 1,
    "status": "completed",
    "username": "admin",
    "password": "admin123"
  }'
```

### 4. View Current Bracket
```bash
curl http://localhost:3001/api/knockout
```

## Frontend Components

### Knockout Viewer (`/knockout`)
- Displays live tournament bracket
- Shows current live matches with scores
- Updates automatically via WebSocket
- Responsive design for all devices

### Admin Panel (`/knockout-admin`)
- Full match management interface
- Start/stop matches
- Update scores in real-time
- Manually set players if needed
- Live status indicators

## Automatic Bracket Progression
The system automatically:
1. Updates qualified players based on group standings
2. Advances winners to next round when matches complete
3. Determines final champion when championship match ends
4. Broadcasts all changes to connected clients in real-time

## Error Handling
All endpoints return appropriate HTTP status codes:
- `200` - Success
- `400` - Bad request (invalid data)
- `401` - Unauthorized (invalid credentials)
- `404` - Not found (match doesn't exist)
- `500` - Server error
