// Popup aviso descargas CaTecnoFan — solo se muestra una vez por sesión
(function() {
    if (sessionStorage.getItem("ctf_popup_shown")) return;
    sessionStorage.setItem("ctf_popup_shown", "1");

    if (!document.getElementById("ctf-popup-style")) {
        const css = document.createElement("style");
        css.id = "ctf-popup-style";
        css.textContent = `
            #ctf-popup-overlay {
                position: fixed; inset: 0; z-index: 99999;
                background: rgba(0,0,0,0.82);
                display: flex; align-items: center; justify-content: center;
                padding: 20px; backdrop-filter: blur(6px);
            }
            #ctf-popup-card {
                background: #0a0a0a;
                border: 1px solid #333;
                border-radius: 16px;
                max-width: 460px; width: 100%;
                overflow: hidden;
                box-shadow: 0 0 60px rgba(0,0,0,0.9), 0 0 40px rgba(196,76,255,0.18);
                font-family: 'Arial Black', Gadget, sans-serif;
                text-align: center;
            }
            #ctf-popup-card .ctf-line {
                height: 5px;
                background: #ff00ff;
                box-shadow: 0 0 18px #ff00ff;
            }
            #ctf-popup-inner { padding: 28px 26px 26px; }
            #ctf-popup-card .ctf-eye {
                font-family: 'JetBrains Mono', 'Courier New', monospace;
                font-size: 0.68em; letter-spacing: 3px;
                color: #4dff9e; text-transform: uppercase;
                margin: 0 0 12px;
            }
            #ctf-popup-card h3 {
                margin: 0 0 18px;
                color: #fff; font-size: 1.15em; font-weight: 900;
                letter-spacing: 1px; text-transform: uppercase;
                text-shadow: 0 0 18px rgba(196,76,255,0.7);
            }
            #ctf-popup-card h3 span {
                color: #d24dff;
                text-shadow: 0 0 12px #c44cff, 0 0 28px rgba(196,76,255,0.85);
            }
            #ctf-popup-card .ctf-p {
                font-family: sans-serif; font-weight: normal;
                font-size: 0.86em; line-height: 1.6;
                color: #bbb; text-align: left;
                background: #111; border: 1px solid #2c2c2c;
                border-radius: 10px; padding: 12px 14px; margin: 0 0 10px;
            }
            #ctf-popup-card .ctf-lang {
                font-family: 'JetBrains Mono', 'Courier New', monospace;
                font-size: 0.75em; color: #555; margin-right: 6px;
            }
            #ctf-popup-card .ctf-btn {
                display: inline-flex; align-items: center; justify-content: center; gap: 10px;
                margin-top: 14px;
                background: #1a1a1e; border: 2px solid #c44cff; color: #fff;
                text-decoration: none; padding: 12px 22px; border-radius: 8px;
                font-family: sans-serif; font-size: 0.82em; font-weight: 700;
                letter-spacing: 0.4px; text-transform: uppercase;
                box-shadow: 0 0 18px rgba(196,76,255,0.28);
            }
            #ctf-popup-card .ctf-btn:hover {
                background: #2a1836;
                box-shadow: 0 0 28px rgba(196,76,255,0.5);
            }
            #ctf-popup-card .ctf-btn i { color: #ff7ad9; }
            #ctf-popup-card .ctf-close {
                display: inline-block; margin-top: 12px;
                background: transparent; border: 1px solid #2c2c2c; color: #888;
                padding: 8px 16px; border-radius: 8px; cursor: pointer;
                font-family: 'Arial Black', sans-serif; font-size: 0.68em;
                text-transform: uppercase; letter-spacing: 0.5px;
            }
            #ctf-popup-card .ctf-close:hover {
                border-color: #00e5ff; color: #00e5ff;
            }
        `;
        document.head.appendChild(css);
    }

    const overlay = document.createElement("div");
    overlay.id = "ctf-popup-overlay";
    overlay.innerHTML = `
        <div id="ctf-popup-card">
            <div class="ctf-line"></div>
            <div id="ctf-popup-inner">
                <div class="ctf-eye">Downloader · CaTecnoFan</div>
                <h3>Aviso sobre <span>descargas</span></h3>
                <p class="ctf-p"><span class="ctf-lang">ES</span>Algunos usuarios han reportado demoras o inconvenientes al iniciar ciertas descargas desde Chrome. Las descargas se encuentran operativas. Si una descarga no comienza correctamente, recomendamos utilizar CaTecnoFan Downloader V1.5. Esta herramienta la desarrollamos especficiamente para resolver estos casos puntuales.</p>
                <p class="ctf-p"><span class="ctf-lang">US</span>Some users have reported delays or issues when starting downloads in Chrome. Downloads are operational. If a download does not start correctly, we recommend using CaTecnoFan Downloader V1.5. This tool was developed to solve this particular cases.</p>
                <a class="ctf-btn" href="https://catecnofan.com/downloader.html" target="_blank"><i class="fas fa-download"></i> Descargar CaTecnoFan Downloader</a>
                <br>
                <button class="ctf-close" type="button">Entendido, cerrar</button>
            </div>
        </div>
    `;

    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) overlay.remove();
    });
    overlay.querySelector(".ctf-close").addEventListener("click", () => overlay.remove());

    document.body.appendChild(overlay);
})();
