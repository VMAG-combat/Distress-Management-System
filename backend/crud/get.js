const admin = require("firebase-admin");
module.exports = async (
  obj = { collection: "string", by: "string", id: "string", where: [{ parameter: "string", comparison: "comparison operator", value: any }] }
) => {
  if (typeof obj !== "object") {
    throw new Error("Argument should be of type 'object'");
  }
  if (!obj.collection || obj.collection === "") {
    throw new Error("Collection name should be a non-empty string");
  }
  if (obj.by && obj.by === "all") {
    var res = await admin.firestore().collection(obj.collection);
    res = (await res.get()).docs;
    for (var i = 0; i < res.length; i++) {
      var x = res[i].data();
      x.id = res[i].id;
      res[i] = x;
    }
    return res;
  }
  if (!obj.by || (obj.by !== "id" && obj.by !== "where")) {
    throw new Error("'by' is a required argument and must be either 'id' or 'where'");
  }
  if (obj.by === "id" && (!obj.id || typeof obj.id !== "string" || obj.id === "")) {
    throw new Error("'id' parameter must be a present and be a non empty string");
  }
  if (obj.by === "id") {
    var res = await admin.firestore().collection(obj.collection).doc(obj.id).get();
    res = res.data();
    if (!res) throw new Error("The given object does not exist");
    res.id = obj.id;
    return res;
  }
  if (obj.by === "where" && (!obj.where || !Array.isArray(obj.where) || obj.where === [])) {
    throw new Error("'where' parameter must be a present and be a non empty array");
  }
  if (obj.by === "where") {
    var res = await admin.firestore().collection(obj.collection);
    obj.where.map((c, i) => {
      if (
        !c.comparison ||
        // typeof c.comparison !== "string" ||
        // c.comparison === "" ||
        !c.parameter ||
        // typeof c.parameter !== "string" ||
        // c.parameter === "" ||
        !c.value
        // typeof c.value !== "string" ||
        // c.value === ""
      ) {
        throw new Error("Each element of 'where' must be an object have 'parameter', 'comparison' and 'value' properties");
      }
      try {
        res = res.where(c.parameter, c.comparison, c.value);
      } catch (err) {
        throw err;
      }
    });
    res = (await res.get()).docs;

    for (var i = 0; i < res.length; i++) {
      var x = res[i].data();
      x.id = res[i].id;
      res[i] = x;
    }
    return res;
  }
};
