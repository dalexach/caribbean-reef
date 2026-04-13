/*
|--------------------------------------------------------------------------
| admin-services.js
|--------------------------------------------------------------------------
| Implementa un Mini CRUD básico para servicios turísticos.
|
| Permite:
| - Crear nuevos servicios
| - Guardarlos en localStorage
| - Renderizarlos en pantalla
| - Eliminarlos individualmente
|--------------------------------------------------------------------------
*/

const CUSTOM_SERVICES_KEY = "custom_services";

/* Obtiene los servicios creados manualmente desde localStorage. */
function getCustomServices() {
  return JSON.parse(localStorage.getItem(CUSTOM_SERVICES_KEY) || "[]");
}

/* Guarda el arreglo actualizado de servicios personalizados. */
function saveCustomServices(services) {
  localStorage.setItem(CUSTOM_SERVICES_KEY, JSON.stringify(services));
}

/* Construye una tarjeta visual para el panel de gestión. */
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

/* Renderiza la lista de servicios creados manualmente. */
function renderAdminServices() {
  const container = document.getElementById("admin-services-list");
  if (!container) return;

  const customServices = getCustomServices();

  if (customServices.length === 0) {
    container.innerHTML = `
      <div class="favorites-empty">
        No hay servicios creados manualmente todavía.
      </div>
    `;
    return;
  }

  container.innerHTML = customServices
    .map(service => buildAdminCard(service))
    .join("");

  bindDeleteButtons(container);
}

/* Elimina un servicio personalizado por id. */
function deleteCustomService(id) {
  const services = getCustomServices();
  const updatedServices = services.filter(service => service.id !== id);
  saveCustomServices(updatedServices);
}

/* Asigna eventos de eliminación a cada botón correspondiente. */
function bindDeleteButtons(container) {
  container.querySelectorAll("[data-delete-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = Number(button.dataset.deleteId);
      deleteCustomService(id);
      renderAdminServices();
    });
  });
}

/*
| Inicializa el formulario:
| - lee datos de entrada
| - crea un nuevo objeto servicio
| - lo almacena en localStorage
| - vuelve a renderizar la lista
*/
function initServiceForm() {
  const form = document.getElementById("service-form");
  const message = document.getElementById("crud-message");

  if (!form || !message) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const newService = {
      id: Date.now(),
      slug: document.getElementById("name").value.trim().toLowerCase().replaceAll(" ", "-"),
      name: document.getElementById("name").value.trim(),
      tag: document.getElementById("tag").value.trim(),
      shortDescription: document.getElementById("shortDescription").value.trim(),
      description: document.getElementById("description").value.trim(),
      priceLabel: document.getElementById("priceLabel").value.trim(),
      priceDetail: document.getElementById("priceDetail").value.trim(),
      duration: document.getElementById("duration").value.trim(),
      schedule: document.getElementById("schedule").value.trim(),
      subtitle: document.getElementById("subtitle").value.trim(),
      image: document.getElementById("image").value.trim(),
      includes: document.getElementById("includes").value
        .split(",")
        .map(item => item.trim())
        .filter(item => item !== "")
    };

    const services = getCustomServices();
    services.push(newService);
    saveCustomServices(services);

    message.className = "form-message success";
    message.textContent = "Servicio creado correctamente.";

    form.reset();
    renderAdminServices();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initServiceForm();
  renderAdminServices();
});
