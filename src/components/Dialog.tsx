'use client';

import { useZustandStore } from '@/util/client/store';
import { BiX } from 'react-icons/bi';

export function Dialog() {
	const dialog = useZustandStore(state => state.dialog);
	const setDialog = useZustandStore(state => state.setDialog);

	return (
		<>
			{dialog.isActive && (
				<div className='fixed flex h-screen w-screen items-center justify-center bg-black/80'>
					<div className='absolute flex h-60 min-w-96 max-w-96 items-center justify-center rounded-lg bg-[#121212] outline outline-1 outline-gray-500'>
						<h1 className='text-md px-4 text-center text-white'>{dialog.description}</h1>
						<button onClick={() => setDialog({ isActive: false, description: '' })}>
							<BiX className='absolute right-3 top-3 h-8 w-8 rounded-full fill-gray-400 hover:fill-white' />
						</button>
					</div>
				</div>
			)}
		</>
	);
}
