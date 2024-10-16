import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
	const backendDomain = request.headers.get('host');
	if (!backendDomain) {
		return new NextResponse('Forbidden', { status: 403 });
	}

	const frontendDomain = request.headers.get('origin') || request.headers.get('referer');
	if (!frontendDomain) {
		return new NextResponse('Forbidden', { status: 403 });
	}

	if (new URL(frontendDomain).host !== backendDomain) {
		return new NextResponse('Forbidden', { status: 403 });
	}

	return NextResponse.next();
}

export const config = {
	matcher: '/api/:path*',
};
