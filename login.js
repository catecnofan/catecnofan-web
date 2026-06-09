import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBSCwLvlIi75UodLbqtDK2HUiagmydoL8w",
    authDomain: "catecnofan-web.firebaseapp.com",
    projectId: "catecnofan-web",
    storageBucket: "catecnofan-web.appspot.com",
    messagingSenderId: "670781631971",
    appId: "1:670781631971:web:7fa547d5392149c05304d6"
};

const app = getApps().find(a => a.name === "login") || initializeApp(firebaseConfig, "login");
const auth = getAuth(app);

window.iniciarSesion = async () => {
    try {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        await signInWithEmailAndPassword(auth, email, password);
        location.reload();
    } catch (e) {
        alert("Error: " + e.message);
    }
};

window.cerrarSesion = () => {
    signOut(auth).then(() => location.reload());
};

// Cerrar dropdown al clickear afuera
document.addEventListener('click', (e) => {
    const panel = document.querySelector('.user-panel');
    if (panel && !panel.contains(e.target)) {
        panel.classList.remove('open');
    }
});

onAuthStateChanged(auth, (user) => {
    window.currentUser = user || null;
    const container = document.getElementById('login-container');

    if (user) {
        const nombre = user.displayName || user.email.split('@')[0];
        window.currentUserName = nombre
        const inicial = nombre.charAt(0).toUpperCase();
        const foto = user.photoURL;

        const avatarHTML = foto
            ? `<img src="${foto}" class="user-avatar-img">`
            : `<div class="user-avatar">${inicial}</div>`;

        container.innerHTML = `
            <div class="user-panel" onclick="this.classList.toggle('open')">
                ${avatarHTML}
                <div class="user-info">
                    <span class="user-label">Búnker</span>
                    <span class="user-name">${nombre}</span>
                </div>
                <i class="fas fa-chevron-down user-chevron"></i>
                <div class="user-dropdown">
                    <a href="perfil.html"><i class="fas fa-user"></i> Mi Perfil</a>
                    <a href="perfil.html"><i class="fas fa-cog"></i> Configuración</a>
                    <div class="dropdown-divider"></div>
                    <a href="#" onclick="event.preventDefault(); cerrarSesion()"><i class="fas fa-sign-out-alt"></i> Cerrar sesión</a>
                </div>
            </div>
        `;
    } else {
        container.innerHTML = `
            <div class="login-panel">
                <input type="email" id="login-email" placeholder="Email">
                <input type="password" id="login-password" placeholder="Contraseña">
                <button class="btn-acceder" onclick="iniciarSesion()">ACCEDER</button>
                <button class="btn-registrarse" onclick="window.location.href='auth.html'">REGISTRARSE</button>
            </div>
        `;
    }
});