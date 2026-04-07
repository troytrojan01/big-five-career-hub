import { NextRequest, NextResponse } from "next/server";

function unauthorized(message = "Authentication required") {
  return new NextResponse(message, {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Big Five Career Hub Admin"',
    },
  });
}

function getBasicAuthCredentials(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader?.startsWith("Basic ")) {
    return null;
  }

  const decoded = atob(authHeader.slice("Basic ".length));
  const separatorIndex = decoded.indexOf(":");

  if (separatorIndex === -1) {
    return null;
  }

  return {
    username: decoded.slice(0, separatorIndex),
    password: decoded.slice(separatorIndex + 1),
  };
}

export function middleware(request: NextRequest) {
  if (request.nextUrl.hostname === "www.bigtechjob.com") {
    const url = request.nextUrl.clone();
    url.hostname = "bigtechjob.com";

    return NextResponse.redirect(url, 308);
  }

  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin") || request.nextUrl.pathname.startsWith("/api/admin");
  if (!isAdminRoute) {
    return NextResponse.next();
  }

  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const isProduction = process.env.NODE_ENV === "production";

  if (!adminUsername || !adminPassword) {
    if (isProduction) {
      return unauthorized("Admin credentials are not configured.");
    }

    return NextResponse.next();
  }

  const credentials = getBasicAuthCredentials(request);

  if (!credentials || credentials.username !== adminUsername || credentials.password !== adminPassword) {
    return unauthorized();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
