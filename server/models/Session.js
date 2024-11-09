// server/models/Sessions.js
import { db, serverTimestamp } from '../helpers/firebase.js';
import { zeaDebug } from '../helpers/zeaDebug.js';
import { collection, doc, setDoc, getDoc, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import EventEmitter from 'events';

class Session extends EventEmitter {
  #latestSelectedAnchor;

  constructor(id) {
    super();
    if (!id) {
      throw new Error('Missing `id` argument.');
    }
    this.id = id;
    this.unsub = null;
  }

  /**
   * Initializes the session by observing Firestore documents.
   */
  async init() {
    await this.#observeSession();
  }

  /**
   * Adds a point to the session and Firestore.
   * @param {string} point - The point data.
   * @param {string} [anchor] - The anchor associated with the point.
   */
  async addPoint(point, anchor) {
    if (!anchor && !this.#latestSelectedAnchor) {
      console.warn(
        'Missing `anchor` and `latestSelectedAnchor`. Did you remember to #init the session?'
      );
      return;
    }

    console.log('Anchor selected:', anchor);
    const theAnchor = anchor || this.#latestSelectedAnchor;

    // Create a document reference for a new point
    const docRef = doc(collection(db, 'points'));

    const data = {
      id: docRef.id, // Use docRef.id for the document ID
      createdAt: serverTimestamp(),
      sessionId: this.id,
      anchor: theAnchor,
      string: point,
    };

    try {
      await setDoc(docRef, data);
      zeaDebug("Created new point with id '%s' and anchor '%s'", docRef.id, theAnchor);
      console.log(`Point added to Firestore: ${point}`);
    } catch (error) {
      console.error('Error adding point to Firestore:', error);
    }
  }

  /**
   * Sets up a listener for new commands in Firestore.
   * @param {Function} callback - The function to call when a new command is created.
   */
  onCommandCreated(callback) {
    const q = query(
      collection(db, 'commands'),
      where('sessionId', '==', this.id),
      where('isInvoked', '==', false),
      orderBy('createdAt')
    );

    const unsub = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          callback(change.doc.data());
        }
      });
    }, (error) => {
      console.error(`Error listening to commands for session ${this.id}:`, error);
    });

    // Store the unsubscribe function to allow cleanup if needed
    this.unsub = unsub;
  }

  /**
   * Observes the session document in Firestore to keep track of the latest selected anchor.
   */
  async #observeSession() {
    console.log("Observing session:", this.id);

    const docRef = doc(collection(db, 'sessions'), this.id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error(
        `Session not found. ID: "${this.id}". Session must be created using the web app.`
      );
    }

    zeaDebug("Found existing session with id '%s'", this.id);

    if (this.unsub) {
      this.unsub();
    }

    this.unsub = onSnapshot(docRef, (snapshot) => {
      this.#latestSelectedAnchor = snapshot.data().latestSelectedAnchor || null;
      console.log("Current anchor selected:", this.#latestSelectedAnchor);
    }, (error) => {
      console.error(`Error observing session ${this.id}:`, error);
    });
  }

  /**
   * Cleans up listeners when the session is no longer needed.
   */
  cleanup() {
    if (this.unsub) {
      this.unsub();
      this.unsub = null;
    }
  }
}

export { Session };
