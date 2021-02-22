const admin = require("firebase-admin");
module.exports = async (obj = { collection: "string", data: {}, id: "string" }) => {
  if (typeof obj !== "object") {
    throw new Error("Argument should be of type 'object'");
  }
  if (!obj.collection || obj.collection === "") {
    throw new Error("Collection name should be a non-empty string");
  }
  if (!obj.data || typeof obj.data !== "object") {
    throw new Error("There should be a json object is 'data' parameter");
  }
  if (obj.id) {
    await admin.firestore().collection(obj.collection).doc(obj.id).set(obj.data);
    return obj.id;
  } else {
    var data = await admin.firestore().collection(obj.collection).add(obj.data);
    return data.id;
  }
};
