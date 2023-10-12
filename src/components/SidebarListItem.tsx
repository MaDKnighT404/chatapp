import { Avatar } from '@mui/material';
import Link from 'next/link';
import type { ChatProperty, RoomProperty, UserProperty } from 'src/Types';

const SidebarListItem = ({ item }: { item: RoomProperty | UserProperty | ChatProperty }) => {
	return (
		<Link
			className="link"
			href={`/?roomId=${item.id}`}
		>
			<div className="sidebar__chat">
				<div className="avatar__container">
					<Avatar
						imgProps={{ referrerPolicy: 'no-referrer' }}
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
