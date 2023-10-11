import { Avatar } from '@mui/material';
import Link from 'next/link';
import React from 'react';
import type { Room } from 'src/Types';

const SidebarListItem = ({ item }: { item: Room }) => {
	return (
		<Link
			className="link"
			href={`/?roomId=${item.id}`}
		>
			<div className="sidebar__chat">
				<div className="avatar__container">
					<Avatar
						src={item.photoURL || `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${item.id}`}
						style={{ width: 45, height: 45 }}
					/>
				</div>
				<div className="sidebar__chat--info">
					<h2>{item.name}</h2>
				</div>
			</div>
		</Link>
	);
};

export default SidebarListItem;
