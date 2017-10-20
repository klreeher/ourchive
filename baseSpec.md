# Auth

## Models

## Routes
- GET oauth token (unauthed)
pass headers, see oauth spec

# API

## Models

### User

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

### Series 
a collection of works

#### model:

{
"ID": "",
"Title": "",
"Creators": {["userID", "userID"]}, // read only
"Length": "", // read only; sum of works with meta.length
"TotalWorks": ["workID1", "workID2"], // read only; 
"Complete": true
}


#### Routes: 
- Series Assignments

```
{
"SeriesID" : "",
"WorkID":"",
"ListOrder": "
}
```



### Work 
a collection of data, including chapters

{
"ID": "",
"Title": "",
"Creators": {["userID", "userID"]},
"ParentSeriesID": "", // read-only
"Length": "", // read only; sum of chapters with meta.length
"TotalChapters": "", // read only; 
"Complete": true
"Active": false // if Active = false, work is a draft
}

#### Routes:

- POST create
- 


### Chapter

{
"ID": "",
"Title": "",
"ListOrder": "", // optional list order; if not specified, will go off ID
"Content":"", // link to file
"Length": "" 
}

Routes

USERS
GET api/users
return a list of users
GET api/users/{{userID}}
return an individual user
POST api/users/
create a new user
PUT api/users/{{userID}}
update or create new user
PATCH api/users/{{userID}}
partially update an existing user
DELETE /api/users/{{userID}}
Deletes the user
We may want to consider if we want to allow a “grace period” to restore a user, and run all the user deletes at a certain
GET api/users/{{userID}}/works  // lists all works for a user ??
GET api/users/{{userID}}/series // lists all series for a user

WORKS
Each work contains collection of chapters; work is mostly metadata

GET api/work
return a list of works
GET api/works/{{workID}}
return an individual work
POST api/works/
create a new work
PUT api/works/{{workID}}
update or create new work
PATCH api/works/{{workID}}
partially update an existing work
DELETE /api/works/{{workID}}
GET api/work/{{workID}}/chapters
return a list of chapters associated with work

Chapter
a chapter is never independant of a work; chapters are ALWAYS active
GET api/works/{{workID}}/chapter
return a list of chapters; requires work 
GET api/works/{{workID}}/chapters/{{chapterID}}
return an individual chapter
POST api/works/{{workID}}/chapters/
create a new chapter
PUT api/works/{{workID}}/chapters/{{chapterID}}
update or create new chapter
PATCH api/works/{{workID}}/chapters/{{chapterID}}
partially update an existing chapter
DELETE /api/works/{{workID}}/chapters/{{chapterID}}

Series
GET api/series
return a list of series
GET api/series/{{seriesID}}
return an individual series
POST api/seriess/
create a new series
PUT api/seriess/{{seriesID}}
update or create new series
PATCH api/seriess/{{seriesID}}
partially update an existing series
DELETE /api/seriess/{{seriesID}}
GET /api/series/{{seriesID}}/assignments
list all works in series
POST  /api/series/{{seriesID}}/assignments
add a work to a series
DELETE  /api/series/{{seriesID}}/assignments
remove work from a series
