const admin = require("firebase-admin");
module.exports = async (obj = { collection: "string", id: "string" }) => {
  if (typeof obj !== "object") {
    throw new Error("Argument should be of type 'object'");
  }
  if (!obj.collection || obj.collection === "") {
    throw new Error("Collection name should be a non-empty string");
  }
  if (!obj.id) {
    throw new Error("Document id should be a non-empty string");
  } else {
    await admin.firestore().collection(obj.collection).doc(obj.id).delete();
    return obj.id;
  }
};
