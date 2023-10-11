import { Add, ExitToApp, Home, Message, PeopleAlt, Search, SearchOutlined } from '@mui/icons-material';
import { Avatar, IconButton } from '@mui/material';
import { User } from 'firebase/auth';
import { useState } from 'react';
import SidebarTab from './SidebarTab';
import SideBarList from './SideBarList';

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
	const data = [
		{
			id: 1,
			name: 'John Doe',
			photoUrl:
				'https://lh3.googleusercontent.com/a/ACg8ocLq01tU0ZsQKagkSqipB5pNH8QhqzrNVYrXfZEfRCj07cE=s96-c-rg-br100',
		},
	];

	return (
		<div className="sidebar">
			{/* Header */}

			<div className="sidebar__header">
				<div className="sidebar__header--left">
					<Avatar
						src={user.photoURL || undefined}
						alt={user.displayName || undefined}
					/>
					<h4>{user.displayName}</h4>
				</div>
				<div className="sidebar__header--right">
					<IconButton>
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
					data={data}
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
				<IconButton>
					<Add />
				</IconButton>
			</div>
		</div>
	);
};

export default Sidebar;
