# VanOS

Next.js + Firebase (Auth, Firestore, Realtime Database, Storage).

## Desarrollo local

```bash
npm install
npm run dev
```

Copia `.env.example` a `.env.local` y rellena las variables (Firebase + `SESSION_SECRET`).

### La web en Vercel sigue mostrando la plantilla de Next.js (“Get started by editing…”)

Eso significa que **el proyecto de Vercel no está construyendo el mismo código** que tu repo local (o un deploy antiguo sigue en caché). Revisa en orden:

1. **Vercel → tu proyecto → Settings → Git**  
   - **Connected Git Repository** debe ser el repo donde haces `push` (p. ej. `buenoruizv-glitch/vanos-saas-beta`).  
   - **Production Branch** = `main` (o la rama que uses para producción).

2. **Settings → General → Root Directory**  
   - Debe estar **vacío** o apuntar a la raíz del Next.js (donde están `app/` y `package.json`). Si apunta a otra carpeta, Vercel compila **otro** `app/page.tsx` (a veces el template por defecto).

3. **Deployments**  
   - Abre el último deploy de **Production** y mira **Build Logs**: debe ejecutarse `prebuild` → `[verify-vanos-page] OK` y `next build` sin error. Si el build falla, Vercel puede seguir sirviendo un artefacto viejo.

4. Tras corregir lo anterior: **Deployments → … → Redeploy** (sin usar caché, si la opción está disponible) o un **push** nuevo a `main`.

En la home de producción, si el deploy es el correcto, al final del contenido aparece una línea pequeña **Deploy `abcdefg`** (SHA de Vercel). Si no aparece o el texto sigue siendo el de la plantilla Next, el dominio **no** está sirviendo este proyecto o ese build.

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

### Subir el repo con un clic (Windows)

1. Copia `git-remote.local.example` a **`git-remote.local`** y pon la URL HTTPS de tu repo (GitHub/GitLab). Ese archivo no se sube a Git.
2. Doble clic en **`push-to-github.bat`** o ejecuta `npm run git:push`.

Requiere [Git para Windows](https://git-scm.com/download/win) y que ya hayas iniciado sesión una vez (`git credential manager` o SSH). La primera vez GitHub puede pedir login en el navegador.
