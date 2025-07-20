# Sahara Cup API Usage Guide

The admin login UI has been removed. All admin operations now require username and password to be included directly in the API request body.

## Admin Credentials
- **Username**: `admin`
- **Password**: `admin123`

## Admin API Endpoints

### Update Match Score and Status
Update match scores and change match status (upcoming → live → completed).

**Endpoint**: `PUT /api/admin/matches/:matchId`

**Request Body**:
```json
{
  "username": "admin",
  "password": "admin123",
  "player1Score": 3,
  "player2Score": 1,
  "status": "completed"
}
```

**Example using curl**:
```bash
curl -X PUT http://localhost:3001/api/admin/matches/match1 \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123",
    "player1Score": 3,
    "player2Score": 1,
    "status": "completed"
  }'
```

### Start a Match
Change match status from "upcoming" to "live".

**Endpoint**: `POST /api/admin/matches/:matchId/start`

**Request Body**:
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Example using curl**:
```bash
curl -X POST http://localhost:3001/api/admin/matches/match1/start \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

## Response Format

**Success Response**:
```json
{
  "id": "match1",
  "player1Id": "player1",
  "player2Id": "player2",
  "player1Score": 3,
  "player2Score": 1,
  "status": "completed",
  "winnerId": "player1",
  "scheduledTime": "2025-01-15T10:00:00Z",
  "groupId": "groupA",
  "round": 1
}
```

**Error Response** (Invalid credentials):
```json
{
  "message": "Invalid credentials"
}
```

**Error Response** (Missing credentials):
```json
{
  "message": "Username and password required in request body"
}
```

## Match Status Values
- `"upcoming"` - Match not yet started
- `"live"` - Match currently in progress  
- `"completed"` - Match finished

## Real-time Updates
The system automatically broadcasts match updates to all connected clients via WebSocket when admin operations are performed.

## Security Notes
- All admin operations require valid username/password in each request
- No session tokens or persistent authentication
- Credentials are verified against bcrypt hashed password
- Invalid credentials return 401 status code
