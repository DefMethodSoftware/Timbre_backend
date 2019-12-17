# Timbre_backend
## Routes
POST /users/news
	Email
	Password
	First name
	Lastname
	Instrument
	Genre
	Proficiency
	Prefs for matched users - e.g. guitar, drums
	Bio
	
	Return auth token

POST /sessions/new
	Email
	Password
	
	Return auth token

GET /bands
	Send auth token
	All bandsfiltered by prefs on both sides
	
GET /users
	To find members for your band
	Returns users filtered by prefs / bands reqs
	
POST /users/id
	Send auth token
	Accept / decline that user for signed in user

GET /matches
	Send auth token
	Returns users who have matched with signed in user

## Classes
Band class - created by users
	Set instruments required
		2 guitars
		1 bass
		1 drums
		1 singer
	Set current
		1 guitar
		1 singer
	About
	Links to music
	Photos
	Members?
	Etc

User class
	Email
	Password
	First name
	Lastname
	Instrument
	Genre
	Proficiency
	Prefs for matched users - e.g. guitar, drums
	Bio
	
Match
	Band id
	User id

	
