document.addEventListener('DOMContentLoaded', function () {

    /* ---------- 1. Menú móvil ---------- */
    var botonMenu = document.getElementById('menu');
    var nav = document.getElementById('navegacion');

    function cerrarMenu() {
        nav.classList.remove('abierto');
        botonMenu.setAttribute('aria-expanded', 'false');
        botonMenu.setAttribute('aria-label', 'Abrir menú');
        botonMenu.innerHTML = '&#9776;';
    }

    botonMenu.addEventListener('click', function () {
        var abierto = nav.classList.toggle('abierto');
        botonMenu.setAttribute('aria-expanded', String(abierto));
        botonMenu.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
        botonMenu.innerHTML = abierto ? '&#10005;' : '&#9776;';
    });

    nav.querySelectorAll('a').forEach(function (enlace) {
        enlace.addEventListener('click', cerrarMenu);
    });

    window.addEventListener('resize', function () {
        if (window.innerWidth > 980) cerrarMenu();
    });

    /* ---------- 2. Enlace activo según la sección visible ---------- */
    var enlaces = nav.querySelectorAll('a');
    var secciones = document.querySelectorAll('section[id]');

    function marcarActivo() {
        var posicion = window.scrollY + 120;
        var actual = '';
        secciones.forEach(function (s) {
            if (posicion >= s.offsetTop) actual = s.id;
        });
        enlaces.forEach(function (a) {
            a.classList.toggle('activo', a.getAttribute('href') === '#' + actual);
        });
    }
    window.addEventListener('scroll', marcarActivo, { passive: true });
    marcarActivo();

    /* ---------- 3. Lightbox de la galería ---------- */
    var lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.innerHTML = '<button type="button" class="lightbox-cerrar" aria-label="Cerrar">&times;</button><img alt="">';
    document.body.appendChild(lightbox);
    var lightboxImg = lightbox.querySelector('img');

    function cerrarLightbox() {
        lightbox.classList.remove('abierto');
        lightboxImg.removeAttribute('src');
    }

    document.querySelectorAll('.zoom').forEach(function (boton) {
        boton.addEventListener('click', function () {
            lightboxImg.src = boton.dataset.src;
            lightboxImg.alt = boton.dataset.alt || '';
            lightbox.classList.add('abierto');
        });
    });
    lightbox.addEventListener('click', cerrarLightbox);
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            cerrarLightbox();
            cerrarMenu();
        }
    });

    /* ---------- 4. Formulario de contacto ---------- */
    var form = document.getElementById('formContacto');
    var estado = document.getElementById('estado-form');

    var reglas = {
        nombre: function (v) {
            if (v.length < 3) return 'Ingrese su nombre completo (mínimo 3 letras).';
            if (!/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' .-]+$/.test(v)) return 'El nombre solo puede contener letras.';
            return '';
        },
        correo: function (v) {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return 'Ingrese un correo válido (ej. nombre@correo.com).';
            return '';
        },
        telefono: function (v) {
            var digitos = v.replace(/\D/g, '');
            if (!/^[0-9+()\s-]+$/.test(v) || digitos.length < 7 || digitos.length > 15) {
                return 'Ingrese un teléfono válido (7 a 15 dígitos).';
            }
            return '';
        }
    };

    function validarCampo(nombre) {
        var campo = form.elements[nombre];
        var mensaje = reglas[nombre](campo.value.trim());
        document.getElementById('error-' + nombre).textContent = mensaje;
        campo.classList.toggle('invalido', mensaje !== '');
        return mensaje === '';
    }

    Object.keys(reglas).forEach(function (nombre) {
        form.elements[nombre].addEventListener('blur', function () { validarCampo(nombre); });
        form.elements[nombre].addEventListener('input', function () {
            if (form.elements[nombre].classList.contains('invalido')) validarCampo(nombre);
        });
    });

    form.addEventListener('submit', function (e) {
        estado.textContent = '';
        estado.style.color = '';

        var todoValido = true;
        Object.keys(reglas).forEach(function (nombre) {
            if (!validarCampo(nombre)) todoValido = false;
        });
        if (!todoValido) {
            e.preventDefault(); // solo se bloquea el envío si hay errores
            estado.style.color = '#c0392b';
            estado.textContent = 'Revise los campos marcados.';
            return;
        }

        // Todo válido: el formulario se envía normalmente por POST a envio.php,
        // que guarda los datos en MySQL y muestra el alert de confirmación.
        estado.textContent = 'Enviando...';
    });

    /* ---------- 5. Año del pie de página ---------- */
    document.getElementById('anio').textContent = new Date().getFullYear();
});