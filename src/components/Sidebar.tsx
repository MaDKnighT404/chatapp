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
import { useState } from 'react';
import SidebarTab from './SidebarTab';
import SideBarList from './SideBarList';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { auth, db } from 'src/utils/firebase';
import { useRouter } from 'next/router';
import useRooms from 'src/hooks/useRooms';
import type { Room } from 'src/Types';

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
	const router = useRouter();
	const rooms = useRooms() as Room[];
	const data = [
		{
			id: 1,
			name: 'John Doe',
			photoURL: 'https://img.freepik.com/free-photo/a-cupcake-with-a-strawberry-on-top-and-a-strawberry-on-the-top_1340-35087.jpg',
		},
	];

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

	return (
		<div className="sidebar">
			{/* Header */}

			<div className="sidebar__header">
				<div className="sidebar__header--left">
					<Avatar
						rel="noreferrer"
						src={user.photoURL || undefined}
						alt={user.displayName || undefined}
					/>
					<h4>{user.displayName}</h4>
				</div>
				<div className="sidebar__header--right">
					<IconButton onClick={() => auth.signOut()}>
						<ExitToApp />
					</IconButton>
				</div>
			</div>

			{/* Search */}

			<div className="sidebar__search">
				<form className="sidebar__search--container">
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
					data={data}
				/>
			) : menu === 2 ? (
				<SideBarList
					title="Rooms"
					data={rooms}
				/>
			) : menu === 3 ? (
				<SideBarList
					title="Users"
					data={data}
				/>
			) : menu === 4 ? (
				<SideBarList
					title="Search Results"
					data={data}
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
