import { BsGithub } from 'react-icons/bs';
import { FaXTwitter } from 'react-icons/fa6';
import { GiLyre } from 'react-icons/gi';

export function Navbar() {
	return (
		<nav className='flex flex-row items-center justify-between bg-[#1ED760] px-6 py-1 shadow-md'>
			<div className='flex flex-row items-center text-[#121212]'>
				<GiLyre className='h-8 w-8' />
				<span className='text-2xl uppercase'>rpheus</span>
			</div>
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
					<FaXTwitter className='h-8 w-8' />
				</a>
			</div>
		</nav>
	);
}
