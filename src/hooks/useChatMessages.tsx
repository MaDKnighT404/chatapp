import { collection, orderBy, query } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import { MessagesProperty } from 'src/Types';
import { db } from 'src/utils/firebase';

const useChatMessages = (roomId: string) => {
	const [snapshot] = useCollection(
		roomId ? query(collection(db, `rooms/${roomId}/messages`), orderBy('timestamp', 'asc')) : null
	);
	const messages = snapshot?.docs.map((doc) => ({
		...doc.data(),
		id: doc.id,
  }));
  console.log('hook', messages)
	return messages as MessagesProperty[];
};

export default useChatMessages;
