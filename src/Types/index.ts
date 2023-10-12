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
	audioUrl?: string;
	name: string;
	time: string;
	message: string;
	id: string;
};

export type AudioResult = {
	audioFile: File;
	audioUrl: string;
	play: () => void;
	audioName: string;
};

export type Recorder = {
	start: () => void;
	stop: () => Promise<AudioResult>;
};

export type SearchResult = UserProperty | RoomProperty;
