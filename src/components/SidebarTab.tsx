import React from 'react';

const SidebarTab = ({
	children,
	onClick,
	isActive,
}: {
	onClick: () => void;
	children: React.ReactNode;
	isActive: boolean;
}) => {
	return (
		<div
			onClick={onClick}
			className={`${isActive ? 'sidebar__menu--selected' : ''}`}
		>
			{children}
		</div>
	);
};

export default SidebarTab;
