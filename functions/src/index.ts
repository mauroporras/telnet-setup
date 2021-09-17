import * as cors from "cors";
import * as express from "express";
import * as firebase from "firebase-admin";
import * as functions from "firebase-functions";

firebase.initializeApp();

const db = firebase.firestore();

const app = express();

interface PostRequest {
  sessionId?: string;
  latestSelectedAnchor?: string;
}

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

app.post("/", async (request, response) => {
  const { sessionId, latestSelectedAnchor } = request.body as PostRequest;

  if (!sessionId || !latestSelectedAnchor) {
    response.send(400);
    return;
  }

  const collectionId = "sessions";
  const docRef = db.collection(collectionId).doc(sessionId);
  const doc = await docRef.get();

  if (!doc.exists) {
    response.send(404);
    return;
  }

  await docRef.update({ latestSelectedAnchor });

  response.send({ sessionId, latestSelectedAnchor });
});

const setLatestSelectedAnchor = functions.https.onRequest(app);

export { setLatestSelectedAnchor };
