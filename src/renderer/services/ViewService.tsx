import { MMObject, MMView } from '@rufrage/metamodel';
import {
  addDoc,
  collection,
  doc,
  FirestoreDataConverter,
  getDoc,
  getDocs,
  query,
  QueryDocumentSnapshot,
  updateDoc,
} from 'firebase/firestore';
import _ from 'lodash';
import { db } from 'renderer/firebase/firebaseUtil';

const viewConverter: FirestoreDataConverter<MMView> = {
  toFirestore: (object: MMView) => {
    return { name: object.name, description: object.description };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot) => {
    const data = snapshot.data();
    const newView = new MMView(data.name, data.description, snapshot.id);

    return newView;
  },
};

/** Returns a reference to the view collection */
const getViewCollection = () => {
  return collection(db, 'views').withConverter<MMView>(viewConverter);
};

/** Returns a reference to the view */
const getViewRef = (id: string) => {
  return doc(db, 'views', id).withConverter<MMView>(viewConverter);
};

async function getViews(): Promise<MMView[]> {
  const q = query(getViewCollection());

  const querySnapshot = await getDocs<MMView>(q);
  return querySnapshot.docs.map((data) => {
    return data.data();
  });
}

async function getView(id: string): Promise<MMView | undefined> {
  const docSnapshot = await getDoc<MMView>(getViewRef(id));
  return docSnapshot.data();
}

async function addView(docData: MMView): Promise<MMView> {
  const newdoc = await addDoc(getViewCollection(), docData);
  return new MMView(docData.name, docData.description, newdoc.id);
}

async function saveView(docData: MMView): Promise<MMView> {
  if (docData.id) {
    try {
      const updatedDoc = await updateDoc(getViewRef(docData.id), {
        name: docData.name,
        description: docData.description,
      });
    } catch (error) {
      console.log('Error: ', error);
    }
  }
  return docData;
}

export { getViewCollection, getViews, getView, addView, saveView };
