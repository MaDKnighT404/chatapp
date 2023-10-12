import { doc } from 'firebase/firestore';
import { useDocument } from 'react-firebase-hooks/firestore';
import { db } from 'src/utils/firebase';

const useRoom = (roomId: string, userId: string) => {
	const isUserRoom = roomId.includes(userId);
	const collectionId = isUserRoom ? 'users' : 'rooms';
	const docId = isUserRoom ? roomId.replace(userId, '') : roomId;
	const [snapshot] = useDocument(docId ? doc(db, `${collectionId}/${docId}`) : null);

	if (!snapshot?.exists()) return null;

	const data = snapshot.data();

	return {
		id: snapshot.id,
		photoURL: data?.photoURL || `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${snapshot.id}`,
		...data,
	};
};

export default useRoom;
