# Q-Finder | Startup ficticia para buscar FAQs similares utilizando similitud de coseno, Docker, FastAPI y Next.js 14 🔍

Hola 👋, soy Emiliano y este es el prototipo que desarrollé para Q-Finder. Esto fue realizado para una entrevista técnica de [entropia ai](https://www.entropia.ai/) 

El objetivo era crear algo rápido, simple y efectivo que permita registrar FAQs y encontrar respuestas similares basadas en consultas del usuario, utilizando el algoritmo de similitud de coseno

Comencé esta solución utilizando una abstracción de scikit-learn para asegurarme que todo funcionara correctamente. Luego, escribí tests para mantener consistencia mientras migraba la solución 

## Descripción técnica de la vectorización

Utilicé la técnica conocida como "hashing trick", que consiste en transformar texto en vectores numéricos de dimensión fija (en este caso de 128 dimensiones). Cada palabra del texto se convierte en un valor numérico usando la función hash MD5. Este hash se asigna a un índice específico del vector usando módulo 128, incrementando el contador en esa posición. Así, el vector representa la frecuencia de palabras, facilitando la comparación entre textos mediante similitud de coseno. Esta solución no depende de modelos externos ni requiere entrenamiento previo, lo que la hace rápida, ligera y adecuada para un prototipo funcional y autocontenido.

## ¿Por qué elegí esta técnica de vectorización?

- Es rápida, ligera y basada en conceptos matemáticos.
- No requiere modelos externos ni entrenamiento, ni es muy compleja.
- Captura suficiente información léxica básica para validar el flujo completo del proyecto (desde búsqueda hasta resultados).
- *Fue específicamente solicitada en el desafío técnico.*

## Justificación técnica del uso de MD5

Elegí la función hash MD5 porque:
- Es rápida y consistente, esencial para mantener baja latencia en búsquedas.
- Produce una distribución uniforme de valores, lo que minimiza colisiones al mapear palabras en índices del vector.
- A pesar de ser criptográficamente insegura (irrelevante para este caso), es altamente eficiente y adecuada para este uso específico de hashing determinístico en un prototipo.

## Resultados del algoritmo

Aunque existen métodos más avanzados como *fuzzy search* (gestionan mejor errores tipográficos), el objetivo era validar rápidamente la idea y el flujo completo (end-to-end). No recomendaría utilizar este algoritmo en producción, pero es adecuado para este prototipo.

Con más tiempo de implementación, hubiera agregado el *fuzzy search* como fallback.

## Decisiones clave de diseño 🚧

SEO
- Implementé un sitemap dinámico en tiempo de build para mejorar el SEO y facilitar el rastreo de páginas por buscadores.
- Cada página de FAQ (`/faq/[id]`) usa Server-Side Rendering (SSR), generando dinámicamente metadata personalizada para cada pregunta, mejorando así el posicionamiento en buscadores y la experiencia del usuario.

Búsqueda
- Una decisión importante de diseño fue incluir tanto la pregunta como la respuesta en el algoritmo de similitud coseno (`combined_text = f"{faq.question} {faq.answer}"`). Esto mejora significativamente la experiencia de usuario al hacer más precisas las coincidencias en búsquedas.
- Originalmente se solicitaba crear un endpoint POST para búsquedas, pero decidí implementar un GET (`/api/search`) porque la búsqueda es esencialmente una operación de consulta sin efectos secundarios. Esto facilita integraciones directas desde frontend y mejora la semántica del API.

Endpoints adicionales
- Crear endpoints como `/api/faqs/{id}` y `/api/faqs` no estaba inicialmente especificado, pero los consideré importantes para completar la experiencia del sistema. Estos endpoints permiten obtener fácilmente FAQs individuales o listados, haciendo el sistema más completo y amigable para el usuario. También ayudan un montón con el sitemap dinamico

UI
- Se empleó un diseño simple para maximizar la usabilidad y la rapidez de carga, basado en Tailwind, Radix UI y componentes de Shadcn.
- Se agregaron feedback visual (loaders) en todos los componentes para mejorar la experiencia del usuario durante las búsquedas.

## Cómo probar el proyecto localmente

**Requisitos:** Docker y Docker Compose instalados.

Clona y ejecuta así:

```bash
git clone https://github.com/emilianosca/q-finder.git
cd q-finder
docker compose up --build
```

Al correr esto, automáticamente se ejecutarán un archivo de testing y otro de seed que llenarán la base de datos.

Ingresa a la URL:
- Frontend en [http://localhost:3000](http://localhost:3000)
- API FastAPI (documentación interactiva) en [http://localhost:8000/docs](http://localhost:8000/docs)

## Tests 🧪

Incluí una suite completa de pruebas automatizadas en `tests/test_search.py`. Esto garantiza consistencia y calidad al realizar cambios, probando casos esenciales como límites de búsqueda, ordenamiento por similitud, manejo de errores en parámetros, y comportamientos esperados cuando no existen FAQs o resultados relevantes.

### Cómo ejecutar los tests:

Ejecuta los tests fácilmente con este comando desde la carpeta raíz del proyecto:

```bash
docker compose run backend pytest tests/
```

## Errores que cometí en mi implementación y cómo los resolví

1. Inicialmente dedique mucho tiempo en separar ambientes (dev y prod) en Docker. Termine no utilizando el ambiente de producción en Nextjs por falta de tiempo. Fue un *feature* innecesario que pude haber ahorrado, dedicando tiempo a la implementación de agentes. 

## Aciertos realizados durante la prueba

1. Comenzar desde una solución simple y escalar gradualmente usando scikit-learn y tests, facilitó mantener consistencia mientras migraba al código propio.
2. Creé endpoints adicionales que mejoraron significativamente la experiencia general del sistema.

## Oportunidades para futuras mejoras

1. Implementar un agente inteligente con fuzzy search y sinónimos como fallback para búsquedas más efectivas.
2. Añadir clasificación automática para agrupar FAQs similares y mejorar la organización del contenido.




