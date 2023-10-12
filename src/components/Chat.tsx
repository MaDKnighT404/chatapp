import { AddPhotoAlternate, MoreVert } from '@mui/icons-material';
import { Avatar, IconButton, Menu, MenuItem } from '@mui/material';
import { User } from 'firebase/auth';
import { useRouter } from 'next/router';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { RoomProperty } from 'src/Types';
import useRoom from 'src/hooks/useRoom';
import MediaPreview from './MediaPreview';
import ChatFooter from './ChatFooter';
import { nanoid } from 'nanoid';
import { addDoc, collection, doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { db, storage } from 'src/utils/firebase';
import Compressor from 'compressorjs';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

const Chat = ({ user }: { user: User }) => {
	const router = useRouter();
	const [image, setImage] = useState<File | null>(null);
	const [input, setInput] = useState('');
	const [src, setSrc] = useState<string>('');
	const roomId = (router.query.roomId ?? '') as string;
	const userId = user.uid;
	const room = useRoom(roomId, userId) as RoomProperty;

	const showPreview = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files && event.target.files[0];
		if (file) {
			setImage(file);
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => {
				setSrc(reader.result as string);
			};
		}
	};

	const closePreview = () => {
		setSrc('');
		setImage(null);
	};

	const sendMessage = async (event: FormEvent) => {
		event.preventDefault();

		setInput('');
		if (image) closePreview();
		const imageName = nanoid();

		const newMessage = {
			name: user.displayName,
			message: input,
			uid: user.uid,
			timestamp: serverTimestamp(),
			time: new Date().toUTCString(),
			...(image ? { imageUrl: 'uploading', imageName } : {}),
		};

		await setDoc(doc(db, `users/${userId}/chats/${roomId}`), {
			name: room.name,
			photoURL: room.photoURL || null,
			timestamp: serverTimestamp(),
		});

		const newDoc = await addDoc(collection(db, `rooms/${roomId}/messages`), newMessage);

		if (image) {
			new Compressor(image, {
				quality: 0.8,
				maxWidth: 1920,
				async success(result) {
					setSrc('');
					setImage(null);
					await uploadBytes(ref(storage, `images/${imageName}`), result);
					const url = await getDownloadURL(ref(storage, `images/${imageName}`));
					await updateDoc(doc(db, `rooms/${roomId}/messages/${newDoc.id}`), {
						imageUrl: url,
					});
				},
			});
		}
	};

	if (!room) return null;

	return (
		<div className="chat">
			<div className="chat__background" />

			{/* Chat Header */}

			<div className="chat__header">
				<div className="avatar__container">
					<Avatar
						src={room.photoURL}
						alt={room.name}
						imgProps={{ referrerPolicy: 'no-referrer' }}
					/>
				</div>

				<div className="chat__header--info">
					<h3>{room.name}</h3>
				</div>

				<div className="chat__header--right">
					<input
						id="image"
						style={{ display: 'none' }}
						accept="image/*"
						type="file"
						onChange={showPreview}
					/>
					<IconButton>
						<label
							style={{ cursor: 'pointer', height: 24 }}
							htmlFor="image"
						>
							<AddPhotoAlternate />
						</label>
					</IconButton>
					<IconButton>
						<MoreVert />
					</IconButton>

					<Menu
						id="menu"
						open={false}
						keepMounted
					>
						<MenuItem>Delete Room</MenuItem>
					</Menu>
				</div>
			</div>
			<MediaPreview
				src={src}
				closePreview={closePreview}
			/>
			<ChatFooter
				input={input}
				onChange={(event: ChangeEvent<HTMLInputElement>) => setInput(event.target.value)}
				image={image}
				user={user}
				room={room}
				roomId={roomId}
				sendMessage={sendMessage}
			/>
		</div>
	);
};

export default Chat;
