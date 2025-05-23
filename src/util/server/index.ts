import { Redis } from '@upstash/redis';
import { randomBytes } from 'crypto';
import type { ClientCredentialsFlowAccessTokenObject } from 'spotify-api-types';

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

export function createBase64Id() {
	// Generate 9 random bytes (64 bits) to create base64 string of len 12
	const buffer = randomBytes(9);
	const base64String = buffer.toString('base64url');
	return base64String;
}

/**
 * One week in seconds: `1 * 7 * 24 * 60 * 60 = 604800` seconds
 */
export const ONCE_A_WEEK = 1 * 7 * 24 * 60 * 60;

/**
 * One month in seconds: `1 * 28 * 24 * 60 * 60 = 2419200` seconds
 */
export const ONCE_A_MONTH = 1 * 28 * 24 * 60 * 60;
