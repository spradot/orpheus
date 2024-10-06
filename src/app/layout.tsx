import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
	title: 'Orpheus',
	description: 'Get music reccomendations',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body className='bg-slate-900/75'>{children}</body>
		</html>
	);
}
