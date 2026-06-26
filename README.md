# Directorio de Emergencias Terremoto Venezuela - Información

Este es un portal web de consolidación de recursos, enlaces de ayuda y registro de pacientes de emergencia, desarrollado en respuesta al terremoto de magnitud 7.5 en Venezuela (24 de junio de 2026).

La plataforma está diseñada con una arquitectura estática ligera (HTML5, CSS3 y JavaScript Vainilla) para garantizar un tiempo de carga mínimo y consumo de datos optimizado para dispositivos móviles en zonas con baja cobertura telefónica.

## Características

1. **Enlaces de Ayuda:** Consolidado de plataformas oficiales de búsqueda (como `venezuelatebusca.com` y `desaparecidosterremotovenezuela.com`), comunicados y reportes científicos (FUNVISIS).
2. **Líneas de Emergencia Directas:** Panel de marcación rápida para llamar a Bomberos de Maracaibo, Cruz Roja RCF y soporte psicológico.
3. **Galería de Comunicados:** Mapeo de fotos de comunicados, QR de auxilio y listas de acopio con visor Lightbox integrado para zoom y lectura en pantalla completa.
4. **Buscador de Pacientes:** Base de datos local transcribiendo los heridos ingresados en el Hospital Miguel Pérez Carreño (La Yaguara) trasladados desde La Guaira. Permite búsquedas instantáneas por nombre o cédula.
5. **Subida de Imágenes (Cloudinary):** Integración con Cloudinary desde el navegador mediante firmas criptográficas en el lado del cliente (SHA-1 por Web Crypto API) para subir imágenes y agregar nuevos enlaces o comunicados de forma dinámica.

## Estructura de Archivos

* `index.html`: Estructura principal, paneles de navegación por pestañas y ventanas modales.
* `styles.css`: Estilos en modo oscuro premium, adaptabilidad móvil, cuadrículas flexibles y efectos visuales de transición.
* `app.js`: Base de datos de recursos, transcripción de pacientes, lógica de filtrado y cargador de imágenes a Cloudinary.

## Configuración de Cloudinary

Para habilitar la carga de imágenes, los parámetros se configuran automáticamente desde la aplicación. Puedes modificar el **Cloud Name** directamente desde el panel de configuraciones en el portal web (se almacena en el `localStorage` de tu navegador para mayor seguridad).

Los valores por defecto cargados en el código son:
* **API Key:** `373228284253249`
* **API Secret:** `orkon2ybXvI5H4LcGPG9PlKSOXs`
