// Popup aviso Brave — solo se muestra una vez por sesión
(function() {
    if (sessionStorage.getItem("brave_popup_shown")) return;
    sessionStorage.setItem("brave_popup_shown", "1");
 
    const overlay = document.createElement("div");
    overlay.id = "brave-popup-overlay";
    overlay.style.cssText = `
        position:fixed;top:0;left:0;width:100%;height:100%;
        background:rgba(0,0,0,0.75);z-index:99999;
        display:flex;align-items:center;justify-content:center;
        backdrop-filter:blur(4px);
    `;
 
    overlay.innerHTML = `
        <div style="
            background:#0a0a0a;border:1px solid #00e5ff;border-radius:16px;
            padding:35px 30px;max-width:420px;width:90%;text-align:center;
            box-shadow:0 0 40px rgba(0,229,255,0.2);font-family:'Arial Black',sans-serif;
        ">
            <div style="font-size:2em;margin-bottom:15px;">⚠️</div>
            <h3 style="color:#00e5ff;font-size:1em;text-transform:uppercase;letter-spacing:1px;margin:0 0 15px;">
                Aviso sobre descargas
            </h3>
            <p style="color:#aaa;font-family:sans-serif;font-size:0.88em;line-height:1.6;margin:0 0 25px;">
                ⚠️ Aviso: Algunos usuarios han reportado demoras o 
                inconvenientes al iniciar ciertas descargas desde Chrome.
                 Las descargas se encuentran operativas. 
 <b style="color:#fff;">Si una descarga no comienza correctamente,</b>, 
                te recomendamos usar el navegador 
                <b style="color:#ff6600;">Brave</b>. 
                Estamos trabajando para solucionarlo. ¡Gracias por tu paciencia!
            </p>
            <a href="https://brave.com/download" target="_blank" style="
                display:inline-block;background:#ff6600;color:#fff;
                text-decoration:none;padding:10px 24px;border-radius:8px;
                font-size:0.75em;font-weight:bold;letter-spacing:1px;
                text-transform:uppercase;margin-bottom:12px;
                transition:opacity 0.2s;
            " onmouseover="this.style.opacity=0.8" onmouseout="this.style.opacity=1">
                Descargar Brave
            </a>
            <br>
            <button onclick="document.getElementById('brave-popup-overlay').remove()" style="
                background:transparent;border:1px solid #333;color:#555;
                padding:8px 20px;border-radius:8px;cursor:pointer;
                font-family:'Arial Black',sans-serif;font-size:0.7em;
                text-transform:uppercase;margin-top:8px;transition:all 0.2s;
            " onmouseover="this.style.borderColor='#00e5ff';this.style.color='#00e5ff'"
               onmouseout="this.style.borderColor='#333';this.style.color='#555'">
                Entendido, cerrar
            </button>
        </div>
    `;
 
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) overlay.remove();
    });
 
    document.body.appendChild(overlay);
})();
