import { CloseRounded } from '@mui/icons-material';
import Image from 'next/image';

const MediaPreview = ({ src, closePreview }: { src: string; closePreview: () => void }) => {
	if (!src) return null;

	return (
		<div className="mediaPreview">
			<CloseRounded onClick={closePreview} />
			<Image
        src={src}
        width={200}
        height={200}
				alt="Preview"
			/>
		</div>
	);
};

export default MediaPreview;
