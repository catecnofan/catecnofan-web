import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";
import { getFirestore, collection, query, orderBy, limit, onSnapshot } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";
 
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
const db = getFirestore(app);
 
const IDIOMAS = {
    es: { bunker:"Bunker", perfil:"Mi Perfil", config:"Configuración", salir:"Cerrar sesión", acceder:"ACCEDER", registrarse:"REGISTRARSE", emailPH:"Email", passPH:"Contraseña", sinNotif:"Sin notificaciones nuevas", haEscrito:"ha escrito un mensaje", notifTitulo:"Mensajes nuevos", marcarLeidas:"Marcar todo como leído" },
    en: { bunker:"Bunker", perfil:"My Profile", config:"Settings", salir:"Log out", acceder:"LOG IN", registrarse:"SIGN UP", emailPH:"Email", passPH:"Password", sinNotif:"No new notifications", haEscrito:"wrote a message", notifTitulo:"New messages", marcarLeidas:"Mark all as read" },
    pt: { bunker:"Bunker", perfil:"Meu Perfil", config:"Configurações", salir:"Sair", acceder:"ENTRAR", registrarse:"REGISTRAR", emailPH:"Email", passPH:"Senha", sinNotif:"Sem novas notificações", haEscrito:"escreveu uma mensagem", notifTitulo:"Novas mensagens", marcarLeidas:"Marcar tudo como lido" }
};
const BANDERAS = { es:"🇦🇷", en:"🇺🇸", pt:"🇧🇷" };
let idiomaActual = localStorage.getItem("ctf_idioma") || "es";
let t = IDIOMAS[idiomaActual];
let notifAbierto = false;
let langAbierto = false;
 
window.cambiarIdioma = (lang) => {
    idiomaActual = lang;
    t = IDIOMAS[lang];
    localStorage.setItem("ctf_idioma", lang);
    langAbierto = false;
    document.getElementById("lang-wrap")?.classList.remove("lang-open");
    renderContainer(auth.currentUser);
    // Traducir toda la página
    if (lang === 'es') {
        // Volver al original
        const restore = document.querySelector('.goog-te-banner-frame');
        if (restore) window.location.reload();
    } else {
        window.traducirPagina(lang);
    }
};
 
window.toggleNotif = (e) => {
    e.stopPropagation();
    notifAbierto = !notifAbierto;
    langAbierto = false;
    document.getElementById("notif-wrap")?.classList.toggle("notif-open", notifAbierto);
    document.getElementById("lang-wrap")?.classList.remove("lang-open");
    if (notifAbierto) renderNotifDropdown();
};
 
window.toggleLang = (e) => {
    e.stopPropagation();
    langAbierto = !langAbierto;
    notifAbierto = false;
    document.getElementById("lang-wrap")?.classList.toggle("lang-open", langAbierto);
    document.getElementById("notif-wrap")?.classList.remove("notif-open");
};
 
const SALAS = [
    { id:"ps4",     coleccion:"chat_general",     nombre:"PS4 / ShadPS4",           icono:"🎮" },
    { id:"switch",  coleccion:"chat_switch",       nombre:"Switch",                  icono:"🕹️" },
    { id:"ps3",     coleccion:"chat_ps3",          nombre:"PS3 / RPCS3",             icono:"📀" },
    { id:"xbox",    coleccion:"chat_xbox",         nombre:"Xbox 360 / Xenia",        icono:"🟩" },
    { id:"retro",   coleccion:"chat_retro",        nombre:"Retro / N64 / Dreamcast", icono:"👾" },
    { id:"general", coleccion:"chat_general_sala", nombre:"General",                 icono:"💬" }
];
 
let notificaciones = [];
 
function truncar(texto, max=45) { return texto.length > max ? texto.substring(0, max) + "..." : texto; }
 
function renderBadge() {
    const badge = document.getElementById("notif-badge");
    if (!badge) return;
    const c = notificaciones.length;
    badge.textContent = c > 9 ? "9+" : c;
    badge.style.display = c > 0 ? "flex" : "none";
}
 
function renderNotifDropdown() {
    const dd = document.getElementById("notif-dropdown");
    if (!dd) return;
    if (notificaciones.length === 0) {
        dd.innerHTML = `<div class="notif-header">${t.notifTitulo}</div><div class="notif-empty">${t.sinNotif}</div>`;
        return;
    }
    let html = `<div class="notif-header">${t.notifTitulo}<span class="notif-marcar" onclick="marcarTodasLeidas()">${t.marcarLeidas}</span></div>`;
    notificaciones.forEach(n => {
        html += `
            <a href="chat.html?sala=${n.salaId}" class="notif-item" onclick="marcarSalaLeida('${n.salaId}')">
                <div class="notif-sala-icon">${n.salaIcono}</div>
                <div class="notif-body">
                    <div class="notif-meta"><b>${n.usuario}</b> en ${n.salaNombre}</div>
                    <div class="notif-texto">${truncar(n.texto)}</div>
                    <div class="notif-accion">${t.haEscrito}</div>
                </div>
            </a>`;
    });
    dd.innerHTML = html;
}
 
window.marcarTodasLeidas = () => { notificaciones = []; renderBadge(); renderNotifDropdown(); };
window.marcarSalaLeida = (salaId) => { notificaciones = notificaciones.filter(n => n.salaId !== salaId); renderBadge(); renderNotifDropdown(); };
 
function escucharSalas(currentUser) {
    const salaActual = new URLSearchParams(window.location.search).get("sala");
    SALAS.forEach(sala => {
        const q = query(collection(db, sala.coleccion), orderBy("createdAt", "desc"), limit(10));
        let primera = true;
        onSnapshot(q, (snapshot) => {
            if (primera) { primera = false; return; }
            snapshot.docChanges().forEach(change => {
                if (change.type !== "added") return;
                const data = change.doc.data();
                if (currentUser && data.uid === currentUser.uid) return;
                if (sala.id === salaActual) return;
                const yaExiste = notificaciones.some(n => n.salaId === sala.id && n.texto === data.text && n.usuario === data.displayName);
                if (yaExiste) return;
                notificaciones.unshift({ salaId:sala.id, salaIcono:sala.icono, salaNombre:sala.nombre, usuario:data.displayName||"Usuario", texto:data.text||"" });
                if (notificaciones.length > 20) notificaciones.pop();
                renderBadge();
                renderNotifDropdown();
            });
        });
    });
}
 
function renderContainer(user) {
    const container = document.getElementById('login-container');
    if (!container) return;
 
    // Panel login/usuario — igual que siempre
    if (user) {
        const nombre = user.displayName || user.email.split('@')[0];
        window.currentUserName = nombre;
        const foto = user.photoURL;
        const avatarHTML = foto ? `<img src="${foto}" class="user-avatar-img">` : `<div class="user-avatar">${nombre.charAt(0).toUpperCase()}</div>`;
        container.innerHTML = `
            <div class="user-panel" onclick="this.classList.toggle('open')">
                ${avatarHTML}
                <div class="user-info">
                    <span class="user-label">${t.bunker}</span>
                    <span class="user-name">${nombre}</span>
                </div>
                <i class="fas fa-chevron-down user-chevron"></i>
                <div class="user-dropdown">
                    <a href="perfil.html"><i class="fas fa-user"></i> ${t.perfil}</a>
                    <a href="perfil.html"><i class="fas fa-cog"></i> ${t.config}</a>
                    <div class="dropdown-divider"></div>
                    <a href="#" onclick="event.preventDefault(); cerrarSesion()"><i class="fas fa-sign-out-alt"></i> ${t.salir}</a>
                </div>
            </div>`;
    } else {
        container.innerHTML = `
            <div class="login-panel">
                <input type="email" id="login-email" placeholder="${t.emailPH}">
                <input type="password" id="login-password" placeholder="${t.passPH}">
                <button class="btn-acceder" onclick="iniciarSesion()">${t.acceder}</button>
                <button class="btn-registrarse" onclick="window.location.href='auth.html'">${t.registrarse}</button>
            </div>`;
    }
 
    // Extras — se inyectan directo en el header, separados del login-container
    let extras = document.getElementById("header-extras");
    if (!extras) {
        extras = document.createElement("div");
        extras.id = "header-extras";
        document.querySelector("header").appendChild(extras);
    }
extras.innerHTML = `
    ${user ? `
    <div class="notif-wrap" id="notif-wrap">
        <button class="notif-btn" onclick="toggleNotif(event)">
            <i class="fas fa-bell"></i>
            <span class="notif-badge" id="notif-badge" style="display:none;">0</span>
        </button>
        <div class="notif-dropdown" id="notif-dropdown">
            <div class="notif-header">${t.notifTitulo}</div>
            <div class="notif-empty">${t.sinNotif}</div>
        </div>
    </div>` : ''}
    <div class="lang-wrap" id="lang-wrap">
        <button class="lang-trigger" onclick="toggleLang(event)">
            ${BANDERAS[idiomaActual]} <i class="fas fa-chevron-down lang-chevron"></i>
        </button>
        <div class="lang-dropdown">
            <div class="lang-option ${idiomaActual==='es'?'lang-active':''}" data-lang="es" onclick="cambiarIdioma('es')">${BANDERAS.es} Español</div>
            <div class="lang-option ${idiomaActual==='en'?'lang-active':''}" data-lang="en" onclick="cambiarIdioma('en')">${BANDERAS.en} English</div>
            <div class="lang-option ${idiomaActual==='pt'?'lang-active':''}" data-lang="pt" onclick="cambiarIdioma('pt')">${BANDERAS.pt} Português</div>
        </div>
    </div>`;
}
 

document.addEventListener('click', (e) => {
    const panel = document.querySelector('.user-panel');
    if (panel && !panel.contains(e.target)) panel.classList.remove('open');
    const nw = document.getElementById("notif-wrap");
    if (nw && !nw.contains(e.target)) { notifAbierto = false; nw.classList.remove("notif-open"); }
    const lw = document.getElementById("lang-wrap");
    if (lw && !lw.contains(e.target)) { langAbierto = false; lw.classList.remove("lang-open"); }
});
 
window.iniciarSesion = async () => {
    try {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        await signInWithEmailAndPassword(auth, email, password);
        location.reload();
    } catch (e) { alert("Error: " + e.message); }
};
 
window.cerrarSesion = () => { signOut(auth).then(() => location.reload()); };
 
onAuthStateChanged(auth, (user) => {
    window.currentUser = user || null;
    renderContainer(user);
    if (user) escucharSalas(user);
});
 
