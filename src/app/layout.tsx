import { Dialog } from '@/components/Dialog';
import { Navbar } from '@/components/Navbar';
import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
	title: 'Orpheus',
	description: 'Get music recommendations based on artists, tracks, genres, and track attributes',
	twitter: {
		card: 'summary',
	},
};

export const viewport: Viewport = {
	themeColor: '#1ED760',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body className='bg-slate-900/85'>
				<Dialog />
				<Navbar />
				{children}
			</body>
		</html>
	);
}
