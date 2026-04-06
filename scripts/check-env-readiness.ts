const failures: string[] = [];
const warnings: string[] = [];

function requireValue(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    failures.push(`${name} is required.`);
  }

  return value;
}

const siteUrl = requireValue("NEXT_PUBLIC_SITE_URL");
const adminUsername = requireValue("ADMIN_USERNAME");
const adminPassword = requireValue("ADMIN_PASSWORD");
const databaseUrl = requireValue("DATABASE_URL");

if (siteUrl) {
  try {
    const url = new URL(siteUrl);

    if (url.protocol !== "https:" && url.hostname !== "localhost") {
      failures.push("NEXT_PUBLIC_SITE_URL must use https outside local development.");
    }
  } catch {
    failures.push("NEXT_PUBLIC_SITE_URL must be a valid URL.");
  }
}

if (adminUsername && ["admin", "user", "test"].includes(adminUsername.toLowerCase())) {
  warnings.push("ADMIN_USERNAME is generic. Use a less obvious production username before launch.");
}

if (adminPassword) {
  if (adminPassword === "replace-with-a-long-random-password") {
    failures.push("ADMIN_PASSWORD is still using the placeholder value.");
  }

  if (adminPassword.length < 20) {
    failures.push("ADMIN_PASSWORD should be at least 20 characters for production.");
  }
}

if (databaseUrl) {
  try {
    const url = new URL(databaseUrl);

    if (!["postgres:", "postgresql:"].includes(url.protocol)) {
      failures.push("DATABASE_URL must be a postgres/postgresql URL.");
    }

    if (decodeURIComponent(url.password).length < 20) {
      warnings.push("DATABASE_URL password is short. Rotate to a long random app-role password before public launch.");
    }

    if (url.username.startsWith("postgres")) {
      warnings.push("DATABASE_URL appears to use the postgres role. Prefer a least-privileged app role for runtime.");
    }
  } catch {
    failures.push("DATABASE_URL must be a valid URL.");
  }
}

console.log("Checked production environment readiness.");

if (warnings.length) {
  console.log("\nWarnings:");
  for (const warning of warnings) {
    console.log(`- ${warning}`);
  }
}

if (failures.length) {
  console.error("\nEnvironment blockers:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("\nEnvironment readiness checks passed.");
