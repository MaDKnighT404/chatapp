import { collection, orderBy, query } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { db } from 'src/utils/firebase';
import { UserProperty } from 'src/Types';

const useUsers = (user: User): UserProperty[] => {
	const [snapshot] = useCollection(query(collection(db, 'users'), orderBy('timestamp', 'desc')));

	const users = [] as UserProperty[];

	snapshot?.docs.forEach((doc) => {
		const id = doc.id > user.uid ? `${doc.id}${user.uid}` : `${user.uid}${doc.id}`;

		if (doc.id !== user.uid) {
			const data = doc.data() as UserProperty;
			users.push({ ...data, id });
		}
	});
	return users;
};

export default useUsers;
