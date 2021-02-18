const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const admin = require("firebase-admin");
const insert = require("./crud/insert.js"); //check crud functions, fairly simple to understand
const update = require("./crud/update.js");
const remove = require("./crud/remove");
const get = require("./crud/get");
admin.initializeApp({
  credential: admin.credential.cert(require("../config/firebase-admin-secret.json")),
});
admin.app;
const app = express();
app.use(bodyParser.json());
app.use(cors());


app.use("/crud/",require("./routes/basicCrud"))

app.listen(80, () => {
  console.log("listening");
});
