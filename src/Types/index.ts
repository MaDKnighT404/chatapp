type Timestamp = {
	seconds: number;
	nanoseconds: number;
};

export type RoomProperty = {
	id: string;
	name: string;
	photoURL?: string;
	timestamp: Timestamp;
};

export type UserProperty = {
	id: string;
	name: string;
	photoURL?: string;
	timestamp: Timestamp;
};

export type ChatProperty = {
	id: string;
	name: string;
	photoURL?: string;
	timestamp: Timestamp;
};

export type SearchResult = UserProperty | RoomProperty;
