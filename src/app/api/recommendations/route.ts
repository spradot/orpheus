import { getAccessToken } from '@/util/utils';

export type Track = SpotifyRecommendationResponse['tracks'][number];

export interface GetRecommendationsResponse {
	tracks: Array<Track>;
}

export async function GET(request: Request) {
	const artists = new URL(request.url).searchParams.get('artists');
	const genres = new URL(request.url).searchParams.get('genres');
	const url = encodeURI(`https://api.spotify.com/v1/recommendations?seed_artists=${artists}&seed_genres=${genres}`);
	const accessToken = await getAccessToken();
	const res = await fetch(url, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});
	const data: SpotifyRecommendationResponse = await res.json();
	const resBody: GetRecommendationsResponse = {
		tracks: data.tracks,
	};
	return Response.json(resBody);
}

interface SpotifyRecommendationResponse {
	seeds: Array<{
		afterFilteringSize: number;
		afterRelinkingSize: number;
		href: string;
		id: string;
		initialPoolSize: number;
		type: string;
	}>;
	tracks: Array<{
		album: {
			album_type: string;
			total_tracks: number;
			available_markets: Array<string>;
			external_urls: {
				spotify: string;
			};
			href: string;
			id: string;
			images: Array<{
				url: string;
				height: number;
				width: number;
			}>;
			name: string;
			release_date: string;
			release_date_precision: string;
			restrictions: {
				reason: string;
			};
			type: string;
			uri: string;
			artists: Array<{
				external_urls: {
					spotify: string;
				};
				href: string;
				id: string;
				name: string;
				type: string;
				uri: string;
			}>;
		};
		artists: Array<{
			external_urls: {
				spotify: string;
			};
			href: string;
			id: string;
			name: string;
			type: string;
			uri: string;
		}>;
		available_markets: Array<string>;
		disc_number: number;
		duration_ms: number;
		explicit: boolean;
		external_ids: {
			isrc: string;
			ean: string;
			upc: string;
		};
		external_urls: {
			spotify: string;
		};
		href: string;
		id: string;
		is_playable: boolean;
		linked_from: unknown;
		restrictions: {
			reason: string;
		};
		name: string;
		popularity: number;
		preview_url: string;
		track_number: number;
		type: string;
		uri: string;
		is_local: boolean;
	}>;
}
