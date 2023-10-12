import { Add, ExitToApp, Home, Message, PeopleAlt, Search, SearchOutlined } from '@mui/icons-material';
import {
	Avatar,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	IconButton,
	TextField,
} from '@mui/material';
import { User } from 'firebase/auth';
import { FormEvent, useState } from 'react';
import SidebarTab from './SidebarTab';
import SideBarList from './SideBarList';
import { addDoc, collection, getDocs, query, serverTimestamp, where } from 'firebase/firestore';
import { auth, db } from 'src/utils/firebase';
import { useRouter } from 'next/router';
import useRooms from 'src/hooks/useRooms';
import useUsers from 'src/hooks/useUsers';
import useChats from 'src/hooks/useChats';
import { RoomProperty, SearchResult, UserProperty } from 'src/Types';

const tabs = [
	{
		id: 1,
		icon: <Home />,
	},
	{
		id: 2,
		icon: <Message />,
	},
	{
		id: 3,
		icon: <PeopleAlt />,
	},
];

const Sidebar = ({ user }: { user: User }) => {
	const [menu, setMenu] = useState(1);
	const [isCreatingRoom, setCreatingRoom] = useState(false);
	const [roomName, setRoomName] = useState('');
	const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
	const router = useRouter();
	const rooms = useRooms();
	const chats = useChats(user);
	const users = useUsers(user);

	const createRoom = async () => {
		if (roomName?.trim()) {
			const roomsRef = collection(db, 'rooms');
			const newRoom = await addDoc(roomsRef, {
				name: roomName,
				timestamp: serverTimestamp(),
			});
			setCreatingRoom(false);
			setRoomName('');
			setMenu(2);
			router.push(`/?roomId=${newRoom.id}`);
		}
	};

	const searchUsersAndRooms = async (event: FormEvent<HTMLFormElement>) => {
		event?.preventDefault();
		const form = event.target as HTMLFormElement;
		const searchElement = form.elements.namedItem('search') as HTMLInputElement;
		const searchValue = searchElement.value;
		const userQuary = query(collection(db, 'users'), where('name', '==', searchValue));
		const roomQuary = query(collection(db, 'rooms'), where('name', '==', searchValue));

		const userSnapshot = await getDocs(userQuary);
		const roomSnapshot = await getDocs(roomQuary);

		const userResults = userSnapshot?.docs.map((doc) => {
			const id = doc.id > user.uid ? `${doc.id}${user.uid}` : `${user.uid}${doc.id}`;

			return { ...doc.data(), id } as UserProperty;
		});

		const roomResults = roomSnapshot?.docs.map((doc) => ({
			...(doc.data() as RoomProperty),
			id: doc.id,
		}));
		const searchResults = [...userResults, ...roomResults];
		setMenu(4);
		setSearchResults(searchResults);
	};

	return (
		<div className="sidebar">
			{/* Header */}

			<div className="sidebar__header">
				<div className="sidebar__header--left">
					<Avatar
						imgProps={{ referrerPolicy: 'no-referrer' }}
						src={user.photoURL || undefined}
						alt={user.displayName || undefined}
					/>
					<h4>{user.displayName}</h4>
				</div>
				<div className="sidebar__header--right">
					<IconButton
						onClick={() => {
							router.push(`/`);
							auth.signOut();
						}}
					>
						<ExitToApp />
					</IconButton>
				</div>
			</div>

			{/* Search */}

			<div className="sidebar__search">
				<form
					onSubmit={searchUsersAndRooms}
					className="sidebar__search--container"
				>
					<SearchOutlined />
					<input
						type="text"
						id="search"
						placeholder="Search for users or rooms"
					/>
				</form>
			</div>

			{/* Tabs */}
			<div className="sidebar__menu">
				{tabs.map((tab) => (
					<SidebarTab
						key={tab.id}
						onClick={() => setMenu(tab.id)}
						isActive={tab.id === menu}
					>
						<div className="sidebar__menu--home">
							{tab.icon}
							<div className="sidebar__menu--line"></div>
						</div>
					</SidebarTab>
				))}
			</div>
			{/* Sidebar Content */}
			{menu === 1 ? (
				<SideBarList
					title="Chats"
					data={chats}
				/>
			) : menu === 2 ? (
				<SideBarList
					title="Rooms"
					data={rooms}
				/>
			) : menu === 3 ? (
				<SideBarList
					title="Users"
					data={users}
				/>
			) : menu === 4 ? (
				<SideBarList
					title="Search Results"
					data={searchResults}
				/>
			) : null}

			{/* Create Room Button */}

			<div className="sidebar__chat--addRoom">
				<IconButton onClick={() => setCreatingRoom(true)}>
					<Add />
				</IconButton>
			</div>

			{/* Create Room Diablog */}
			<Dialog
				maxWidth="sm"
				open={isCreatingRoom}
				onClose={() => setCreatingRoom(false)}
			>
				<DialogTitle>Create New Room</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Type the name of your public room. Every user will be able to join this room.
					</DialogContentText>
					<TextField
						autoFocus
						margin="dense"
						onChange={(event) => setRoomName(event.target.value)}
						value={roomName}
						id="roomName"
						label="Room name"
						type="text"
						fullWidth
						variant="filled"
						style={{ marginTop: 20 }}
					/>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => setCreatingRoom(false)}
						color="error"
					>
						Cancel
					</Button>
					<Button
						onClick={createRoom}
						color="success"
					>
						Submit
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default Sidebar;
