import { MMObject } from '@rufrage/metamodel';
import { getApp } from 'firebase/app';
import {
  addDoc,
  collection,
  FirestoreDataConverter,
  getDocs,
  getFirestore,
  query,
  QueryDocumentSnapshot,
} from 'firebase/firestore';

class ObjectItem extends MMObject {
  /**
   *
   * @param id ID from firebase
   * @param name
   * @param description
   */
  constructor(
    public id: string,
    public name: string,
    public description: string
  ) {
    super(name, description);
  }

  public static objectConverter: FirestoreDataConverter<ObjectItem> = {
    toFirestore: (object: ObjectItem) => {
      return object;
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot) => {
      const data = snapshot.data();
      return new ObjectItem(snapshot.id, data.name, data.description);
    },
  };
}

const db = getFirestore(getApp());

/** Returns a reference to the object collection */
const getObjectCollection = () => {
  return collection(db, 'objects').withConverter<ObjectItem>(
    ObjectItem.objectConverter
  );
};

const getObjects = async () => {
  const q = query(getObjectCollection());

  const querySnapshot = await getDocs(q);

  const objectsLst = querySnapshot.docs.map((data) => {
    return { ...data.data() };
  });

  return objectsLst;
};

const addObject = async (docData: ObjectItem) => {
  const newDoc = await addDoc(getObjectCollection(), docData);
  return newDoc;
};

export default { getObjectCollection, getObjects, addObject };
