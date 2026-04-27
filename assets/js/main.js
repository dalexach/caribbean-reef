
/*
|--------------------------------------------------------------------------
| main.js
|--------------------------------------------------------------------------
| Este archivo contiene la lógica principal de la aplicación.
|
| Responsabilidades principales:
| 1. Cargar los servicios desde un archivo JSON.
| 2. Gestionar favoritos usando localStorage.
| 3. Renderizar dinámicamente las tarjetas de servicios.
| 4. Mostrar el detalle del servicio dentro de la misma página.
| 5. Renderizar los servicios destacados en el Home.
|--------------------------------------------------------------------------
*/


/* ==========================================================================
   1. CONSTANTES GLOBALES
   ========================================================================== */

/*
| Clave que se utilizará para guardar los favoritos en localStorage.
| Esto permite que el navegador recuerde los servicios favoritos
| incluso si el usuario recarga la página.
*/
const STORAGE_KEY = "caribbean_favorites";

/*
| Claves compartidas con admin-services.js.
| Permiten que la página de Servicios lea los cambios hechos en Gestión.
*/
const CUSTOM_SERVICES_KEY = "custom_services";
const DELETED_SERVICES_KEY = "deleted_service_ids";

const CRUD_VERSION_KEY = "caribbean_crud_version";
const CURRENT_CRUD_VERSION = "crud-restaurar-catalogo-v2";


/* ==========================================================================
   2. CARGA DE DATOS
   ========================================================================== */

/*
| Función asíncrona para obtener los servicios.
|
| Primero intenta leer el archivo JSON externo:
|   assets/data/services.json
|
| Si ocurre un error (por ejemplo, al abrir el archivo localmente
| sin servidor), usa como respaldo la variable global:
|   window.SERVICES_DATA
|
| Si tampoco existe ese respaldo, retorna un arreglo vacío.
*/
function resetOldCrudStateOnce() {
    const savedVersion = localStorage.getItem(CRUD_VERSION_KEY);

    if (savedVersion === CURRENT_CRUD_VERSION) return;

    localStorage.removeItem(CUSTOM_SERVICES_KEY);
    localStorage.removeItem(DELETED_SERVICES_KEY);
    localStorage.setItem(CRUD_VERSION_KEY, CURRENT_CRUD_VERSION);
}

async function getServices() {
    resetOldCrudStateOnce();
    let baseServices = [];

    try {
        // Solicita el archivo JSON que contiene los servicios base.
        const response = await fetch("assets/data/services.json");

        // Si la respuesta no es correcta, lanza un error.
        if (!response.ok) {
            throw new Error("No fue posible cargar services.json");
        }

        // Convierte la respuesta en JSON.
        baseServices = await response.json();
    } catch (error) {
        /*
        | Si el proyecto se abre con doble clic, algunos navegadores bloquean
        | fetch(). En ese caso usamos el respaldo local de services-data.js.
        */
        if (window.SERVICES_DATA) {
            baseServices = window.SERVICES_DATA;
        } else {
            console.error(error);
            baseServices = [];
        }
    }

    /*
    | Lee los servicios creados en Gestión y los ids eliminados.
    | Esta es la conexión directa entre admin-services.html y services.html.
    */
    const customServices = JSON.parse(
        localStorage.getItem(CUSTOM_SERVICES_KEY) || "[]"
    );

    const deletedIds = JSON.parse(
        localStorage.getItem(DELETED_SERVICES_KEY) || "[]"
    );

    /*
    | Retorna el catálogo final:
    | 1. Servicios base del JSON o respaldo local.
    | 2. Servicios nuevos creados desde Gestión.
    | 3. Sin los servicios eliminados desde Gestión.
    */
    const deletedIdStrings = deletedIds.map(String);

    return [...baseServices, ...customServices].filter(
        (service) => !deletedIdStrings.includes(String(service.id))
    );
}


/* ==========================================================================
   3. GESTIÓN DE FAVORITOS
   ========================================================================== */

/*
| Obtiene la lista de favoritos guardada en localStorage.
|
| Si no existe nada guardado, retorna un arreglo vacío.
| JSON.parse convierte el texto guardado en un arreglo real.
*/
function getFavorites() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

/*
| Guarda el arreglo de favoritos en localStorage.
|
| JSON.stringify convierte el arreglo en texto para poder almacenarlo.
*/
function saveFavorites(favorites) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}

/*
| Verifica si un servicio específico está marcado como favorito.
|
| Parámetro:
| - id: identificador del servicio
|
| Retorna:
| - true si existe en favoritos
| - false si no existe
*/
function isFavorite(id) {
    return getFavorites().includes(id);
}

/*
| Agrega o elimina un servicio de favoritos.
|
| Lógica:
| - Si el servicio ya está en favoritos, lo elimina.
| - Si no está, lo agrega.
|
| Parámetro:
| - id: identificador del servicio
|
| Retorna:
| - true si quedó como favorito
| - false si quedó eliminado
*/
function toggleFavorite(id) {
    // Obtiene el arreglo actual de favoritos.
    const favorites = getFavorites();

    // Busca la posición del servicio dentro del arreglo.
    const index = favorites.indexOf(id);

    // Si existe, lo elimina.
    if (index >= 0) {
        favorites.splice(index, 1);
    } else {
        // Si no existe, lo agrega.
        favorites.push(id);
    }

    // Guarda los cambios actualizados.
    saveFavorites(favorites);

    // Retorna si finalmente quedó como favorito o no.
    return favorites.includes(id);
}


/* ==========================================================================
   4. UTILIDADES GENERALES
   ========================================================================== */

/*
| Construye el enlace de WhatsApp con un mensaje automático.
|
| Parámetro:
| - serviceName: nombre del servicio
|
| encodeURIComponent sirve para convertir el mensaje a un formato
| seguro dentro de una URL.
*/
function whatsappLink(serviceName) {
    const message = encodeURIComponent(
        `Hola, quiero más información sobre el servicio: ${serviceName}.`
    );

    return `https://wa.me/573001234567?text=${message}`;
}


/* ==========================================================================
   5. RENDERIZADO DE TARJETAS
   ========================================================================== */

/*
| Construye el HTML de una tarjeta de servicio.
|
| Parámetros:
| - service: objeto con la información del servicio
| - includeFavorite: define si se debe mostrar el botón de favorito
|
| Retorna:
| - un string HTML que luego será insertado en el DOM
*/
function buildServiceCard(service, includeFavorite = true) {
    // Determina qué clase CSS debe tener el botón de favorito.
    const favoriteClass = isFavorite(service.id)
        ? "favorite-btn is-favorite"
        : "favorite-btn";

    // Define el texto del botón según si ya está en favoritos o no.
    const favoriteLabel = isFavorite(service.id)
        ? "★ Favorito"
        : "☆ Favorito";

    /*
    | Si el servicio tiene imagen, se usa como fondo de la card.
    | Si no, se mantiene el gradiente original como respaldo visual.
    */
    const imageStyle = service.image
        ? `style="background-image:url('${service.image}'); background-size:cover; background-position:center;"`
        : ``;

    const imageClass = service.image ? "card-image" : "card-image gradient-card";

    // Retorna la estructura HTML de la card.
    return `
    <article class="service-card">
      <div class="${imageClass}" ${imageStyle}>
        <span class="card-tag">${service.tag}</span>
      </div>

      <div class="card-body">
        <h3>${service.name}</h3>
        <p>${service.shortDescription}</p>
        <div class="price">${service.priceLabel}</div>

        <div class="actions">
          ${includeFavorite
            ? `<button class="${favoriteClass}" data-favorite-id="${service.id}">
                  ${favoriteLabel}
                </button>`
            : ``
        }

          <button class="btn btn-dark btn-small" data-detail-id="${service.id}">
            Ver más
          </button>
        </div>
      </div>
    </article>
  `;
}


/* ==========================================================================
   6. EVENTOS DE FAVORITOS
   ========================================================================== */

/*
| Asocia eventos click a todos los botones de favoritos que existan
| dentro de un contenedor.
|
| Parámetro:
| - container: elemento HTML que contiene las tarjetas
*/
function bindFavoriteButtons(container) {
    // Selecciona todos los botones que tengan data-favorite-id.
    container.querySelectorAll("[data-favorite-id]").forEach((button) => {
        button.addEventListener("click", () => {
            // Obtiene el id del servicio desde el atributo data.
            const id = Number(button.dataset.favoriteId);

            // Cambia el estado del favorito.
            const active = toggleFavorite(id);

            // Actualiza la clase visual del botón.
            button.className = active
                ? "favorite-btn is-favorite"
                : "favorite-btn";

            // Actualiza el texto visual del botón.
            button.textContent = active
                ? "★ Favorito"
                : "☆ Favorito";

            /*
            | Después de actualizar un favorito, volvemos a pintar
            | la lista personalizada para que el usuario vea el cambio
            | inmediatamente sin recargar la página.
            */
            getServices().then((services) => renderFavorites(services));
        });
    });
}



/* ==========================================================================
   7. RENDERIZADO DE LA LISTA PERSONALIZADA DE FAVORITOS
   ========================================================================== */

/*
| Muestra en pantalla los servicios que el usuario guardó como favoritos.
|
| Parámetro:
| - services: arreglo completo de servicios disponibles
|
| Flujo:
| 1. Busca el contenedor de favoritos en services.html
| 2. Obtiene los IDs guardados en localStorage
| 3. Filtra solo los servicios favoritos
| 4. Los renderiza reutilizando las mismas cards del catálogo
*/
function renderFavorites(services) {
    // Contenedor donde se mostrarán los favoritos guardados.
    const container = document.getElementById("favorites-list");

    // Si el contenedor no existe, significa que no estamos en services.html.
    if (!container) return;

    // Obtiene los IDs de los servicios guardados como favoritos.
    const favoriteIds = getFavorites();

    // Filtra el catálogo completo para dejar solo los servicios favoritos.
    const favoriteServices = services.filter((service) =>
        favoriteIds.includes(service.id)
    );

    // Si no hay favoritos, muestra un mensaje amigable al usuario.
    if (favoriteServices.length === 0) {
        container.innerHTML = `
            <div class="favorites-empty">
                Todavía no has agregado servicios a tu lista de favoritos.
            </div>
        `;
        return;
    }

    // Si sí hay favoritos, se renderizan con la misma función de cards.
    container.innerHTML = favoriteServices
        .map((service) => buildServiceCard(service, true))
        .join("");

    // Activa nuevamente la interacción de botones dentro de la lista.
    bindFavoriteButtons(container);
}

/* ==========================================================================
   7. RENDERIZADO DE DETALLE DEL SERVICIO
   ========================================================================== */

/*
| Divide la lista de inclusiones en dos columnas.
|
| Parámetro:
| - items: arreglo con los elementos incluidos del servicio
|
| Retorna:
| - HTML con dos listas distribuidas de forma equilibrada
*/
function buildIncludesColumns(items = []) {
    // Calcula el punto medio del arreglo.
    const middle = Math.ceil(items.length / 2);

    // Primera mitad.
    const left = items.slice(0, middle);

    // Segunda mitad.
    const right = items.slice(middle);

    /*
    | Función interna que convierte un arreglo en una lista HTML.
    */
    const column = (values) => `
    <ul>
      ${values.map((item) => `<li>${item}</li>`).join("")}
    </ul>
  `;

    // Retorna ambas columnas dentro de un contenedor.
    return `
    <div class="includes">
      <h3>¿Qué incluye?</h3>
      ${column(left)}
      ${column(right)}
    </div>
  `;
}

/*
| Construye el HTML completo del detalle expandido de un servicio.
|
| Parámetro:
| - service: objeto con la información del servicio seleccionado
|
| Retorna:
| - HTML de la vista detalle
*/
function buildInlineDetail(service) {
    /*
    | Si el servicio tiene imagen, se usa como fondo del banner del detalle.
    | Si no, queda con el degradado original definido en CSS.
    */
    const heroStyle = service.image
        ? `style="background-image:url('${service.image}'); background-size:cover; background-position:center;"`
        : ``;

    return `
    <div class="detail-panel">
      <div class="detail-topbar"></div>

      <div class="detail-hero" ${heroStyle}>
        <div class="detail-overlay">
          <span class="detail-tag">${service.tag}</span>
          <h2 class="detail-title">${service.name}</h2>
          <div class="detail-subtitle">${service.subtitle}</div>
        </div>
      </div>

      <div class="detail-content">
        <a href="#services-top" class="back-link" id="inline-back-link">
          ← Volver a servicios
        </a>

        <p class="detail-description">${service.description}</p>

        <div class="detail-stats">
          <article class="detail-stat">
            <div class="icon">⏱️</div>
            <div class="label">Duración</div>
            <div class="value">${service.duration}</div>
          </article>

          <article class="detail-stat">
            <div class="icon">💰</div>
            <div class="label">Precio</div>
            <div class="value">${service.priceDetail}</div>
          </article>

          <article class="detail-stat">
            <div class="icon">🌅</div>
            <div class="label">Hora de salida</div>
            <div class="value">${service.schedule}</div>
          </article>
        </div>

        ${buildIncludesColumns(service.includes)}

        <div class="detail-cta">
          <h3>¿Listo para vivir esta experiencia?</h3>
          <p>Reserva ahora por WhatsApp. Te respondemos en menos de 2 horas.</p>

          <a
            class="btn btn-primary"
            target="_blank"
            href="${whatsappLink(service.name)}"
          >
            Reservar por WhatsApp
          </a>
        </div>
      </div>
    </div>
  `;
}


/* ==========================================================================
   8. INICIALIZACIÓN DE LA PÁGINA DE SERVICIOS
   ========================================================================== */

/*
| Inicializa la lógica de services.html
|
| Tareas:
| - buscar los contenedores del listado y del detalle
| - cargar los servicios
| - renderizar las cards
| - activar favoritos
| - activar el botón "Ver más"
*/
async function initServicesPage() {
    // Obtiene el contenedor del listado.
    const list = document.getElementById("services-list");

    // Obtiene el contenedor donde aparecerá el detalle expandido.
    const detail = document.getElementById("inline-detail");

    // Si esta página no tiene esos elementos, termina la función.
    if (!list || !detail) return;

    // Carga los servicios.
    const services = await getServices();

    // Renderiza todas las tarjetas.
    list.innerHTML = services
        .map((service) => buildServiceCard(service, true))
        .join("");

    // Activa la funcionalidad de favoritos.
    bindFavoriteButtons(list);

    /*
    | Renderiza la lista personalizada de favoritos debajo del catálogo.
    | Así el usuario puede ver en tiempo real qué servicios ha guardado.
    */
    renderFavorites(services);

    // Activa el evento del botón "Ver más".
    list.querySelectorAll("[data-detail-id]").forEach((button) => {
        button.addEventListener("click", () => {
            // Obtiene el id del servicio seleccionado.
            const id = Number(button.dataset.detailId);

            // Busca el objeto completo del servicio.
            const service = services.find((item) => item.id === id);

            // Si no lo encuentra, no hace nada.
            if (!service) return;

            // Inserta el detalle en el contenedor.
            detail.innerHTML = buildInlineDetail(service);

            // Hace visible el contenedor del detalle.
            detail.classList.add("show");

            // Desplaza suavemente la página hasta el detalle.
            detail.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

            // Selecciona el botón para volver al listado.
            const backLink = document.getElementById("inline-back-link");

            // Si existe, le asigna comportamiento.
            if (backLink) {
                backLink.addEventListener("click", (event) => {
                    // Evita el comportamiento normal del enlace.
                    event.preventDefault();

                    // Oculta nuevamente el detalle.
                    detail.classList.remove("show");

                    // Limpia el contenido del detalle.
                    detail.innerHTML = "";

                    // Hace scroll al inicio del listado.
                    document.getElementById("services-top").scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                });
            }
        });
    });
}


/* ==========================================================================
   9. INICIALIZACIÓN DEL HOME
   ========================================================================== */

/*
| Inicializa la sección de servicios destacados en index.html
|
| Tareas:
| - cargar servicios
| - mostrar solo los primeros 4
| - renderizarlos en el Home
| - hacer que el botón "Ver más" redirija a services.html
*/
async function initHomeFeatured() {
    // Obtiene el contenedor del Home.
    const container = document.getElementById("featured-services");

    // Si no existe, significa que no estamos en Home.
    if (!container) return;

    // Carga los servicios.
    const services = await getServices();

    // Renderiza solo los primeros 4 servicios.
    container.innerHTML = services
        .slice(0, 4)
        .map((service) => buildServiceCard(service, false))
        .join("");

    // Asocia el evento al botón "Ver más".
    container.querySelectorAll("[data-detail-id]").forEach((button) => {
        button.addEventListener("click", () => {
            // Redirige a la página de servicios.
            window.location.href = "services.html#services-top";
        });
    });
}


/* ==========================================================================
   10. PUNTO DE ENTRADA DE LA APLICACIÓN
   ========================================================================== */

/*
| Cuando el DOM termina de cargar:
| - se inicializa la página de servicios
| - se inicializa la sección destacada del Home
|
| Cada función internamente detecta si está en su página correspondiente.
*/
document.addEventListener("DOMContentLoaded", () => {
    initServicesPage();
    initHomeFeatured();
});