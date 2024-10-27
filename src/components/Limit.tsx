'use client';

import { useZustandStore } from '@/util/client/store';

export function Limit() {
	const selectedLimit = useZustandStore(state => state.selectedLimit);
	const setSelectedLimit = useZustandStore(state => state.setSelectedLimit);

	return (
		<div className='flex w-96 min-w-96 flex-col items-center rounded-lg bg-black/30 px-4 pb-4 pt-4 text-white shadow-lg outline-dashed outline-1 outline-gray-400'>
			<div className={`flex h-fit w-72 flex-col gap-y-4 rounded-lg bg-black px-4 py-4 text-white shadow-lg`}>
				<div className='flex flex-row items-center justify-between'>
					<h1 className='rounded-lg px-2 text-sm capitalize outline outline-1'>Limit</h1>
					<h1 className='min-w-[4ch] max-w-[4ch] rounded-md text-center outline outline-1'>{selectedLimit}</h1>
				</div>
				<input
					type='range'
					id='limit'
					min={1}
					max={50}
					step={1}
					value={selectedLimit}
					onChange={e => setSelectedLimit(Number.parseInt(e.target.value))}
					className='h-1 w-full cursor-pointer appearance-none rounded-lg bg-[#1ED760] [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white'
				/>
			</div>
		</div>
	);
}
