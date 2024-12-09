// server/models/Session.js
import { db, serverTimestamp } from '../helpers/firebase.js';
import { zeaDebug } from '../helpers/zeaDebug.js';
import { collection, doc, setDoc, getDoc, onSnapshot, query, where, orderBy, getDocs } from 'firebase/firestore';
import EventEmitter from 'events';
import { logger } from '../helpers/logger.js'; // Import the initialized logger

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
    // If no anchor passed in, fallback to the session's current default anchor
    const theAnchor = anchor || this.#latestSelectedAnchor;
  
    if (!theAnchor) {
      logger.warn('Missing `anchor` and `latestSelectedAnchor`. Did you remember to #init the session?');
      return;
    }
  
    logger.info(`Anchor selected: ${theAnchor}`);
    const docRef = doc(collection(db, 'points'));
    const data = {
      id: docRef.id,
      createdAt: serverTimestamp(),
      sessionId: this.id,
      anchor: theAnchor,
      string: point,
    };
  
    try {
      await setDoc(docRef, data);
      logger.info(`Point added to Firestore: ${point} for anchor: ${theAnchor}`);
    } catch (error) {
      logger.error('Error adding point to Firestore:', error);
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
      logger.error(`Error listening to commands for session ${this.id}:`, error);
    });

    this.unsub = unsub;
  }

  /**
   * Clears any pending (non-invoked) commands from Firestore by marking them as invoked.
   * This can be called once when the connection is established to prevent old commands from running again.
   */
  async clearPendingCommands() {
    try {
      const q = query(
        collection(db, 'commands'),
        where('sessionId', '==', this.id),
        where('isInvoked', '==', false)
      );
      const snapshot = await getDocs(q);
      for (const cmdDoc of snapshot.docs) {
        await setDoc(doc(db, 'commands', cmdDoc.id), { isInvoked: true }, { merge: true });
        logger.info(`Marked command ${cmdDoc.id} as invoked to clear pending backlog.`);
      }
    } catch (error) {
      logger.error('Error clearing pending commands:', error);
    }
  }

  /**
   * Observes the session document in Firestore to keep track of the latest selected anchor.
   */
  async #observeSession() {
    logger.info(`Observing session: ${this.id}`);

    const docRef = doc(collection(db, 'sessions'), this.id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error(
        `Session not found. ID: "${this.id}". Session must be created using the web app.`
      );
    }

    zeaDebug("Found existing session with id '%s'", this.id);
    logger.info(`Found existing session with id '${this.id}'`);

    if (this.unsub) {
      this.unsub();
    }

    this.unsub = onSnapshot(docRef, (snapshot) => {
      this.#latestSelectedAnchor = snapshot.data().latestSelectedAnchor || null;
      console.log("Current anchor selected:", this.#latestSelectedAnchor);
      logger.info(`Current anchor selected: '${this.#latestSelectedAnchor}'`);
    }, (error) => {
      logger.error(`Error observing session ${this.id}:`, error);
    });
  }

  /**
   * Cleans up listeners when the session is no longer needed.
   */
  cleanup() {
    if (this.unsub) {
      this.unsub();
      this.unsub = null;
      logger.info(`Cleaned up listeners for session ${this.id}`);
    }
  }
}

export { Session };
