import type { TrackObject } from 'spotify-api-types';

export class RecommendedTrack {
	id: string;
	artists: Array<{
		id: string;
		name: string;
		openInSpotifyUrl: string;
	}>;
	explicit: boolean;
	openInSpotifyUrl: string;
	name: string;
	popularity: number;
	albumCover: {
		url: string;
		height: number | null;
		width: number | null;
	};

	constructor(track: TrackObject) {
		this.id = track.id;
		this.explicit = track.explicit;
		this.openInSpotifyUrl = track.external_urls.spotify;
		this.name = track.name;
		this.popularity = track.popularity;
		this.artists = track.artists.map(artist => {
			return {
				id: artist.id,
				name: artist.name,
				openInSpotifyUrl: artist.external_urls.spotify,
			};
		});
		const albumCover = track.album.images.at(0)!;
		this.albumCover = { url: albumCover.url, height: albumCover.height ?? null, width: albumCover.width ?? null };
	}
}
