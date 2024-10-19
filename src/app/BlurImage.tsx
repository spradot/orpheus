import cn from 'clsx';
import Image, { type ImageProps } from 'next/image';
import { useState } from 'react';

export function BlurImage(props: ImageProps) {
	const [isLoading, setLoading] = useState(true);

	return (
		<Image
			{...props}
			alt={props.alt}
			className={cn(
				props.className,
				'duration-700 ease-in-out',
				isLoading ? 'scale-100 blur-xl grayscale' : 'scale-100 blur-0 grayscale-0',
			)}
			onLoad={() => setLoading(false)}
		/>
	);
}
