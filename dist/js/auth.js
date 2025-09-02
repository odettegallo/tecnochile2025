// ===== SISTEMA DE AUTENTICACIÓN =====

// Función para mostrar alertas
function mostrarAlerta(mensaje, tipo = 'danger') {
  const alertaLogin = document.getElementById('loginAlert');
  const alertaRegister = document.getElementById('registerAlert');
  
  const alerta = alertaLogin || alertaRegister;
  if (alerta) {
    alerta.className = `alert alert-${tipo}`;
    alerta.textContent = mensaje;
    alerta.style.display = 'block';
    
    // Ocultar alerta después de 5 segundos
    setTimeout(() => {
      alerta.style.display = 'none';
    }, 5000);
  }
}

// Función para validar email
function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Función para validar contraseña
function validarPassword(password) {
  return password.length >= 6;
}

// Inicializar usuarios de prueba
function inicializarUsuariosPrueba() {
  const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
  
  if (usuarios.length === 0) {
    const usuariosPrueba = [
      {
        id: 1,
        nombre: 'José',
        apellido: 'González',
        email: 'jose@ejemplo.com',
        password: '123456'
      },
      {
        id: 2,
        nombre: 'María',
        apellido: 'López',
        email: 'maria@ejemplo.com',
        password: 'password'
      },
      {
        id: 3,
        nombre: 'Test',
        apellido: 'User',
        email: 'test@ejemplo.com',
        password: '1234567'
      }
    ];
    
    localStorage.setItem('usuarios', JSON.stringify(usuariosPrueba));
  }
}

// Función para verificar sesión existente
function verificarSesion() {
  const sesion = localStorage.getItem('sesionActiva') || sessionStorage.getItem('sesionActiva');
  if (sesion) {
    const usuario = JSON.parse(sesion);
    window.location.href = 'pages/home.html';
  }
}

// Función para manejar el modo oscuro
function manejarModoOscuro() {
  const darkModeToggle = document.getElementById('darkModeToggle');
  const body = document.body;
  
  // Verificar preferencia guardada
  const darkMode = localStorage.getItem('darkMode') === 'true';
  if (darkMode) {
    body.classList.add('dark-mode');
    darkModeToggle.textContent = '☀️';
  }
  
  darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
    darkModeToggle.textContent = isDark ? '☀️' : '🌙';
  });
}

// Event listener principal
document.addEventListener('DOMContentLoaded', function() {
  // Inicializar usuarios de prueba
  inicializarUsuariosPrueba();
  
  // Verificar si ya hay una sesión activa
  verificarSesion();
  
  // Configurar modo oscuro
  manejarModoOscuro();
  
  // ===== MANEJO DEL FORMULARIO DE LOGIN =====
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value;
      const recordar = document.getElementById('rememberMe').checked;
      
      // Validaciones básicas
      if (!email || !password) {
        mostrarAlerta('Por favor, completa todos los campos.');
        return;
      }
      
      if (!validarEmail(email)) {
        mostrarAlerta('Por favor, ingresa un email válido.');
        return;
      }
      
      if (!validarPassword(password)) {
        mostrarAlerta('La contraseña debe tener al menos 6 caracteres.');
        return;
      }
      
      // Verificar credenciales
      const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
      const usuario = usuarios.find(u => u.email === email && u.password === password);
      
      if (usuario) {
        // Login exitoso
        const sesionData = {
          id: usuario.id,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          email: usuario.email,
          fechaLogin: new Date().toISOString()
        };
        
        // Guardar sesión
        if (recordar) {
          localStorage.setItem('sesionActiva', JSON.stringify(sesionData));
        } else {
          sessionStorage.setItem('sesionActiva', JSON.stringify(sesionData));
        }
        
        // Mostrar mensaje de éxito
        mostrarAlerta(`¡Bienvenido, ${usuario.nombre}!`, 'success');
        
        // Redirigir después de un breve delay
        setTimeout(() => {
          window.location.href = 'pages/home.html';
        }, 1500);
        
      } else {
        mostrarAlerta('Email o contraseña incorrectos.');
      }
    });
  }
  
  // ===== MANEJO DEL FORMULARIO DE REGISTRO =====
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const nombre = document.getElementById('registerName').value.trim();
      const apellido = document.getElementById('registerLastName').value.trim();
      const email = document.getElementById('registerEmail').value.trim();
      const password = document.getElementById('registerPassword').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      const aceptaTerminos = document.getElementById('acceptTerms').checked;
      
      // Validaciones
      if (!nombre || !apellido || !email || !password || !confirmPassword) {
        mostrarAlerta('Por favor, completa todos los campos.');
        return;
      }
      
      if (!validarEmail(email)) {
        mostrarAlerta('Por favor, ingresa un email válido.');
        return;
      }
      
      if (!validarPassword(password)) {
        mostrarAlerta('La contraseña debe tener al menos 6 caracteres.');
        return;
      }
      
      if (password !== confirmPassword) {
        mostrarAlerta('Las contraseñas no coinciden.');
        return;
      }
      
      if (!aceptaTerminos) {
        mostrarAlerta('Debes aceptar los términos y condiciones.');
        return;
      }
      
      // Verificar si el usuario ya existe
      const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
      const usuarioExistente = usuarios.find(u => u.email === email);
      
      if (usuarioExistente) {
        mostrarAlerta('Ya existe una cuenta con este email.');
        return;
      }
      
      // Crear nuevo usuario
      const nuevoUsuario = {
        id: Date.now(),
        nombre: nombre,
        apellido: apellido,
        email: email,
        password: password
      };
      
      usuarios.push(nuevoUsuario);
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
      
      // Mostrar mensaje de éxito
      mostrarAlerta('¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.', 'success');
      
      // Limpiar formulario
      registerForm.reset();
      
      // Cambiar a la pestaña de login después de un delay
      setTimeout(() => {
        const loginTab = document.querySelector('[data-bs-target="#login"]');
        if (loginTab) {
          const tab = new bootstrap.Tab(loginTab);
          tab.show();
        }
      }, 2000);
    });
  }
});