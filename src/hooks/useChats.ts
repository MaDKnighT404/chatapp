import { User } from 'firebase/auth';
import { collection, orderBy, query } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import { ChatProperty } from 'src/Types';
import { db } from 'src/utils/firebase';

const useChats = (user: User): ChatProperty[] => {
	const [snapshot] = useCollection(query(collection(db, `users/${user.uid}/chat`), orderBy('timestamp', 'desc')));
	const chats = snapshot?.docs.map((doc) => ({
		id: doc.id,
		...doc.data(),
	}));
	return chats as ChatProperty[];
};

export default useChats;
