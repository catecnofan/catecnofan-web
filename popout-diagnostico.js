// Popup Diagnóstico — solo se muestra una vez por sesión
(function() {
    if (sessionStorage.getItem("diagnostico_popup_shown")) return;
    sessionStorage.setItem("diagnostico_popup_shown", "1");

    const overlay = document.createElement("div");
    overlay.id = "diagnostico-popup-overlay";

    overlay.style.cssText = `
        position:fixed;top:0;left:0;width:100%;height:100%;
        background:rgba(0,0,0,0.75);z-index:99999;
        display:flex;align-items:center;justify-content:center;
        backdrop-filter:blur(4px);
    `;

    overlay.innerHTML = `
        <div style="
            background:#0a0a0a;border:1px solid #00e5ff;border-radius:16px;
            padding:35px 30px;max-width:500px;width:90%;text-align:center;
            box-shadow:0 0 40px rgba(0,229,255,0.2);
            font-family:'Arial Black',sans-serif;
        ">
            <div style="font-size:2em;margin-bottom:15px;">🛠️</div>

            <h3 style="
                color:#00e5ff;
                font-size:1em;
                text-transform:uppercase;
                letter-spacing:1px;
                margin:0 0 15px;
            ">
                Queremos ayudarte mejor
            </h3>

            <p style="
                color:#aaa;
                font-family:sans-serif;
                font-size:0.88em;
                line-height:1.6;
                margin:0 0 15px;
            ">
            Creamos esta sección de diagnóstico para poder darte soluciones más rápidas y precisas.
            <br><br>
            Con el crecimiento de la comunidad, muchas consultas son diferentes entre sí y responder cada caso desde cero no siempre nos permite dedicarle el tiempo necesario a cada persona.
            <br><br>
            Por eso organizamos las soluciones más comunes en esta guía. Si después de seguir los pasos tu problema continúa, encontrarás un formulario para enviarnos los detalles de tu caso y poder ayudarte de forma personalizada.
            </p>

            <h3 style="
                color:#00e5ff;
                font-size:1em;
                text-transform:uppercase;
                letter-spacing:1px;
                margin:25px 0 15px;
            ">
                We want to help you better
            </h3>

            <p style="
                color:#aaa;
                font-family:sans-serif;
                font-size:0.88em;
                line-height:1.6;
                margin:0 0 25px;
            ">
            We created this troubleshooting section to provide faster and more accurate solutions.
            <br><br>
            As our community grows, every issue can be different, and answering each case from scratch does not always allow us to dedicate the necessary time to everyone.
            <br><br>
            That is why we organized the most common solutions in this guide. If your problem continues after following the steps, you will find a form where you can send your details and receive personalized assistance.
            </p>

            <button onclick="document.getElementById('diagnostico-popup-overlay').remove()" style="
                background:transparent;
                border:1px solid #333;
                color:#555;
                padding:8px 20px;
                border-radius:8px;
                cursor:pointer;
                font-family:'Arial Black',sans-serif;
                font-size:0.7em;
                text-transform:uppercase;
                margin-top:8px;
                transition:all 0.2s;
            "
            onmouseover="this.style.borderColor='#00e5ff';this.style.color='#00e5ff'"
            onmouseout="this.style.borderColor='#333';this.style.color='#555'">
                Entendido, continuar / Understood, continue
            </button>

        </div>
    `;

    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) overlay.remove();
    });

    document.body.appendChild(overlay);
})();
