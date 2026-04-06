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
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
