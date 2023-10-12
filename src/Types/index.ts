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

export type MessagesProperty = {
	uid: string;
	timestamp: Timestamp;
	imageUrl?: string;
	audioName?: string;
	name: string;
	time: string;
	message: string;
	id: string;
};

export type SearchResult = UserProperty | RoomProperty;
