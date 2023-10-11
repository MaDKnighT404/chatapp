export type Room = {
	id: string;
	name: string;
	photoURL?: string;
	timestamp: {
		seconds: number;
		nanoseconds: number;
	};
};
