# Auth

## Models

## Routes
- GET oauth token (unauthed)
pass headers, see oauth spec

# API


## User

### Model

{
"ID": "",
"Username": "",
"Password": "",
"FirstName": "",
"LastName": "",
"Email": "",
"TermsAccepted": "0001-01-01T00:00:00+00:00",
"Active": false,
}

### Routes

- get user
- get users
- create user
- update user
- patch user
- delete user

## Works

### Model

{
  "ID": "string",
  "title": "string",
  "Creators": {},
  "Length": 0,
  "Complete": true,
  "Type": "string"
}

### Routes

- get work
- get works
- post work
- put work
- patch work
- delete work


## Tags

### model

Tag
{
ID  string
Value   string
Category    string
}

TagAssignment:
{
TagID   string
WorkID  string
IsPrimary   boolean
Category    string >> enum
}

### routes

- create tag
- delete tag
- save tag assignment
- delete tag assignment
