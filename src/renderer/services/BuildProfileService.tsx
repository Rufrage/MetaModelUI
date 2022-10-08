import { MMBuildProfile } from '@rufrage/metamodel';
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

const buildProfileConverter: FirestoreDataConverter<MMBuildProfile> = {
  toFirestore: (buildProfile: MMBuildProfile) => {
    return {
      name: buildProfile.name,
      description: buildProfile.description,
    };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot) => {
    console.log('fromFirestore called');
    const data = snapshot.data();
    const newBuildProfile = new MMBuildProfile(
      data.name,
      data.description,
      snapshot.id
    );

    return newBuildProfile;
  },
};

/** Returns a reference to the build profile collection */
const getBuildProfileCollection = () => {
  return collection(db, 'buildProfiles').withConverter<MMBuildProfile>(
    buildProfileConverter
  );
};

/** Returns a reference to the build profile */
const getBuildProfileRef = (id: string) => {
  return doc(db, 'buildProfiles', id).withConverter<MMBuildProfile>(
    buildProfileConverter
  );
};

async function getBuildProfiles(): Promise<MMBuildProfile[]> {
  const q = query(getBuildProfileCollection());
  const querySnapshot = await getDocs<MMBuildProfile>(q);
  return querySnapshot.docs.map((data) => {
    return data.data();
  });
}

async function getBuildProfile(
  id: string
): Promise<MMBuildProfile | undefined> {
  const docSnapshot = await getDoc<MMBuildProfile>(getBuildProfileRef(id));
  return docSnapshot.data();
}

async function addBuildProfile(
  docData: MMBuildProfile
): Promise<MMBuildProfile> {
  const newdoc = await addDoc(getBuildProfileCollection(), docData);
  return new MMBuildProfile(docData.name, docData.description, newdoc.id);
}

async function saveBuildProfile(
  docData: MMBuildProfile
): Promise<MMBuildProfile> {
  if (docData.id) {
    try {
      const updatedDoc = await updateDoc(getBuildProfileRef(docData.id), {
        name: docData.name,
        description: docData.description,
      });
    } catch (error) {
      console.log('Error: ', error);
    }
  }
  return docData;
}

export {
  getBuildProfileCollection,
  getBuildProfiles,
  getBuildProfile,
  addBuildProfile,
  saveBuildProfile,
};
