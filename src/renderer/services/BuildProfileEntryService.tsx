import { MMBuildProfileEntry } from '@rufrage/metamodel';
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

const buildProfileEntryConverter: FirestoreDataConverter<MMBuildProfileEntry> =
  {
    toFirestore: (buildProfileEntry: MMBuildProfileEntry) => {
      return {
        name: buildProfileEntry.name,
        description: buildProfileEntry.description,
        buildProfileID: buildProfileEntry.buildProfileID,
        templateID: buildProfileEntry.templateID,
        active: buildProfileEntry.active,
        objectIDs: buildProfileEntry.objectIDs,
        viewIDs: buildProfileEntry.viewIDs,
      };
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot) => {
      const data = snapshot.data();
      const newBuildProfile = new MMBuildProfileEntry(
        data.name,
        data.description,
        data.buildProfileEntry,
        data.templateID,
        data.active,
        snapshot.id
      );
      newBuildProfile.objectIDs = data.objectIDs;
      newBuildProfile.viewIDs = data.viewIDs;

      return newBuildProfile;
    },
  };

/** Returns a reference to the build profile entries collection */
const getBuildProfileEntriesCollection = (buildProfileID: string) => {
  return collection(
    db,
    'buildProfiles',
    buildProfileID,
    'buildProfileEntries'
  ).withConverter<MMBuildProfileEntry>(buildProfileEntryConverter);
};

/** Returns a reference to the build profile entry */
const getBuildProfileEntryRef = (
  buildProfileID: string,
  buildProfileEntryID: string
) => {
  return doc(
    db,
    'buildProfiles',
    buildProfileID,
    'buildProfileEntries',
    buildProfileEntryID
  ).withConverter<MMBuildProfileEntry>(buildProfileEntryConverter);
};

async function getBuildProfileEntries(
  buildProfileID: string
): Promise<MMBuildProfileEntry[]> {
  const q = query(getBuildProfileEntriesCollection(buildProfileID));
  const querySnapshot = await getDocs<MMBuildProfileEntry>(q);
  return querySnapshot.docs.map((data) => {
    return data.data();
  });
}

async function getBuildProfileEntry(
  buildProfileID: string,
  buildProfileEntryID: string
): Promise<MMBuildProfileEntry | undefined> {
  const docSnapshot = await getDoc<MMBuildProfileEntry>(
    getBuildProfileEntryRef(buildProfileID, buildProfileEntryID)
  );
  return docSnapshot.data();
}

async function addBuildProfileEntry(
  buildProfileID: string,
  docData: MMBuildProfileEntry
): Promise<MMBuildProfileEntry> {
  const newdoc = await addDoc(
    getBuildProfileEntriesCollection(buildProfileID),
    docData
  );
  docData.id = newdoc.id;
  return docData;
}

async function saveBuildProfileEntry(
  buildProfileID: string,
  docData: MMBuildProfileEntry
): Promise<MMBuildProfileEntry> {
  if (docData.id) {
    try {
      const updatedDoc = await updateDoc(
        getBuildProfileEntryRef(buildProfileID, docData.id),
        {
          name: docData.name,
          description: docData.description,
          buildProfileID: docData.buildProfileID,
          templateID: docData.templateID,
          active: docData.active,
          objectIDs: docData.objectIDs,
          viewIDs: docData.viewIDs,
        }
      );
    } catch (error) {
      console.log('Error: ', error);
    }
  }
  return docData;
}

export {
  getBuildProfileEntriesCollection,
  getBuildProfileEntries,
  getBuildProfileEntry,
  addBuildProfileEntry,
  saveBuildProfileEntry,
};
