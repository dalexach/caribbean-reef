/*
|--------------------------------------------------------------------------
| admin-services.js
|--------------------------------------------------------------------------
| Implementa un Mini CRUD básico para servicios turísticos.
|
| Objetivo principal:
| - Mostrar en la página de gestión los servicios existentes del catálogo.
| - Permitir crear nuevos servicios desde el formulario.
| - Permitir eliminar servicios existentes o creados manualmente.
| - Mantener sincronizada la página de Gestión con la página de Servicios.
|
| Nota importante:
| Como este prototipo no usa backend ni base de datos, la persistencia se hace
| con localStorage. Por eso, cuando se elimina un servicio base, no se borra
| del archivo JSON; se guarda su id en una lista de eliminados y luego se
| oculta tanto en Gestión como en Servicios.
|--------------------------------------------------------------------------
*/

/* ==========================================================================
   1. CLAVES DE LOCALSTORAGE
   ========================================================================== */

// Servicios creados manualmente desde la página de gestión.
const CUSTOM_SERVICES_KEY = "custom_services";

// IDs de servicios eliminados. Sirve para ocultar servicios base y personalizados.
const DELETED_SERVICES_KEY = "deleted_service_ids";

const CRUD_VERSION_KEY = "caribbean_crud_version";
const CURRENT_CRUD_VERSION = "crud-restaurar-catalogo-v2";


/* ==========================================================================
   2. FUNCIONES DE LECTURA Y ESCRITURA EN LOCALSTORAGE
   ========================================================================== */

function resetOldCrudStateOnce() {
  const savedVersion = localStorage.getItem(CRUD_VERSION_KEY);

  if (savedVersion === CURRENT_CRUD_VERSION) return;

  localStorage.removeItem(CUSTOM_SERVICES_KEY);
  localStorage.removeItem(DELETED_SERVICES_KEY);
  localStorage.setItem(CRUD_VERSION_KEY, CURRENT_CRUD_VERSION);
}

/* Obtiene los servicios creados manualmente desde localStorage. */
function getCustomServices() {
  return JSON.parse(localStorage.getItem(CUSTOM_SERVICES_KEY) || "[]");
}

/* Guarda el arreglo actualizado de servicios personalizados. */
function saveCustomServices(services) {
  localStorage.setItem(CUSTOM_SERVICES_KEY, JSON.stringify(services));
}

/* Obtiene los IDs de servicios eliminados desde localStorage. */
function getDeletedServiceIds() {
  return JSON.parse(localStorage.getItem(DELETED_SERVICES_KEY) || "[]");
}

/* Guarda los IDs de servicios eliminados. */
function saveDeletedServiceIds(ids) {
  localStorage.setItem(DELETED_SERVICES_KEY, JSON.stringify(ids));
}


/* ==========================================================================
   3. CARGA UNIFICADA DE SERVICIOS
   ========================================================================== */

/*
| Obtiene los servicios base del proyecto.
|
| Primero intenta cargar assets/data/services.json.
| Si el navegador bloquea fetch por abrir el HTML con doble clic, usa el
| respaldo window.SERVICES_DATA que viene desde services-data.js.
*/
async function getBaseServices() {
  try {
    const response = await fetch("assets/data/services.json");

    if (!response.ok) {
      throw new Error("No fue posible cargar services.json");
    }

    return await response.json();
  } catch (error) {
    if (window.SERVICES_DATA) {
      return window.SERVICES_DATA;
    }

    console.error(error);
    return [];
  }
}

/*
| Une los servicios base con los servicios creados manualmente.
| Luego filtra los servicios eliminados para que no aparezcan en Gestión.
*/
async function getVisibleServicesForAdmin() {
  const baseServices = await getBaseServices();
  const customServices = getCustomServices();
  const deletedIds = getDeletedServiceIds();

  return [...baseServices, ...customServices].filter(
    (service) => !deletedIds.map(String).includes(String(service.id))
  );
}


/* ==========================================================================
   4. RENDERIZADO DEL PANEL DE GESTIÓN
   ========================================================================== */

/* Construye una tarjeta visual para cada servicio del panel de gestión. */
function buildAdminCard(service) {
  return `
    <article class="service-card">
      <div class="card-image gradient-card">
        <span class="card-tag">${service.tag}</span>
      </div>

      <div class="card-body">
        <h3>${service.name}</h3>
        <p>${service.shortDescription}</p>
        <div class="price">${service.priceLabel}</div>

        <div class="actions">
          <button class="btn btn-dark btn-small" data-delete-id="${service.id}">
            Eliminar
          </button>
        </div>
      </div>
    </article>
  `;
}

/* Renderiza todos los servicios visibles: existentes + creados manualmente. */
async function renderAdminServices() {
  const container = document.getElementById("admin-services-list");
  if (!container) return;

  const services = await getVisibleServicesForAdmin();

  if (services.length === 0) {
    container.innerHTML = `
      <div class="favorites-empty">
        No hay servicios visibles en este momento.
      </div>
    `;
    return;
  }

  container.innerHTML = services.map((service) => buildAdminCard(service)).join("");
  bindDeleteButtons(container);
}


/* ==========================================================================
   5. ELIMINACIÓN DE SERVICIOS
   ========================================================================== */

/*
| Elimina un servicio del catálogo visible.
|
| Si el servicio fue creado manualmente, se elimina del arreglo custom_services.
| Si el servicio existe en el JSON base, se guarda su id en deleted_service_ids.
| Así queda oculto también en la página services.html.
*/
function deleteVisibleService(id) {
  const customServices = getCustomServices();
  const isCustomService = customServices.some(
    (service) => String(service.id) === String(id)
  );

  if (isCustomService) {
    const updatedCustomServices = customServices.filter(
      (service) => String(service.id) !== String(id)
    );

    saveCustomServices(updatedCustomServices);
    return;
  }

  const deletedIds = getDeletedServiceIds().map(String);

  if (!deletedIds.includes(String(id))) {
    deletedIds.push(String(id));
    saveDeletedServiceIds(deletedIds);
  }
}

/* Asigna eventos de eliminación a cada botón del panel. */
function bindDeleteButtons(container) {
  container.querySelectorAll("[data-delete-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = Number(button.dataset.deleteId);
      const confirmDelete = confirm(
        "¿Seguro que deseas eliminar este servicio del catálogo visible?"
      );

      if (!confirmDelete) return;

      deleteVisibleService(id);
      renderAdminServices();
    });
  });
}


/* ==========================================================================
   6. CREACIÓN DE SERVICIOS
   ========================================================================== */

/*
| Inicializa el formulario:
| - lee los datos ingresados
| - crea un nuevo objeto de servicio
| - lo guarda en localStorage
| - actualiza el panel de gestión
*/
function initServiceForm() {
  const form = document.getElementById("service-form");
  const message = document.getElementById("crud-message");

  if (!form || !message) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();

    const newService = {
      id: Date.now(),
      slug: name.toLowerCase().replaceAll(" ", "-"),
      name: name,
      tag: document.getElementById("tag").value.trim(),
      shortDescription: document.getElementById("shortDescription").value.trim(),
      description: document.getElementById("description").value.trim(),
      priceLabel: document.getElementById("priceLabel").value.trim(),
      priceDetail: document.getElementById("priceDetail").value.trim(),
      duration: document.getElementById("duration").value.trim(),
      schedule: document.getElementById("schedule").value.trim(),
      subtitle: document.getElementById("subtitle").value.trim(),
      image: document.getElementById("image").value.trim(),
      includes: document
        .getElementById("includes")
        .value.split(",")
        .map((item) => item.trim())
        .filter((item) => item !== "")
    };

    const services = getCustomServices();
    services.push(newService);
    saveCustomServices(services);

    message.className = "form-message success";
    message.textContent =
      "Servicio creado correctamente. Ya aparecerá en la página de Servicios.";

    form.reset();
    renderAdminServices();
  });
}


/* ==========================================================================
   7. RESTAURAR CATÁLOGO ORIGINAL
   ========================================================================== */

function restoreOriginalServices() {
  const confirmRestore = confirm(
    "¿Seguro que deseas restaurar todos los servicios originales?\nSe eliminarán los servicios creados manualmente y volverán a aparecer los servicios originales."
  );

  if (!confirmRestore) return;

  localStorage.removeItem(CUSTOM_SERVICES_KEY);
  localStorage.removeItem(DELETED_SERVICES_KEY);
  localStorage.setItem(CRUD_VERSION_KEY, CURRENT_CRUD_VERSION);

  const message = document.getElementById("crud-message");

  if (message) {
    message.className = "form-message success";
    message.textContent = "Catálogo restaurado correctamente. Ya aparecen todos los servicios originales.";
  }

  renderAdminServices();
}

function initRestoreButton() {
  const button = document.getElementById("restore-services-btn");
  if (!button) return;

  button.addEventListener("click", restoreOriginalServices);
}

/* ==========================================================================
   8. INICIALIZACIÓN
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  resetOldCrudStateOnce();
  initServiceForm();
  initRestoreButton();
  renderAdminServices();
});
