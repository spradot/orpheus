import { Redis } from '@upstash/redis';
import type { ClientCredentialsFlowAccessTokenObject } from 'spotify-api-types';

const redis = new Redis({
	url: process.env['KV_URL'],
	token: process.env['KV_TOKEN'],
});

export async function getAccessToken(): Promise<string> {
	const accessToken = await redis.get<string>('accessToken');
	if (accessToken) return accessToken;

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
