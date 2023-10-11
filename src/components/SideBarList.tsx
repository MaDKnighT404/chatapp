import { CircularProgress } from '@mui/material';
import React from 'react';
import SidebarListItem from './SidebarListItem';

const SideBarList = ({ title, data }) => {
	if (!data) {
		return (
			<div className="loader__container sidebar__loader">
				<CircularProgress />
			</div>
		);
	}

	return (
		<div className="sidebar__chat--container">
			<h2>{title}</h2>
			{data.map((item) => (
				<SidebarListItem
					key={item.id}
					item={item}
				/>
			))}
		</div>
	);
};

export default SideBarList;
