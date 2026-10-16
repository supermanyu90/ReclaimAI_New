import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore';
import { User } from 'firebase/auth';
import { db } from './firebase';
import { handleFirestoreError, OperationType } from './firestoreErrors';
import { AssetItem } from '../types';

export interface FirestoreUser {
  id: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt: string;
  updatedAt: string;
}

export async function syncUserProfile(user: User): Promise<void> {
  const userRef = doc(db, 'users', user.uid);
  const now = new Date().toISOString();
  try {
    await setDoc(
      userRef,
      {
        id: user.uid,
        email: user.email,
        displayName: user.displayName || 'ReclaimAI Owner',
        photoURL: user.photoURL || null,
        updatedAt: now,
        createdAt: now,
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
  }
}

export function subscribeUserAssets(
  userId: string,
  onAssets: (assets: AssetItem[]) => void,
  onError?: (err: any) => void
): () => void {
  const assetsQuery = query(collection(db, 'assets'), where('ownerId', '==', userId));

  const unsubscribe = onSnapshot(
    assetsQuery,
    (snapshot) => {
      const items: AssetItem[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const balance = data.amountMinor || data.amounts?.balance || 0;
        items.push({
          id: docSnap.id,
          label: data.label || 'Untitled Asset',
          institutionName: data.institutionName || 'Unknown Custodian',
          assetType: data.assetType || 'fixed_deposit',
          currency: data.currency || 'INR',
          amounts: {
            balance,
            estimatedValue: data.amounts?.estimatedValue,
          },
          maskedReference: data.maskedReference || '***',
          nomineeName: data.nomineeName,
          documentLocation: data.documentLocation || 'Family Safe',
          jurisdiction: data.jurisdiction || 'SG',
          status: data.status || 'active',
          sourceDate: data.sourceDate || null,
          verificationState: data.verificationState || 'manual_entry',
          nominationStatus: data.nominationStatus || (data.nomineeName ? 'recorded' : 'unregistered'),
          evidence: data.evidence || [],
          authorizedForFamily: data.authorizedForFamily ?? true,
        });
      });
      onAssets(items);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.LIST, 'assets');
    }
  );

  return unsubscribe;
}

export async function createFirestoreAsset(asset: AssetItem, userId: string): Promise<void> {
  const assetId = asset.id || `ast_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const assetDocRef = doc(db, 'assets', assetId);
  const now = new Date().toISOString();
  const balance = asset.amounts?.balance || asset.amounts?.estimatedValue || 0;

  const payload = {
    id: assetId,
    ownerId: userId,
    label: asset.label.slice(0, 150),
    institutionName: asset.institutionName.slice(0, 150),
    assetType: asset.assetType.slice(0, 50),
    currency: asset.currency.slice(0, 10),
    amountMinor: Number(balance),
    maskedReference: (asset.maskedReference || 'REF-***').slice(0, 100),
    nomineeName: (asset.nomineeName || 'Direct Family').slice(0, 150),
    documentLocation: (asset.documentLocation || 'Family Safe').slice(0, 250),
    jurisdiction: (asset.jurisdiction || 'SG').slice(0, 10),
    status: asset.status || 'active',
    createdAt: now,
    updatedAt: now,
  };

  try {
    await setDoc(assetDocRef, payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `assets/${assetId}`);
  }
}

export async function updateFirestoreAsset(
  assetId: string,
  patch: Partial<AssetItem>,
  userId: string
): Promise<void> {
  const assetDocRef = doc(db, 'assets', assetId);
  const now = new Date().toISOString();

  const payload: any = {
    updatedAt: now,
  };
  if (patch.label) payload.label = patch.label.slice(0, 150);
  if (patch.institutionName) payload.institutionName = patch.institutionName.slice(0, 150);
  if (patch.assetType) payload.assetType = patch.assetType.slice(0, 50);
  if (patch.currency) payload.currency = patch.currency.slice(0, 10);
  if (patch.amounts?.balance !== undefined) payload.amountMinor = Number(patch.amounts.balance);
  if (patch.maskedReference) payload.maskedReference = patch.maskedReference.slice(0, 100);
  if (patch.nomineeName) payload.nomineeName = patch.nomineeName.slice(0, 150);
  if (patch.documentLocation) payload.documentLocation = patch.documentLocation.slice(0, 250);
  if (patch.jurisdiction) payload.jurisdiction = patch.jurisdiction.slice(0, 10);
  if (patch.status) payload.status = patch.status;

  try {
    await updateDoc(assetDocRef, payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `assets/${assetId}`);
  }
}

export async function deleteFirestoreAsset(assetId: string): Promise<void> {
  const assetDocRef = doc(db, 'assets', assetId);
  try {
    await deleteDoc(assetDocRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `assets/${assetId}`);
  }
}

export async function seedDemoAssetsToFirestore(userId: string, demoAssets: AssetItem[]): Promise<void> {
  for (const asset of demoAssets) {
    await createFirestoreAsset(asset, userId);
  }
}
