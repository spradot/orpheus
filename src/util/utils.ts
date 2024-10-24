import { Redis } from '@upstash/redis';
import { randomBytes } from 'crypto';
import type { ClientCredentialsFlowAccessTokenObject, TrackObject } from 'spotify-api-types';

export const redis = new Redis({
	url: process.env['KV_URL'],
	token: process.env['KV_TOKEN'],
});

export async function getAccessToken(): Promise<string> {
	console.log('Accessing Token From Redis');
	const accessToken = await redis.get<string>('accessToken');
	if (accessToken) return accessToken;
	console.log('Token Not Found in Redis');

	const url = 'https://accounts.spotify.com/api/token';
	const body = new URLSearchParams();
	body.set('grant_type', 'client_credentials');
	const clientId = process.env['CLIENT_ID'];
	const clientSecret = process.env['CLIENT_SECRET'];
	const headers = {
		'Content-Type': 'application/x-www-form-urlencoded',
		Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
	};
	const res = await fetch(url, {
		method: 'POST',
		headers,
		body,
		cache: 'no-store',
	});
	if (!res.ok) {
		const error = await res.text();
		console.log(error);
	}
	const data: ClientCredentialsFlowAccessTokenObject = await res.json();
	console.log('New Token Generated');

	redis.set<string>('accessToken', data.access_token, { ex: data.expires_in });
	return data.access_token;
}

export function formatNumber(num: number) {
	if (num >= 1000000) {
		return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
	} else if (num >= 1000) {
		return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
	} else {
		return num.toString();
	}
}

export function createBase64Id() {
	// Generate 9 random bytes (64 bits) to create base64 string of len 12
	const buffer = randomBytes(9);
	const base64String = buffer.toString('base64url');
	return base64String;
}

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

/**
 * One week in seconds: `1 * 7 * 24 * 60 * 60 = 604800` seconds
 */
export const ONCE_A_WEEK = 1 * 7 * 24 * 60 * 60;

/**
 * One month in seconds: `1 * 28 * 24 * 60 * 60 = 2419200` seconds
 */
export const ONCE_A_MONTH = 1 * 28 * 24 * 60 * 60;
