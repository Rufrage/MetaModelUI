import { MMTemplate } from '@rufrage/metamodel';
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
import { db } from 'renderer/firebase/firebaseUtil';

const templateConverter: FirestoreDataConverter<MMTemplate> = {
  toFirestore: (template: MMTemplate) => {
    return {
      name: template.name,
      filepath: template.filepath,
      description: template.description,
      objectInputType: template.objectInputType,
      viewInputType: template.viewInputType,
    };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot) => {
    const data = snapshot.data();
    const newTemplate = new MMTemplate(
      data.name,
      data.filepath,
      data.description,
      snapshot.id,
      data.objectInputType,
      data.viewInputType
    );

    return newTemplate;
  },
};

/** Returns a reference to the template collection */
const getTemplateCollection = () => {
  return collection(db, 'templates').withConverter<MMTemplate>(
    templateConverter
  );
};

/** Returns a reference to the template */
const getTemplateRef = (id: string) => {
  return doc(db, 'templates', id).withConverter<MMTemplate>(templateConverter);
};

async function getTemplates(): Promise<MMTemplate[]> {
  const q = query(getTemplateCollection());

  const querySnapshot = await getDocs<MMTemplate>(q);
  return querySnapshot.docs.map((data) => {
    return data.data();
  });
}

async function getTemplate(id: string): Promise<MMTemplate | undefined> {
  const docSnapshot = await getDoc<MMTemplate>(getTemplateRef(id));
  return docSnapshot.data();
}

async function addTemplate(docData: MMTemplate): Promise<MMTemplate> {
  const newdoc = await addDoc(getTemplateCollection(), docData);
  return new MMTemplate(
    docData.name,
    docData.filepath,
    docData.description,
    newdoc.id,
    docData.objectInputType,
    docData.viewInputType
  );
}

async function saveTemplate(docData: MMTemplate): Promise<MMTemplate> {
  if (docData.id) {
    try {
      const updatedDoc = await updateDoc(getTemplateRef(docData.id), {
        name: docData.name,
        filepath: docData.filepath,
        description: docData.description,
        objectInputType: docData.objectInputType,
        viewInputType: docData.viewInputType,
      });
    } catch (error) {
      console.log('Error: ', error);
    }
  }
  return docData;
}

export {
  getTemplateCollection,
  getTemplates,
  getTemplate,
  addTemplate,
  saveTemplate,
};
