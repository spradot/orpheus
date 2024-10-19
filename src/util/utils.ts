import { Redis } from '@upstash/redis';
import type { ClientCredentialsFlowAccessTokenObject } from 'spotify-api-types';

const redis = new Redis({
	url: process.env['KV_URL'],
	token: process.env['KV_TOKEN'],
});

export async function getAccessToken(): Promise<string> {
	console.log('Token Request Made.');

	const accessTokenData = await redis.get<AccessTokenData>('accessTokenData');
	if (accessTokenData) {
		const { accessToken, expiresAt } = accessTokenData;
		const currentTimestamp = new Date().getTime();
		const buffer = 10 * 1000; // 10 sec
		if (expiresAt > currentTimestamp + buffer) return accessToken;
	}

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

	const currentTimestamp = new Date().getTime();
	const accessTokenExpiryTimestamp = currentTimestamp + data.expires_in * 1000; // Convert 'data.expires_in' from sec to ms
	redis.set<AccessTokenData>('accessTokenData', {
		accessToken: data.access_token,
		expiresAt: accessTokenExpiryTimestamp,
	});
	return data.access_token;
}

interface AccessTokenData {
	accessToken: string;
	expiresAt: number;
}
