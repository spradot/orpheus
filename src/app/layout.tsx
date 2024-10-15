import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from './Navbar';

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
			<body className='bg-slate-900/85'>
				<Navbar />
				{children}
			</body>
		</html>
	);
}
