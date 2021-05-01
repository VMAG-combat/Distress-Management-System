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
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app.use(cors());
const authRoutes = require('./routes/auth.js');
const userRoutes = require('./routes/user.js');
const incidentRoutes = require('./routes/incident.js');
const socialRoutes = require('./routes/social/post.js');
const eventRoutes = require('./routes/event.js');
const storeRoutes = require('./routes/store.js');

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/incident', incidentRoutes);
app.use('/social', socialRoutes);
app.use('/event',eventRoutes);
app.use('/store',storeRoutes);

app.use("/crud/",require("./routes/basicCrud"));

//app.use("/signup/",require("./routes/authentication/userSignup"));
//app.use("/signin/",require("./routes/authentication/userSignin"));

app.listen(80, () => {
  console.log("listening");
});
