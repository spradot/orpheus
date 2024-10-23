import { BsGithub, BsTwitter } from 'react-icons/bs';

export function Navbar() {
	return (
		<nav className='flex flex-row items-center justify-between bg-[#1ED760] px-6 py-2'>
			<h1 className='text-2xl uppercase text-[#121212]'>Orpheus</h1>
			<div className='flex flex-row gap-x-5'>
				<a
					href='https://github.com/iShibi'
					title='github.com/iShibi'
					target='_blank'
					rel='noopener noreferrer'
					className=''
				>
					<BsGithub className='h-8 w-8' />
				</a>
				<a
					href='https://twitter.com/iShiibi'
					title='twitter.com/iShiibi'
					target='_blank'
					rel='noopener noreferrer'
					className=''
				>
					<BsTwitter className='h-8 w-8' />
				</a>
			</div>
		</nav>
	);
}
