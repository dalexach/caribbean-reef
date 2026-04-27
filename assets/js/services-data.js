/*
|--------------------------------------------------------------------------
| services-data.js
|--------------------------------------------------------------------------
| Este archivo define un arreglo global con la información de los servicios
| turísticos que usa la aplicación "Caribbean Reef Adventures".
|
| Se asigna el arreglo a la propiedad window.SERVICES_DATA para que pueda
| ser accedido desde otros archivos JavaScript del proyecto.
|--------------------------------------------------------------------------
*/

window.SERVICES_DATA = [
    /*
    |--------------------------------------------------------------------------
    | Servicio 1: Wakeboard
    |--------------------------------------------------------------------------
    | Cada objeto representa un servicio turístico.
    | Aquí se almacenan todos los datos necesarios para mostrar:
    | - la tarjeta del servicio
    | - la vista detallada
    | - información adicional como duración e inclusiones
    |--------------------------------------------------------------------------
    */
    {
        // Identificador único del servicio.
        // Sirve para buscarlo, renderizarlo o manejar favoritos.
        id: 1,

        // Nombre corto interno del servicio.
        // Se usa normalmente en URLs, filtros o identificaciones limpias.
        slug: "wakeboard",

        // Nombre visible del servicio.
        // Este texto es el que verá el usuario en pantalla.
        name: "Wakeboard",

        // Etiqueta visual o categoría del servicio.
        // En el diseño se muestra como badge sobre la tarjeta.
        tag: "Adrenalina",

        // Ruta de la imagen representativa del servicio.
        image: "assets/img/services/Wakeboard.png",

        // Descripción breve.
        // Se utiliza principalmente en la tarjeta del catálogo.
        shortDescription: "Deslízate sobre las aguas cristalinas del Caribe.",

        // Descripción completa del servicio.
        // Se muestra cuando el usuario da clic en “Ver más”.
        description:
            "Actividad acuática llena de adrenalina, ideal para quienes buscan diversión en el mar. Incluye acompañamiento guiado, inducción básica y una experiencia personalizada en San Andrés.",

        // Texto corto del precio para mostrar en la tarjeta.
        // Se usa con formato comercial y amigable.
        priceLabel: "Desde $120.000 COP",

        // Precio detallado del servicio.
        // Puede mostrarse en la sección expandida o vista detalle.
        priceDetail: "$120.000 COP",

        // Duración estimada de la actividad.
        duration: "45 - 60 min",

        // Horario o disponibilidad del servicio.
        schedule: "Horario flexible",

        // Frase destacada para reforzar el atractivo del servicio.
        // Se muestra como subtítulo en la vista detallada.
        subtitle: "Adrenalina y diversión sobre el Caribe",

        // Lista de elementos incluidos en el servicio.
        // Este arreglo se renderiza como lista de beneficios.
        includes: [
            "Instructor guía",
            "Inducción inicial",
            "Equipo básico",
            "Acompañamiento durante la actividad",
            "Experiencia personalizada"
        ]
    },

    /*
    |--------------------------------------------------------------------------
    | Servicio 2: Kitesurf
    |--------------------------------------------------------------------------
    */
    {
        // Identificador único del servicio.
        id: 2,

        // Nombre técnico o amigable para uso interno.
        slug: "kitesurf",

        // Nombre visible del servicio.
        name: "Kitesurf",

        // Categoría o tipo de experiencia.
        tag: "Adrenalina",

        // Ruta de la imagen representativa del servicio.
        image: "assets/img/services/Kitesurf.png",

        // Descripción breve para la card.
        shortDescription: "Deslízate sobre las aguas cristalinas del Caribe.",

        // Descripción detallada del servicio.
        description:
            "Deporte acuático que combina viento y mar, ofreciendo una experiencia única. Está pensado para quienes desean vivir una aventura técnica y emocionante con acompañamiento profesional.",

        // Precio corto visible en el catálogo.
        priceLabel: "Desde $128.000 COP",

        // Precio detallado.
        priceDetail: "$128.000 COP",

        // Tiempo estimado de duración.
        duration: "60 - 90 min",

        // Condición de horario.
        schedule: "Según clima",

        // Frase complementaria de marketing.
        subtitle: "Viento, técnica y mar en una sola experiencia",

        // Beneficios o componentes incluidos.
        includes: [
            "Acompañamiento profesional",
            "Orientación inicial",
            "Equipo de seguridad",
            "Sesión guiada",
            "Atención personalizada"
        ]
    },

    /*
    |--------------------------------------------------------------------------
    | Servicio 3: Tour en Lancha Privada
    |--------------------------------------------------------------------------
    */
    {
        // ID único del servicio.
        id: 3,

        // Nombre corto interno.
        slug: "tour-lancha-privada",

        // Nombre que se muestra al usuario.
        name: "Tour en Lancha Privada",

        // Categoría visual.
        tag: "Exclusivo",

        // Ruta de la imagen representativa del servicio.
        image: "assets/img/services/Lancha_Privada.png",

        // Texto breve para el listado.
        shortDescription: "Deslízate sobre las aguas cristalinas del Caribe.",

        // Descripción completa.
        description:
            "Recorrido personalizado por diferentes puntos turísticos de San Andrés. Ideal para quienes buscan privacidad, comodidad y una experiencia caribeña exclusiva.",

        // Precio resumido para catálogo.
        priceLabel: "Desde $350.000 COP",

        // Precio detallado.
        priceDetail: "$350.000 COP",

        // Tiempo estimado del recorrido.
        duration: "2 - 3 horas",

        // Disponibilidad o tipo de horario.
        schedule: "Horario flexible",

        // Frase destacada.
        subtitle: "Recorre la isla con comodidad y exclusividad",

        // Lista de elementos incluidos.
        includes: [
            "Lancha privada con capitán",
            "Recorrido personalizado",
            "Chalecos salvavidas",
            "Atención cercana",
            "Experiencia exclusiva"
        ]
    },

    /*
    |--------------------------------------------------------------------------
    | Servicio 4: Tour Amanecer
    |--------------------------------------------------------------------------
    */
    {
        // ID único.
        id: 4,

        // Nombre técnico corto.
        slug: "tour-amanecer",

        // Nombre visible.
        name: "Tour Amanecer",

        // Categoría o distintivo visual.
        tag: "Mágico",

        // Ruta de la imagen representativa del servicio.
        image: "assets/img/services/Tour_Amanecer.png",

        // Descripción breve del servicio.
        shortDescription: "Deslízate sobre las aguas cristalinas del Caribe.",

        // Descripción extendida.
        description:
            "Experiencia exclusiva para disfrutar el amanecer en el mar en un ambiente tranquilo. El cielo se pinta de naranja y dorado mientras la isla se observa desde una perspectiva completamente diferente.",

        // Precio de referencia para la tarjeta.
        priceLabel: "Desde $750.000 COP",

        // Precio más puntual para detalle.
        priceDetail: "$750.000 COP",

        // Duración aproximada.
        duration: "2 - 3 horas",

        // Hora recomendada o requerida de salida.
        schedule: "5:30 AM",

        // Frase emocional o promocional.
        subtitle: "El primer rayo de sol sobre el Caribe",

        // Lista de elementos incluidos en la experiencia.
        includes: [
            "Lancha privada con capitán",
            "Café y desayuno a bordo",
            "Manta y cojines",
            "Punto de observación selecto",
            "Guía local experto"
        ]
    }
];