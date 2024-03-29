const express = require("express");
const router = express.Router();
const NodeMediaServer = require("node-media-server");
const {
  registerIncident,
  updateIncident,
  deactivateIncident,
  getIncidentsByUser,
  getAllActiveIncidents,
  getNearbyActiveIncidents,
  getIncident,
} = require("../controllers/incident.js");

// should get called automatically whenever user issues a help call and returns location of nearest five users as helpers
router.post("/registerIncident", registerIncident);

// should get called when after the incident, the user himself wants to add helpers details
router.post("/updateIncident", updateIncident);

// should be called when user wants to deactivate incident, i.e., false alarm
router.post("/deactivateIncident", deactivateIncident);

// get all active incidents
router.get("/getAllActiveIncidents", getAllActiveIncidents);

// get all incidents of the current user
router.get("/getIncidentByUser/:userid", getIncidentsByUser);

//get nearby active incidents not by current user
router.get("/getNearbyActiveIncidents/:userid", getNearbyActiveIncidents);

//get Incident
router.get("/:id", getIncident);

module.exports = router;
