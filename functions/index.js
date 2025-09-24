const {onRequest} = require("firebase-functions/v2/https");
const {onDocumentCreated} = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");
const cors = require("cors")({origin: true});

admin.initializeApp();

exports.countBooks = onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const booksCollection = admin.firestore().collection("books");
      const snapshot = await booksCollection.get();
      res.status(200).send({count: snapshot.size});
    } catch (error) {
      console.error("Error counting books:", error.message);
      res.status(500).send("Error counting books");
    }
  });
});

exports.capitalizeBookOnCreate = onDocumentCreated("books/{docId}",
    async (event) => {
      const snap = event.data;
      if (!snap) return;
      const data = snap.data();
      const updates = {};
      for (const [key, val] of Object.entries(data)) {
        if (typeof val === "string") {
          updates[key] = val.toUpperCase();
        }
      }
      if (Object.keys(updates).length > 0) {
        await snap.ref.update(updates);
      }
    });
