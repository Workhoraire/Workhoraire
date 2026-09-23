/**
 * Applies the user profile of the realm file to a Keycloak that already exists
 * (the realm file is only imported when the Keycloak database is created).
 * With it, the sign-up page only asks for an e-mail and a password.
 *
 * Usage, from any folder:  node infrastructure/keycloak/apply-user-profile.mjs [--dry-run]
 * Reads KEYCLOAK_ADMIN, KEYCLOAK_ADMIN_PASSWORD, KEYCLOAK_AUTH_SERVER_URL and
 * KEYCLOAK_REALM from the .env file at the root of the repository.
 */
import { readFileSync } from 'node:fs';

const root = new URL('../../', import.meta.url);
const dryRun = process.argv.includes('--dry-run');

function readEnv() {
  const env = {};
  for (const line of readFileSync(new URL('.env', root), 'utf8').split(/\r?\n/)) {
    const separator = line.indexOf('=');
    if (separator > 0 && !line.trimStart().startsWith('#')) {
      env[line.slice(0, separator).trim()] = line.slice(separator + 1).trim().replace(/^"(.*)"$/, '$1');
    }
  }
  return env;
}

const env = readEnv();
const realmFile = JSON.parse(
  readFileSync(new URL('infrastructure/keycloak/realms/workhoraire-realm.json', root), 'utf8'),
);
const profile =
  realmFile.components['org.keycloak.userprofile.UserProfileProvider'][0].config[
    'kc.user.profile.config'
  ][0];
const server = env.KEYCLOAK_AUTH_SERVER_URL || 'http://localhost:8180';
const realm = env.KEYCLOAK_REALM || 'workhoraire';

// With the e-mail as identifier, Keycloak does not show the username field.
const signUpFields = JSON.parse(profile)
  .attributes.filter((attribute) => attribute.permissions?.edit?.includes('user'))
  .map((attribute) => attribute.name)
  .filter((name) => !(realmFile.registrationEmailAsUsername && name === 'username'));
console.log(`Realm "${realm}" sur ${server} : champs de l'inscription = ${signUpFields.join(', ')}.`);

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
  }),
});
if (!login.ok) {
  console.error(`Connexion administrateur refusée par Keycloak (${login.status}) : vérifiez KEYCLOAK_ADMIN et KEYCLOAK_ADMIN_PASSWORD dans .env.`);
  process.exit(1);
}
const { access_token: token } = await login.json();

const update = await fetch(`${server}/admin/realms/${realm}/users/profile`, {
  method: 'PUT',
  headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
  body: profile,
});
if (!update.ok) {
  console.error(`Keycloak a refusé le profil (${update.status}) : ${await update.text()}`);
  process.exit(1);
}
console.log('Profil appliqué : l’inscription ne demande plus que l’e-mail et le mot de passe.');
