'use client';
import { useZustandStore } from '@/util/store';
import { type SpotifyGenreResponse } from './page';

export function SearchGenre({ genres }: SpotifyGenreResponse) {
	const selectedGenres = useZustandStore(state => state.selectedGenres);
	const updateSelectedGenres = useZustandStore(state => state.updateSelectedGenres);

	const updateSelection = (genre: string) => {
		if (selectedGenres.includes(genre)) {
			const newSelection = selectedGenres.filter(g => g !== genre);
			updateSelectedGenres(newSelection);
		} else {
			if (selectedGenres.length === 5) return;
			updateSelectedGenres([...selectedGenres, genre]);
		}
	};

	return (
		<div className={`flex w-96 flex-col gap-y-5 rounded-lg bg-black px-4 pb-4 pt-4 text-white shadow-lg`}>
			<div className='flex min-h-8 flex-row items-center gap-x-3'>
				<label htmlFor='search_genres' className='rounded-lg px-2 text-lg outline outline-1'>
					Genres
				</label>
			</div>
			<ul id='search_genres' className='flex w-full flex-row flex-wrap justify-between gap-x-2 gap-y-2'>
				{genres.map(genre => {
					return (
						<li
							key={genre}
							className={`cursor-pointer select-none rounded-md px-2 ${selectedGenres.includes(genre) ? 'bg-green-300 text-black' : 'outline-dashed outline-1 hover:bg-white/20 hover:outline hover:outline-1'}`}
							onClick={() => updateSelection(genre)}
						>
							{genre}
						</li>
					);
				})}
			</ul>
		</div>
	);
}
