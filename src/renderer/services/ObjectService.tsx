import { MMObject } from '@rufrage/metamodel';
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

const objectConverter: FirestoreDataConverter<MMObject> = {
  toFirestore: (object: MMObject) => {
    return { name: object.name, description: object.description };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot) => {
    const data = snapshot.data();
    const newObject = new MMObject(data.name, data.description, snapshot.id);

    return newObject;
  },
};

/** Returns a reference to the object collection */
const getObjectCollection = () => {
  return collection(db, 'objects').withConverter<MMObject>(objectConverter);
};

/** Returns a reference to the object */
const getObjectRef = (id: string) => {
  return doc(db, 'objects', id).withConverter<MMObject>(objectConverter);
};

async function getObjects(): Promise<MMObject[]> {
  const q = query(getObjectCollection());

  const querySnapshot = await getDocs<MMObject>(q);
  return querySnapshot.docs.map((data) => {
    return data.data();
  });
}

async function getObject(id: string): Promise<MMObject | undefined> {
  const docSnapshot = await getDoc<MMObject>(getObjectRef(id));
  return docSnapshot.data();
}

async function addObject(docData: MMObject): Promise<MMObject> {
  const newdoc = await addDoc(getObjectCollection(), docData);
  return new MMObject(docData.name, docData.description, newdoc.id);
}

async function saveObject(docData: MMObject): Promise<MMObject> {
  if (docData.id) {
    try {
      const updatedDoc = await updateDoc(getObjectRef(docData.id), {
        name: docData.name,
        description: docData.description,
      });
    } catch (error) {
      console.log('Error: ', error);
    }
  }
  return docData;
}

export { getObjectCollection, getObjects, getObject, addObject, saveObject };
