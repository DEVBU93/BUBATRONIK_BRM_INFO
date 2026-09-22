
# Calistenia Bubatronik v2

Esta vuelta mejora dos cosas principales:

1. **Estilo visual BRM / Bubatronik Radio**
   - Fondo oscuro con neones verde, fucsia, amarillo y azul eléctrico.
   - Cabecera con pulso más radiofónico y menos plantilla genérica.
   - Sidebar con estado actual y navegación más clara.

2. **Fallbacks de imágenes**
   - Los días prueban `.webp`, `.jpg`, `DIA` y `Dia` para evitar roturas por mayúsculas o extensión.
   - Las fichas técnicas prueban varios nombres comunes.
   - Tracker, certificado, calentamiento, normas y WOD también tienen rutas alternativas.

## Archivos
- `index.html`
- `calistenia.css`
- `calistenia.js`
- `data/programa-28-niveles.json`

## Nota
Si algún archivo aún no carga, revisa el nombre exacto en `assets/img` y añádelo como alternativa en `calistenia.js` o en el JSON.
