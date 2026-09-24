/**
 * Applies the realm settings to a Keycloak that already exists (the realm
 * file is only imported when the Keycloak database is created):
 *   - the user profile of the realm file: sign-up only asks for an e-mail and a password;
 *   - the SMTP server Keycloak uses for its own e-mails (address verification,
 *     forgotten password), when KEYCLOAK_SMTP_HOST is set;
 *   - the mandatory address verification, when KEYCLOAK_VERIFY_EMAIL is set
 *     (true in production);
 *   - the login theme of the realm file (WorkHoraire's sign-in pages) and
 *     the sessions of "Rester connecté" (14 days idle, 30 days at most);
 *   - the login events (sign-ins, failures, password resets), kept 180 days;
 *   - no direct password grant on the realm's admin-cli client (a sign-in
 *     endpoint without the login page).
 *
 * Usage:  node infrastructure/keycloak/apply-realm-settings.mjs [--env-file <path>] [--dry-run] [--otp <code>]
 * The env file (default: .env at the root of the repository) gives
 * KEYCLOAK_ADMIN, KEYCLOAK_ADMIN_PASSWORD, KEYCLOAK_AUTH_SERVER_URL,
 * KEYCLOAK_REALM and the optional KEYCLOAK_SMTP_* and KEYCLOAK_VERIFY_EMAIL.
 * --otp: the current one-time code of the administrator, once two-factor
 * authentication is on for that account.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = new URL('../../', import.meta.url);
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
function option(name) {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
}
const envFileArgument = option('--env-file');
const envFile = envFileArgument ? resolve(envFileArgument) : new URL('.env', root);
const otp = option('--otp');

// The same reading as docker compose: KEY=value, value optionally quoted.
function readEnv(file) {
  const env = {};
  for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
    const separator = line.indexOf('=');
    if (separator > 0 && !line.trimStart().startsWith('#')) {
      env[line.slice(0, separator).trim()] = line
        .slice(separator + 1)
        .trim()
        .replace(/^"(.*)"$/, '$1')
        .replace(/^'(.*)'$/, '$1');
    }
  }
  return env;
}

const env = readEnv(envFile);
const realmFile = JSON.parse(
  readFileSync(new URL('infrastructure/keycloak/realms/workhoraire-realm.json', root), 'utf8'),
);
const profile =
  realmFile.components['org.keycloak.userprofile.UserProfileProvider'][0].config[
    'kc.user.profile.config'
  ][0];
const adminCli = realmFile.clients.find((client) => client.clientId === 'admin-cli');
const server = env.KEYCLOAK_AUTH_SERVER_URL || 'http://localhost:8180';
const realm = env.KEYCLOAK_REALM || 'workhoraire';

// Realm attributes: only the fields present are changed by Keycloak.
const realmUpdate = {
  loginTheme: realmFile.loginTheme,
  ssoSessionIdleTimeoutRememberMe: realmFile.ssoSessionIdleTimeoutRememberMe,
  ssoSessionMaxLifespanRememberMe: realmFile.ssoSessionMaxLifespanRememberMe,
  eventsEnabled: realmFile.eventsEnabled,
  eventsExpiration: realmFile.eventsExpiration,
};
if (env.KEYCLOAK_SMTP_HOST) {
  const user = env.KEYCLOAK_SMTP_USER || '';
  realmUpdate.smtpServer = {
    host: env.KEYCLOAK_SMTP_HOST,
    port: env.KEYCLOAK_SMTP_PORT || '587',
    from: env.KEYCLOAK_SMTP_FROM || 'no-reply@localhost',
    fromDisplayName: 'WorkHoraire',
    starttls: env.KEYCLOAK_SMTP_STARTTLS || 'false',
    ssl: 'false',
    auth: user ? 'true' : 'false',
    ...(user ? { user, password: env.KEYCLOAK_SMTP_PASSWORD || '' } : {}),
  };
}
if (env.KEYCLOAK_VERIFY_EMAIL === 'true' || env.KEYCLOAK_VERIFY_EMAIL === 'false') {
  realmUpdate.verifyEmail = env.KEYCLOAK_VERIFY_EMAIL === 'true';
}

// With the e-mail as identifier, Keycloak does not show the username field.
const signUpFields = JSON.parse(profile)
  .attributes.filter((attribute) => attribute.permissions?.edit?.includes('user'))
  .map((attribute) => attribute.name)
  .filter((name) => !(realmFile.registrationEmailAsUsername && name === 'username'));
console.log(`Realm "${realm}" sur ${server} :`);
console.log(`- champs de l'inscription : ${signUpFields.join(', ')}`);
console.log(
  `- e-mails de Keycloak : ${realmUpdate.smtpServer ? `${realmUpdate.smtpServer.host}:${realmUpdate.smtpServer.port}` : 'inchangés (KEYCLOAK_SMTP_HOST absent)'}`,
);
console.log(
  `- vérification des adresses : ${'verifyEmail' in realmUpdate ? (realmUpdate.verifyEmail ? 'obligatoire' : 'désactivée') : 'inchangée'}`,
);
console.log(`- thème des pages de connexion : ${realmUpdate.loginTheme}`);
console.log(
  `- « Rester connecté » : ${realmUpdate.ssoSessionIdleTimeoutRememberMe / 86400} jours sans activité, ${realmUpdate.ssoSessionMaxLifespanRememberMe / 86400} jours au plus`,
);
console.log(
  `- journal des connexions : ${realmUpdate.eventsEnabled ? `activé, conservé ${realmUpdate.eventsExpiration / 86400} jours` : 'désactivé'}`,
);
console.log(
  `- client admin-cli du realm : connexion directe par mot de passe ${adminCli.directAccessGrantsEnabled ? 'autorisée' : 'refusée'}`,
);

const placeholders = Object.entries(env)
  .filter(([name, value]) => name.startsWith('KEYCLOAK_') && /^<.*>$/.test(value))
  .map(([name]) => name);
if (placeholders.length > 0) {
  console.error(`Valeurs à remplacer (ou à vider) dans ${envFile} : ${placeholders.join(', ')}`);
  if (!dryRun) {
    process.exit(1);
  }
}

if (dryRun) {
  console.log('Essai à blanc : rien n’a été envoyé à Keycloak.');
  process.exit(0);
}

const login = await fetch(`${server}/realms/master/protocol/openid-connect/token`, {
  method: 'POST',
  headers: { 'content-type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    grant_type: 'password',
    client_id: 'admin-cli',
    username: env.KEYCLOAK_ADMIN,
    password: env.KEYCLOAK_ADMIN_PASSWORD,
    ...(otp ? { totp: otp } : {}),
  }),
});
if (!login.ok) {
  console.error(
    `Connexion administrateur refusée par Keycloak (${login.status}) : vérifiez KEYCLOAK_ADMIN et KEYCLOAK_ADMIN_PASSWORD, et ajoutez --otp <code> si la double authentification est active.`,
  );
  process.exit(1);
}
const { access_token: token } = await login.json();
const headers = { authorization: `Bearer ${token}`, 'content-type': 'application/json' };

async function request(method, path, what, body) {
  const response = await fetch(`${server}/admin/realms/${realm}${path}`, { method, headers, body });
  if (!response.ok) {
    console.error(`Keycloak a refusé ${what} (${response.status}) : ${await response.text()}`);
    process.exit(1);
  }
  return response;
}

await request('PUT', '/users/profile', 'le profil utilisateur', profile);
await request('PUT', '', 'les réglages du realm', JSON.stringify(realmUpdate));
const [client] = await (
  await request('GET', '/clients?clientId=admin-cli', 'la lecture du client admin-cli')
).json();
if (client && client.directAccessGrantsEnabled !== adminCli.directAccessGrantsEnabled) {
  await request(
    'PUT',
    `/clients/${client.id}`,
    'le réglage du client admin-cli',
    JSON.stringify({ ...client, directAccessGrantsEnabled: adminCli.directAccessGrantsEnabled }),
  );
}
console.log('Réglages appliqués.');
