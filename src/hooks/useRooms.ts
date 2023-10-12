import { collection, orderBy, query } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import { RoomProperty } from 'src/Types';
import { db } from 'src/utils/firebase';

const useRooms = (): RoomProperty[] => {
	const [snapshot] = useCollection(query(collection(db, 'rooms'), orderBy('timestamp', 'desc')));
	const rooms = snapshot?.docs.map((doc) => ({
		id: doc.id,
		...doc.data(),
	}));
	return rooms as RoomProperty[];
};

export default useRooms;
