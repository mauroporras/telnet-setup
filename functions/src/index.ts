import * as functions from "firebase-functions";
import * as firebase from "firebase-admin";

firebase.initializeApp();

const db = firebase.firestore();

interface PostRequest {
  sessionId?: string;
  latestSelectedAnchor?: string;
}

const setLatestSelectedAnchor = functions.https.onRequest(
  async (request, response) => {
    const isPost = request.method.toUpperCase() === "POST";

    if (!isPost) {
      response.send(405);
      return;
    }

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
  }
);

export { setLatestSelectedAnchor };
