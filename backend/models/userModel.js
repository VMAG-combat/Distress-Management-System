class User {
    constructor(id,name , phone, email,longitude,latitude , location,address , contact,
        bloodGrp ,weight,height , identificationMark, medicalHistory ) {
            this.id = id;
            this.name = name;
            this.phone = phone;
            this.email = email;
            this.longitude = longitude;
            this.latitude = latitude;
            this.location = location;
            this.address = address;
            this.contact = contact;
            this.bloodGrp = bloodGrp;
            this.weight = weight;
            this.height = height;
            this.identificationMark = identificationMark;
            this.medicalHistory = medicalHistory;
    }
}

module.exports = User;