'use client';

import { useZustandStore } from '@/util/store';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import type { Artist, GetArtistResponse } from './api/artists/route';

export function SearchArtist({ className }: { className?: string }) {
	const [query, setQuery] = useState('');
	const [suggestions, setSuggestions] = useState<Array<Artist>>([]);
	const selectedArtists = useZustandStore(state => state.selectedArtists);
	const addArtist = useZustandStore(state => state.addArtist);
	const removeArtist = useZustandStore(state => state.removeArtist);

	useEffect(() => {
		if (query === '') {
			setSuggestions([]);
			return;
		}

		const fetchSuggestions = async () => {
			const res = await fetch(`/api/artists?query=${query}`);
			const data: GetArtistResponse = await res.json();
			setSuggestions(data.artists.filter(artist => artist.popularity > 30));
		};

		const debounceFetch = setTimeout(() => {
			fetchSuggestions();
		}, 500);

		return () => clearTimeout(debounceFetch);
	}, [query]);

	const updateSelection = (artist: Artist) => {
		if (selectedArtists.length === 5) {
			// Show that cannot add more than 5
			return;
		}
		if (selectedArtists.find(a => a.id === artist.id)) {
			// show that cannot add same artist again
			return;
		}
		addArtist(artist);
	};

	return (
		<>
			<div className={`flex flex-col gap-y-5 rounded-lg bg-black px-4 pb-4 pt-4 text-white shadow-lg ${className}`}>
				<div className='flex min-h-8 flex-row items-center gap-x-3'>
					<label htmlFor='search_artist' className='rounded-lg px-2 text-lg outline outline-1'>
						Artists
					</label>
					<ul className='flex flex-row gap-x-2'>
						{selectedArtists.map(artist => {
							const image = artist.images.at(0)!;
							return (
								<li key={artist.id} className='cursor-pointer'>
									<Image
										src={image.url}
										width={image.width}
										height={image.height}
										alt={artist.name}
										title={artist.name}
										className='h-8 w-8 rounded-full outline-dashed outline-1 outline-white'
										onClick={() => removeArtist(artist.id)}
									/>
								</li>
							);
						})}
						{Array.from({ length: 5 - selectedArtists.length }).map((_, index) => {
							return (
								<li key={index}>
									<div className='h-8 w-8 rounded-full outline-dashed outline-1 outline-white'></div>
								</li>
							);
						})}
					</ul>
				</div>
				<input
					type='text'
					id='search_artist'
					value={query}
					onChange={e => setQuery(e.target.value)}
					className='w-full rounded-lg bg-black px-2 py-2 placeholder-gray-300/90 outline outline-1 outline-white'
					placeholder='Search An Artist'
				/>
				<ul className='flex flex-col gap-y-1'>
					{suggestions.map(artist => {
						const image = artist.images.at(0)!;
						return (
							<li
								key={artist.id}
								className='flex cursor-pointer select-none flex-row items-center gap-x-2 rounded-full px-1 py-1 hover:bg-white/20 hover:outline-dashed hover:outline-1'
								onClick={() => updateSelection(artist)}
							>
								<Image
									src={image.url}
									width={image.width}
									height={image.height}
									alt={artist.name}
									className='h-12 w-12 rounded-full'
								/>
								<h1>{artist.name}</h1>
							</li>
						);
					})}
				</ul>
			</div>
		</>
	);
}
