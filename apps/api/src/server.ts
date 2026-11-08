import { buildApp } from './app';
import { DEFAULT_IP_HASH_SALT, loadEnv } from './config/env';

const env = loadEnv();
const app = await buildApp({ env });

if (env.NODE_ENV === 'production' && env.IP_HASH_SALT === DEFAULT_IP_HASH_SALT) {
  app.log.warn('IP_HASH_SALT ist nicht gesetzt – bitte für den Produktivbetrieb einen eigenen Wert hinterlegen.');
}
if (!env.SMTP_HOST) {
  app.log.warn('SMTP_HOST ist nicht gesetzt – Anfragen werden gespeichert, aber nicht per E-Mail gemeldet.');
}

let closing = false;
async function shutdown(signal: NodeJS.Signals) {
  if (closing) return;
  closing = true;
  app.log.info({ signal }, 'Server wird beendet …');
  try {
    await app.close();
    process.exit(0);
  } catch (error) {
    app.log.error(error, 'Fehler beim Beenden');
    process.exit(1);
  }
}

process.once('SIGINT', () => void shutdown('SIGINT'));
process.once('SIGTERM', () => void shutdown('SIGTERM'));

try {
  await app.listen({ host: env.HOST, port: env.PORT });
} catch (error) {
  app.log.error(error, 'Server konnte nicht gestartet werden');
  process.exit(1);
}
