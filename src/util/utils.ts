export async function getAccessToken(): Promise<string> {
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
	});
	const data: AccessTokenResponse = await res.json();
	console.log(data);
	return data.access_token;
}

export interface AccessTokenResponse {
	access_token: string;
	token_type: string;
	expires_in: number;
}
