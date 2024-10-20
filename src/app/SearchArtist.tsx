'use client';

import { useZustandStore } from '@/util/store';
import { formatNumber } from '@/util/utils';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { CiUser } from 'react-icons/ci';
import type { ArtistObject } from 'spotify-api-types';
import type { ApiArtistsResponse } from './api/artists/route';

export function SearchArtist() {
	const [query, setQuery] = useState('');
	const [suggestions, setSuggestions] = useState<Array<ArtistObject>>([]);
	const selectedArtists = useZustandStore(state => state.selectedArtists);
	const addArtist = useZustandStore(state => state.addArtist);
	const removeArtist = useZustandStore(state => state.removeArtist);

	const selectedGenres = useZustandStore(state => state.selectedGenres);
	const selectedTracks = useZustandStore(state => state.selectedTracks);

	const totalSelectionCount = selectedArtists.length + selectedGenres.length + selectedTracks.length;

	useEffect(() => {
		if (query === '') {
			setSuggestions([]);
			return;
		}

		const fetchSuggestions = async () => {
			const cachedResults = window.localStorage.getItem(`artists:${query}`);
			if (cachedResults) {
				const cachedArtists: ApiArtistsResponse['artists'] = JSON.parse(cachedResults);
				return setSuggestions(cachedArtists);
			}
			const res = await fetch(`/api/artists?query=${query}`);
			const data: ApiArtistsResponse = await res.json();
			const artists = data.artists.filter(artist => artist.popularity > 30);
			setSuggestions(artists);
			window.localStorage.setItem(`artists:${query}`, JSON.stringify(artists));
		};

		const debounceFetch = setTimeout(() => {
			fetchSuggestions();
		}, 500);

		return () => clearTimeout(debounceFetch);
	}, [query]);

	const updateSelection = (artist: ArtistObject) => {
		if (totalSelectionCount >= 5) {
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
			<div className={`flex w-96 min-w-96 flex-col gap-y-5 rounded-lg bg-black px-4 pb-4 pt-4 text-white shadow-lg`}>
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
										width={image.width!}
										height={image.height!}
										alt={artist.name}
										title={artist.name}
										className='h-8 max-h-8 w-8 min-w-8 rounded-full outline-dashed outline-1 outline-[#1ED760]'
										onClick={() => removeArtist(artist.id)}
									/>
								</li>
							);
						})}
						{Array.from({ length: 5 - selectedArtists.length }).map((_, index) => {
							return (
								<li key={index}>
									<div
										className={`h-8 max-h-8 w-8 min-w-8 rounded-full outline-dashed outline-1 ${totalSelectionCount >= 5 ? 'outline-gray-500' : 'outline-white'}`}
									></div>
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
					spellCheck='false'
				/>
				<ul className='flex flex-col gap-y-1'>
					{suggestions.map(artist => {
						const image = artist.images.at(0);
						return (
							<li
								key={artist.id}
								className='group flex cursor-pointer select-none flex-row items-center gap-x-2 rounded-full px-1 py-1 hover:bg-[#1ED760] hover:text-[#121212]'
								onClick={() => updateSelection(artist)}
							>
								{image ? (
									<Image
										src={image.url}
										width={image.width!}
										height={image.height!}
										alt={artist.name}
										className='h-12 min-h-12 w-12 min-w-12 rounded-full'
									/>
								) : (
									<CiUser className='h-12 min-h-12 w-12 min-w-12 rounded-full fill-white' />
								)}
								<div className='flex w-full flex-col overflow-hidden'>
									<h1 className='overflow-hidden text-ellipsis whitespace-nowrap text-white group-hover:text-[#121212]'>
										{artist.name}
									</h1>
									<h1 className='overflow-hidden text-ellipsis whitespace-nowrap text-xs text-gray-400 group-hover:text-gray-200'>
										{formatNumber(artist.followers.total)} Followers
									</h1>
								</div>
							</li>
						);
					})}
				</ul>
			</div>
		</>
	);
}
