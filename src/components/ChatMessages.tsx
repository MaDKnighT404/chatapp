import { CircularProgress } from '@mui/material';
import { User } from 'firebase/auth';
import Image from 'next/image';
import { MessagesProperty } from 'src/Types';

const ChatMessages = ({ messages, user, roomId }: { messages: MessagesProperty[]; user: User; roomId: string }) => {
	if (!messages) return null;

	return messages.map((message) => {
		const isSender = message.uid === user.uid;

		return (
			<div
				key={message.id}
				className={`chat__message ${isSender ? 'chat__message--sender' : ''}`}
			>
				<span className="chat__name">{message.name}</span>

				{message.imageUrl === 'uploading' ? (
					<div className="image-container">
						<div className="image__container--loader">
							<CircularProgress style={{ width: 40, height: 40 }} />
						</div>
					</div>
				) : message.imageUrl ? (
					<div className="image-container">
						<Image
							src={message.imageUrl}
							alt={message.name}
							height={100}
							width={100}
						/>
					</div>
				) : null}

				{message.audioName ? <div></div> : <span className="chat__message--message">{message.message}</span>}

				<span className="chat__timestamp">{message.time}</span>
			</div>
		);
	});
};

export default ChatMessages;
