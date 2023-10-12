import { CancelRounded, CheckCircleRounded, MicRounded, Send } from '@mui/icons-material';
import { User } from 'firebase/auth';
import { addDoc, collection, doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { nanoid } from 'nanoid';
import { ChangeEvent, FormEvent, MouseEvent, useEffect, useRef, useState } from 'react';
import { Recorder, RoomProperty } from 'src/Types';
import { db, storage } from 'src/utils/firebase';
import recordAudio from 'src/utils/recordAudio';

const ChatFooter = ({
	input,
	onChange,
	image,
	user,
	room,
	roomId,
	sendMessage,
	setAudioId,
}: {
	input: string;
	onChange: (event: ChangeEvent<HTMLInputElement>) => void;
	image?: File | null;
	user: User;
	room: RoomProperty;
	roomId: string;
	sendMessage: (event: FormEvent) => void;
	setAudioId: (value: string) => void;
}) => {
	const record = useRef<Recorder | null>(null);
	const timeInterval = useRef<ReturnType<typeof setInterval> | null>(null);
	const [duration, setDuration] = useState('00:00');
	const canRecord = !!navigator.mediaDevices.getUserMedia && !!window.MediaRecorder;
	const [isRecording, setIsRecording] = useState(false);
	const canSendMessage = input.trim() || (input === '' && image);
	const recordIcons = (
		<>
			<Send style={{ width: 20, height: 20, color: 'white' }} />
			<MicRounded style={{ width: 24, height: 24, color: 'white' }} />
		</>
	);

	useEffect(() => {
		if (isRecording) {
			record?.current?.start();
			startTimer();
		}

		function pad(value: number) {
			return String(value).length < 2 ? `0${value}` : value;
		}

		function startTimer() {
			const start = Date.now();
			timeInterval.current = setInterval(setTime, 100);

			function setTime() {
				const timeElapsed = Date.now() - start;
				const totalSeconds = Math.floor(timeElapsed / 1000);
				const minutes = pad(Math.floor(totalSeconds / 60));
				const seconds = pad(totalSeconds % 60);
				setDuration(`${minutes}:${seconds}`);
			}
		}
	}, [isRecording]);

	const startRecording = async (event: MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		record.current = await recordAudio();
		setIsRecording(true);
		setAudioId('');
	};

	const stopRecording = async () => {
		if (timeInterval.current !== null) {
			clearInterval(timeInterval.current);
			setIsRecording(false);
			const audio = await record?.current?.stop();
			setDuration('00:00');
			timeInterval.current = null;
			return audio;
		}
	};

	const finishRecording = async () => {
		const result = await stopRecording();

		if (result) {
			const { audioFile, audioName } = result;
			sendAudio(audioFile, audioName);
		} else {
			console.log('error. No audio file ');
		}
	};

	const sendAudio = async (audioFile: File, audioName: string) => {
		await setDoc(doc(db, `users/${user.uid}/chats/${roomId}`), {
			name: room.name,
			photoURL: room.photoURL || null,
			timestamp: serverTimestamp(),
		});
		const newDoc = await addDoc(collection(db, `rooms/${roomId}/messages`), {
			name: user.displayName,
			uid: user.uid,
			timestamp: serverTimestamp(),
			time: new Date().toUTCString(),
			audioUrl: 'uploading',
			audioName,
		});
		await uploadBytes(ref(storage, `audio/${audioName}`), audioFile);
		const url = await getDownloadURL(ref(storage, `audio/${audioName}`));
		await updateDoc(doc(db, `rooms/${roomId}/messages/${newDoc.id}`), {
			audioUrl: url,
		});
	};

	const audioInputChange = (event: ChangeEvent<HTMLInputElement>) => {
		const audioFile = event.target.files && event.target.files[0];
		const audioName = nanoid();

		if (audioFile) {
			setAudioId('');
			sendAudio(audioFile, audioName);
		}
	};

	return (
		<div className="chat__footer">
			<form>
				<input
					value={input}
					onChange={onChange}
					type="text"
					placeholder="Type a message"
					style={{ width: isRecording ? 'calc(100% - 20px)' : 'calc(100% - 112px)' }}
				/>
				{canRecord ? (
					<button
						onClick={canSendMessage ? sendMessage : startRecording}
						type="submit"
						className="send__btn"
					>
						{recordIcons}
					</button>
				) : (
					<>
						<label
							htmlFor="capture"
							className="send__btn"
						>
							{recordIcons}
						</label>
						<input
							style={{ display: 'none' }}
							type="file"
							id="capture"
							accept="audio/*"
							onChange={audioInputChange}
							capture
						/>
					</>
				)}
			</form>

			{isRecording && (
				<div className="record">
					<CancelRounded
						onClick={stopRecording}
						style={{ width: 30, height: 30, color: '#f20519' }}
					/>
					<div>
						<div className="record__redcircle" />
						<div className="record__duration">{duration}</div>
					</div>
					<CheckCircleRounded
						onClick={finishRecording}
						style={{ width: 30, height: 30, color: '#41bf49' }}
					/>
				</div>
			)}
		</div>
	);
};

export default ChatFooter;
