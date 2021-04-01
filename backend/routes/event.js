const express = require('express')

const { getEventsByUser, createEvent, getAllEvents, createEventPost, deleteEvent, registerEvent, searchEventsByParameter} = require('../controllers/event');

const router = express.Router();

router.get('/myevents/:userid', getEventsByUser);

router.get("/getAllEvents/:userid",getAllEvents);

router.get("/searchEvents/:field/:value/:userid",searchEventsByParameter);

router.post("/createEvent", createEvent);

router.post("/createEventPost", createEventPost);

router.post("/registerEvent/:userid/:eventid", registerEvent);

router.post("/deleteEvent/:eventid", deleteEvent);

module.exports = router;