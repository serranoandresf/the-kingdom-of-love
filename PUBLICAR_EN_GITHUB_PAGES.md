# Publicar THE KINGDOM OF LOVE con GitHub Pages

El repositorio oficial es **https://github.com/mixmeltco/the-kingdom-of-love**. El despliegue se realiza con GitHub Actions; no se usa Netlify.

## 1. Subir el videojuego completo

1. Descarga y descomprime el ZIP Auralia V5.
2. Instala Git for Windows si aún no lo tienes: https://git-scm.com/download/win.
3. Abre PowerShell en la carpeta raíz descomprimida, donde están `index.html`, `src`, `assets` y `SUBIR_A_GITHUB.ps1`.
4. Ejecuta:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\SUBIR_A_GITHUB.ps1
```

5. Cuando pregunte por la dirección del repositorio, pulsa Enter para usar el valor predeterminado `https://github.com/mixmeltco/the-kingdom-of-love.git`.
6. Si Git solicita autenticación, completa el inicio de sesión de Git Credential Manager en el navegador.

El script clona el repositorio existente (que ya contiene el README y el workflow inicial), copia encima la versión V5, crea un commit y hace push a `main`. Así evita el error de historial no relacionado que produciría un `git init` directo sobre un repositorio que ya tiene commits.

## 2. Activar GitHub Pages

Después de subir el proyecto completo:

1. Abre https://github.com/mixmeltco/the-kingdom-of-love/settings/pages.
2. En **Build and deployment → Source**, selecciona **GitHub Actions**.
3. Abre la pestaña **Actions** y espera a que termine correctamente el workflow “Publicar THE KINGDOM OF LOVE en GitHub Pages”.
4. GitHub mostrará el enlace publicado en Settings → Pages y en el entorno `github-pages` del workflow.

El workflow está en `.github/workflows/pages.yml`. Cada push a `main` vuelve a publicar el sitio.

## 3. Configurar la URL real y la vista previa para WhatsApp

Cuando GitHub Pages muestre la URL real, normalmente `https://mixmeltco.github.io/the-kingdom-of-love/`, abre PowerShell en la carpeta del proyecto y ejecuta:

```powershell
node .\tools\set-github-pages-url.cjs "https://mixmeltco.github.io/the-kingdom-of-love/"
```

Después vuelve a ejecutar el script de subida desde la misma carpeta descomprimida:

```powershell
.\SUBIR_A_GITHUB.ps1
```

El script vuelve a clonar el repositorio y sube los cambios locales. Esto configura la URL canónica y las etiquetas Open Graph/Twitter, incluida la imagen de vista previa de WhatsApp.

## 4. Comprobación

Abre la URL publicada en una ventana privada y, después, en un teléfono. Recorre el menú, selección de protagonista, primer capítulo y controles táctiles antes de compartirla.

## 5. Guardado

El guardado se realiza en el almacenamiento del navegador del dispositivo. El avance de Vannesa en su teléfono no se sincroniza automáticamente con tu computador. Para sincronizar dispositivos haría falta un backend, fuera del alcance de esta versión estática.
