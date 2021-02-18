class Incident {
    constructor(id, incidentId, reportedId, helpers, longitude,
        latitude, date, time, status, ) {
            this.id = id;
            this.incidentId = incidentId;
            this.reportedId = reportedId;
            this.helpers = helpers;
            this.longitude = longitude;
            this.latitude = latitude;
            this.date = date;
            this.time = time;
            this.status = status;
    }
}

module.exports = Incident;