import { firestore } from '@/lib/firebase';
import { collection, addDoc, query, where, orderBy, getDocs } from 'firebase/firestore';

export interface Application {
  id: string;
  userId: string;
  jobId: string;
  jobTitle: string;
  company: string;
  location?: string;
  applyLink?: string;
  salary?: string;
  remote?: boolean;
  status: 'applied' | 'interview' | 'offer' | 'rejected' | 'screening';
  appliedAt: string;
}

export async function trackApplication(userId: string, applicationData: Omit<Application, 'id' | 'appliedAt'>) {
  try {
    const applicationsRef = collection(firestore, 'applications');
    await addDoc(applicationsRef, {
      ...applicationData,
      userId,
      appliedAt: new Date().toISOString(),
    });
    console.log('✅ Application tracked in Firebase');
  } catch (error) {
    console.error('Error tracking application:', error);
    throw error;
  }
}

export async function getUserApplications(userId: string): Promise<Application[]> {
  try {
    const applicationsRef = collection(firestore, 'applications');
    const q = query(
      applicationsRef,
      where('userId', '==', userId),
      orderBy('appliedAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Application[];
  } catch (error) {
    console.error('Error fetching applications:', error);
    return [];
  }
}
