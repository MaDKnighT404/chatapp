import { PauseRounded, PlayArrowRounded } from '@mui/icons-material';
import { CircularProgress } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { FC, ChangeEvent } from 'react';

interface AudioPlayerProps {
	sender?: boolean;
	audioUrl?: string;
	id: string;
	setAudioId: (id: string) => void;
	audioId: string;
}

export const AudioPlayer: FC<AudioPlayerProps> = ({ sender, audioUrl, id, setAudioId, audioId }) => {
	const [isPlaying, setPlaying] = useState(false);
	const [isMediaLoaded, setMediaLoaded] = useState(false);
	const [isLoaded, setLoaded] = useState(false);
	const [isMetadataLoaded, setMetadataLoaded] = useState(false);
	const [sliderValue, setSliderValue] = useState(0);
	const [duration, setDuration] = useState('');
	const totalDuration = useRef('');
	const audio = useRef(new Audio(audioUrl));
	const interval = useRef<ReturnType<typeof setInterval> | null>(null);
	const isUploading = useRef(audioUrl === 'uploading');

	useEffect(() => {
		if (isUploading.current && audioUrl !== 'uploading') {
			audio.current = new Audio(audioUrl);
			audio.current.load();
			setLoaded(true);
		} else if (isUploading.current === false) {
			setLoaded(true);
		}
	}, [audioUrl]);

	useEffect(() => {
		if (isLoaded) {
			getAudioDuration(audio.current).then(() => {
				setMetadataLoaded(true);
			});
		}
	}, [isLoaded]);

	useEffect(() => {
		if (isMetadataLoaded) {
			audio.current.addEventListener('canplaythrough', () => {
				if (!totalDuration.current) {
					setMediaLoaded(true);
					const time = formatTime(audio.current.duration);
					totalDuration.current = time;
					setDuration(totalDuration.current);
				}
			});

			audio.current.addEventListener('ended', () => {
				if (typeof interval.current === 'number' || interval.current instanceof NodeJS.Timeout) {
					clearInterval(interval.current);
				}
				setDuration(totalDuration.current);
				setSliderValue(0);
				setPlaying(false);
			});
		}
	}, [isMetadataLoaded]);

	useEffect(() => {
		if (audioId !== id) {
			audio.current.pause();
			setPlaying(false);
		}
	}, [audioId, id]);

	function getAudioDuration(media: HTMLAudioElement): Promise<number> {
		return new Promise((resolve) => {
			media.onloadedmetadata = () => {
				media.currentTime = Number.MAX_SAFE_INTEGER;
				media.ontimeupdate = () => {
					media.ontimeupdate = () => {};
					media.currentTime = 0.1;
					resolve(media.duration);
				};
			};
		});
	}

	function formatTime(time: number): string {
		let minutesNum = Math.floor(time / 60);
		let secondsNum = Math.floor(time - minutesNum * 60);

		let minutes = minutesNum < 10 ? `0${minutesNum}` : `${minutesNum}`;
		let seconds = secondsNum < 10 ? `0${secondsNum}` : `${secondsNum}`;

		return `${minutes}:${seconds}`;
	}

	function playAudio() {
		setPlaying(true);
		audio.current.play();
		if (audioId !== id) {
			setAudioId(id);
		}
		interval.current = setInterval(updateSlider, 100);
	}

	function updateSlider() {
		let sliderPosition = 0;

		const { currentTime, duration } = audio.current;
		if (typeof duration === 'number') {
			sliderPosition = currentTime * (100 / duration);
			setSliderValue(sliderPosition);
			const time = formatTime(currentTime);
			setDuration(time);
		}
	}

	function stopAudio() {
		audio.current.pause();
		if (typeof interval.current === 'number' || interval.current instanceof NodeJS.Timeout) {
			clearInterval(interval.current);
		}
		setPlaying(false);
		setDuration(totalDuration.current);
	}

	function scrubAudio(event: ChangeEvent<HTMLInputElement>) {
		const value = event.target.value;
		const { duration } = audio.current;

		if (isMediaLoaded) {
			const seekTo = duration * (+value / 100);
			audio.current.currentTime = seekTo;
			setSliderValue(+value);
		}
	}

	return (
		<>
			<div className={`audioplayer ${sender ? '' : 'audioplayer__alt'}`}>
				{!isMediaLoaded ? (
					<CircularProgress />
				) : isPlaying ? (
					<PauseRounded
						onClick={stopAudio}
						className="pause"
					/>
				) : !isPlaying ? (
					<PlayArrowRounded onClick={playAudio} />
				) : null}
				<div>
					<span
						style={{ width: `${sliderValue}%` }}
						className="audioplayer__slider--played"
					/>
					<input
						type="range"
						min={1}
						max={100}
						value={sliderValue}
						onChange={scrubAudio}
						className="audioplayer__slider"
					/>
				</div>
			</div>
			<span className="chat__timestamp audioplayer__time">{duration}</span>
		</>
	);
};
