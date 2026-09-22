
# Calistenia Bubatronik · Integración en .info

Esta carpeta contiene la primera versión del módulo `/calistenia` para BRM_BUBATRONIK_INFO.

## Estructura

- `calistenia/index.html`: página principal de Calistenia.
- `calistenia/calistenia.css`: estilos básicos.
- `calistenia/calistenia.js`: lógica de pestañas y tracker local.
- `calistenia/data/programa-28-niveles.json`: definición de niveles 1–28.

## Cómo integrar

1. Copia la carpeta `calistenia/` dentro del proyecto de la web `.info`.
2. Añade un enlace en tu `index.html` principal:

   ```html
   <a href="/calistenia/" class="card card-calistenia">
     <h2>Entrenamiento / Calistenia</h2>
     <p>Programa Bubatronik · 28 niveles · Técnica > Ego</p>
   </a>
   ```

3. Ajusta las rutas de las imágenes en `calistenia.js` y `data/programa-28-niveles.json`
   para que coincidan exactamente con los nombres que ya tienes en `assets/img`.

4. Haz commit en tu repositorio y despliega. La ruta `brm.worldmos.info/calistenia` debería
   abrir esta página y guardar el progreso en el navegador mediante `localStorage`.

## Notas

- El JSON apunta a `/assets/img/DIA1.webp` ... `/assets/img/DIA28.webp` como ejemplo.
  Si tus nombres son distintos, cámbialos.
- Las fichas técnicas se cargan como `FICHA01.webp` ... `FICHA12.webp`. Ajusta según
  tu inventario real.
- El diseño es básico pero funcional; puedes retocar colores y tipografía para acercarlo
  al visual del índice y tracker.

