import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";
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

// ── Idiomas ──
const IDIOMAS = {
    es: { sinNotif:"Sin notificaciones nuevas", haEscrito:"ha escrito un mensaje", notifTitulo:"Mensajes nuevos", marcarLeidas:"Marcar todo como leído", nombre:"Español" },
    en: { sinNotif:"No new notifications", haEscrito:"wrote a message", notifTitulo:"New messages", marcarLeidas:"Mark all as read", nombre:"English" },
    pt: { sinNotif:"Sem novas notificações", haEscrito:"escreveu uma mensagem", notifTitulo:"Novas mensagens", marcarLeidas:"Marcar tudo como lido", nombre:"Português" }
};
const BANDERAS = { es:"🇦🇷", en:"🇺🇸", pt:"🇧🇷" };
let idiomaActual = localStorage.getItem("ctf_idioma") || "es";
let t = IDIOMAS[idiomaActual];

// ── Salas ──
const SALAS = [
    { id:"ps4",     coleccion:"chat_general",     nombre:"PS4 / ShadPS4",           icono:"🎮" },
    { id:"switch",  coleccion:"chat_switch",       nombre:"Switch",                  icono:"🕹️" },
    { id:"ps3",     coleccion:"chat_ps3",          nombre:"PS3 / RPCS3",             icono:"📀" },
    { id:"xbox",    coleccion:"chat_xbox",         nombre:"Xbox 360 / Xenia",        icono:"🟩" },
    { id:"retro",   coleccion:"chat_retro",        nombre:"Retro / N64 / Dreamcast", icono:"👾" },
    { id:"general", coleccion:"chat_general_sala", nombre:"General",                 icono:"💬" }
];

// ── Notificaciones ──
let notificaciones = [];
let notifAbierto = false;
let langAbierto = false;

function truncar(texto, max=45) {
    return texto.length > max ? texto.substring(0, max) + "..." : texto;
}

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
    let html = `<div class="notif-header">${t.notifTitulo}<span class="notif-marcar" onclick="window._marcarTodasLeidas()">${t.marcarLeidas}</span></div>`;
    notificaciones.forEach(n => {
        html += `
            <a href="chat.html?sala=${n.salaId}" class="notif-item" onclick="window._marcarSalaLeida('${n.salaId}')">
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

window._marcarTodasLeidas = () => { notificaciones = []; renderBadge(); renderNotifDropdown(); };
window._marcarSalaLeida = (salaId) => { notificaciones = notificaciones.filter(n => n.salaId !== salaId); renderBadge(); renderNotifDropdown(); };

window._toggleNotif = (e) => {
    e.stopPropagation();
    notifAbierto = !notifAbierto;
    langAbierto = false;
    document.getElementById("notif-wrap")?.classList.toggle("notif-open", notifAbierto);
    document.getElementById("lang-wrap")?.classList.remove("lang-open");
    if (notifAbierto) renderNotifDropdown();
};

window._toggleLang = (e) => {
    e.stopPropagation();
    langAbierto = !langAbierto;
    notifAbierto = false;
    document.getElementById("lang-wrap")?.classList.toggle("lang-open", langAbierto);
    document.getElementById("notif-wrap")?.classList.remove("notif-open");
};

window._cambiarIdioma = (lang) => {
    idiomaActual = lang;
    t = IDIOMAS[lang];
    localStorage.setItem("ctf_idioma", lang);
    langAbierto = false;
    renderExtras();
    renderNotifDropdown();
};

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

function renderExtras() {
    const container = document.getElementById("notif-extras");
    if (!container) return;

    container.innerHTML = `
        <div class="notif-wrap" id="notif-wrap">
            <button class="notif-btn" onclick="window._toggleNotif(event)">
                <i class="fas fa-bell"></i>
                <span class="notif-badge" id="notif-badge" style="display:none;">0</span>
            </button>
            <div class="notif-dropdown" id="notif-dropdown">
                <div class="notif-header">${t.notifTitulo}</div>
                <div class="notif-empty">${t.sinNotif}</div>
            </div>
        </div>
        <div class="lang-wrap" id="lang-wrap">
            <button class="lang-trigger" onclick="window._toggleLang(event)">
                ${BANDERAS[idiomaActual]} <i class="fas fa-chevron-down lang-chevron"></i>
            </button>
            <div class="lang-dropdown" id="lang-dropdown">
                <div class="lang-option ${idiomaActual==='es'?'lang-active':''}" onclick="window._cambiarIdioma('es')">${BANDERAS.es} Español</div>
                <div class="lang-option ${idiomaActual==='en'?'lang-active':''}" onclick="window._cambiarIdioma('en')">${BANDERAS.en} English</div>
                <div class="lang-option ${idiomaActual==='pt'?'lang-active':''}" onclick="window._cambiarIdioma('pt')">${BANDERAS.pt} Português</div>
            </div>
        </div>
    `;
}

// Cerrar al clickear afuera
document.addEventListener('click', (e) => {
    const nw = document.getElementById("notif-wrap");
    const lw = document.getElementById("lang-wrap");
    if (nw && !nw.contains(e.target)) { notifAbierto = false; nw.classList.remove("notif-open"); }
    if (lw && !lw.contains(e.target)) { langAbierto = false; lw.classList.remove("lang-open"); }
});

onAuthStateChanged(auth, (user) => {
    renderExtras();
    if (user) escucharSalas(user);
});
