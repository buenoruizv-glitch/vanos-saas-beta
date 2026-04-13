# VanOS

Next.js + Firebase (Auth, Firestore, Realtime Database, Storage).

## Desarrollo local

```bash
npm install
npm run dev
```

Copia `.env.example` a `.env.local` y rellena las variables (Firebase + `SESSION_SECRET`).

## Presentar al cliente sin coste de hosting

**Importante:** [Firebase App Hosting](https://firebase.google.com/docs/app-hosting) (Next.js completo en dominio `*.hosted.app`) **exige el plan Blaze** (facturación Google Cloud con tarjeta). El plan Spark gratuito **no** incluye ese alojamiento para SSR/API.

Para **0 € y sin activar facturación en Google** (plan Hobby de Vercel):

1. Conecta el repo (o usa la CLI): `npx vercel link` y `npx vercel deploy --prod`.
2. En el [dashboard de Vercel](https://vercel.com) → proyecto → **Settings → Environment Variables**, pega las mismas claves que en `.env.local` (`NEXT_PUBLIC_*`, `FIREBASE_ADMIN_*`, `SESSION_SECRET`, etc.). **No hace falta** configurar la URL pública a mano: en build y runtime Vercel define `VERCEL_URL` y la app la usa (`lib/site-url.ts`).
3. En **Firebase Console → Authentication → Settings → Authorized domains**, añade tu dominio de Vercel (p. ej. `tu-proyecto.vercel.app`) y el dominio de preview si lo usas.

Firebase sigue pudiendo estar en **plan Spark** (cuota gratuita) como backend; solo el **frontend Next.js** corre en Vercel.

### Enlace de producción (ejemplo)

Tras desplegar, Vercel asigna una URL tipo `https://<proyecto>.vercel.app` (alias estable si lo configuras en el panel).

Si más adelante quieres **URL 100 % Firebase**, activa Blaze en el proyecto y usa `firebase deploy` con App Hosting según [la documentación](https://firebase.google.com/docs/app-hosting/get-started).

## Firebase (reglas e índices)

```bash
npm run firebase:deploy:rules
```

(Requiere `firebase login` y proyecto en `.firebaserc`.)

## Scripts útiles

- `npm run beta:check-env` — comprueba variables mínimas para una beta.
- `node scripts/inject-admin-from-json.cjs <ruta.json>` — rellena Admin SDK en `.env.local` desde un JSON de cuenta de servicio.
