const admin = require("firebase-admin");
module.exports = async (
  obj = {
    fcmToken: "string",
    payload: { notification: { title: "string", body: "string" }, data: {} },
    options: {},
  }
) => {
  await admin.messaging().sendToDevice(obj.fcmToken, obj.payload, obj.options);
};
