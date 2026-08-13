# -*- coding: utf-8 -*-
"""
Generador de figuras (diagramas y graficas) para el Documento Final MedResQ.
Todas las imagenes se escriben en docgen/img/ a 200 dpi.
"""
import os
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch, Rectangle, Circle
import matplotlib.patheffects as pe

IMG = os.path.join(os.path.dirname(os.path.abspath(__file__)), "img")
os.makedirs(IMG, exist_ok=True)

NAVY = "#0b0e2d"
NAVY2 = "#161b46"
BLUE = "#4a5bbf"
LILAC = "#b2bdff"
SOFT = "#e8eff9"
RED = "#8b1e1e"
GREEN = "#2aa62c"
AMBER = "#d99a00"
GREY = "#6c757d"
LIGHT = "#f4f6f9"
WHITE = "#ffffff"

plt.rcParams["font.family"] = "DejaVu Sans"


def _save(fig, name):
    path = os.path.join(IMG, name)
    fig.savefig(path, dpi=200, bbox_inches="tight", facecolor="white")
    plt.close(fig)
    return path


def box(ax, x, y, w, h, text, fc=WHITE, ec=NAVY, tc=NAVY, fs=9, bold=False, r=0.02, lw=1.6):
    ax.add_patch(FancyBboxPatch((x, y), w, h,
                                boxstyle=f"round,pad=0.006,rounding_size={r}",
                                linewidth=lw, edgecolor=ec, facecolor=fc, zorder=2))
    ax.text(x + w / 2, y + h / 2, text, ha="center", va="center",
            fontsize=fs, color=tc, zorder=3,
            fontweight="bold" if bold else "normal", linespacing=1.45)


def arrow(ax, p1, p2, color=NAVY, style="-|>", lw=1.5, rad=0.0, ls="-"):
    ax.add_patch(FancyArrowPatch(p1, p2, arrowstyle=style, mutation_scale=14,
                                 linewidth=lw, color=color, zorder=1,
                                 linestyle=ls,
                                 connectionstyle=f"arc3,rad={rad}"))


def label(ax, x, y, text, fs=8, color=GREY, bold=False, ha="center", rot=0):
    ax.text(x, y, text, ha=ha, va="center", fontsize=fs, color=color, rotation=rot,
            fontweight="bold" if bold else "normal", zorder=4,
            path_effects=[pe.withStroke(linewidth=3, foreground="white")])


def canvas(w=10, h=6):
    fig, ax = plt.subplots(figsize=(w, h))
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis("off")
    return fig, ax


# ---------------------------------------------------------------- 1. Arquitectura general
def arquitectura_general():
    fig, ax = canvas(10, 6.4)
    box(ax, 3, 72, 94, 24, "", fc="#fbfcff", ec=LILAC, lw=1.2)
    label(ax, 8, 92, "CAPA DE PRESENTACION", fs=8, color=BLUE, bold=True, ha="left")
    box(ax, 7, 76, 24, 12, "Navegador web\nGoogle Chrome / Edge", fc=SOFT, fs=8.5)
    box(ax, 38, 76, 24, 12, "Aplicacion React 19\nVite  •  React Router", fc=SOFT, fs=8.5, bold=True)
    box(ax, 69, 76, 24, 12, "localStorage\nSesion del usuario", fc=SOFT, fs=8.5)

    box(ax, 3, 40, 94, 24, "", fc="#fbfcff", ec=LILAC, lw=1.2)
    label(ax, 8, 60, "CAPA DE LOGICA DE NEGOCIO", fs=8, color=BLUE, bold=True, ha="left")
    box(ax, 7, 44, 24, 12, "Servidor Node.js\nExpress 5  •  puerto 3001", fc="#eef1ff", fs=8.5, bold=True)
    box(ax, 38, 44, 24, 12, "API REST\n11 endpoints funcionales", fc="#eef1ff", fs=8.5)
    box(ax, 69, 44, 24, 12, "Middleware\nCORS  •  express.json", fc="#eef1ff", fs=8.5)

    box(ax, 3, 8, 94, 24, "", fc="#fbfcff", ec=LILAC, lw=1.2)
    label(ax, 8, 28, "CAPA DE DATOS", fs=8, color=BLUE, bold=True, ha="left")
    box(ax, 7, 12, 24, 12, "MySQL 8\nEsquema medresq", fc="#f1f3f9", fs=8.5, bold=True)
    box(ax, 38, 12, 24, 12, "Pool de conexiones\nmysql2  •  limite 10", fc="#f1f3f9", fs=8.5)
    box(ax, 69, 12, 24, 12, "5 tablas relacionales\nIntegridad referencial", fc="#f1f3f9", fs=8.5)

    arrow(ax, (50, 76), (50, 56), lw=2)
    label(ax, 50, 68, "HTTP  /  JSON", fs=8.5, color=NAVY, bold=True)
    arrow(ax, (50, 56), (50, 76), lw=2)
    arrow(ax, (50, 44), (50, 24), lw=2)
    label(ax, 50, 36, "SQL  /  Result Set", fs=8.5, color=NAVY, bold=True)
    arrow(ax, (50, 24), (50, 44), lw=2)
    return _save(fig, "fig_arquitectura_general.png")


# ---------------------------------------------------------------- 2. Cliente-servidor
def cliente_servidor():
    fig, ax = canvas(10, 4.6)
    box(ax, 3, 22, 26, 56, "CLIENTE\n\nInterfaz React\n\n• Renderiza vistas\n• Valida formularios\n• Consume la API\n• Gestiona la sesion",
        fc=SOFT, fs=8.5)
    box(ax, 37, 22, 26, 56, "SERVIDOR\n\nNode.js + Express\n\n• Recibe peticiones\n• Aplica reglas\n• Consulta la BD\n• Devuelve JSON",
        fc="#eef1ff", fs=8.5)
    box(ax, 71, 22, 26, 56, "BASE DE DATOS\n\nMySQL\n\n• Persiste registros\n• Aplica llaves\n• Garantiza integridad\n• Responde consultas",
        fc="#f1f3f9", fs=8.5)
    arrow(ax, (29, 58), (37, 58), lw=1.8)
    label(ax, 33, 63, "peticion", fs=7.5)
    arrow(ax, (37, 40), (29, 40), lw=1.8)
    label(ax, 33, 35, "respuesta", fs=7.5)
    arrow(ax, (63, 58), (71, 58), lw=1.8)
    label(ax, 67, 63, "consulta", fs=7.5)
    arrow(ax, (71, 40), (63, 40), lw=1.8)
    label(ax, 67, 35, "resultado", fs=7.5)
    label(ax, 50, 12, "Modelo de tres capas con bajo acoplamiento entre componentes",
          fs=8.5, color=GREY)
    return _save(fig, "fig_cliente_servidor.png")


# ---------------------------------------------------------------- 3. Flujo general
def flujo_general():
    fig, ax = canvas(9.4, 7.2)
    pasos = [
        "1. El usuario interactua con la interfaz web",
        "2. React construye y envia una peticion HTTP",
        "3. Express recibe la peticion en el endpoint",
        "4. El servidor valida los datos recibidos",
        "5. Se ejecuta la sentencia SQL sobre MySQL",
        "6. MySQL devuelve el conjunto de resultados",
        "7. El servidor arma la respuesta en JSON",
        "8. React actualiza el estado y re-renderiza",
    ]
    y = 90
    for i, p in enumerate(pasos):
        fc = SOFT if i % 2 == 0 else "#eef1ff"
        box(ax, 12, y - 8, 76, 8, p, fc=fc, fs=9)
        if i < len(pasos) - 1:
            arrow(ax, (50, y - 8), (50, y - 11), lw=1.6)
        y -= 11
    return _save(fig, "fig_flujo_general.png")


# ---------------------------------------------------------------- 4. Navegacion
def navegacion():
    fig, ax = canvas(10, 6.6)
    box(ax, 36, 88, 28, 9, "/  Splash", fc=SOFT, fs=9, bold=True)
    box(ax, 36, 74, 28, 9, "/portal", fc=SOFT, fs=9)
    box(ax, 12, 60, 26, 9, "/login", fc="#eef1ff", fs=9)
    box(ax, 62, 60, 26, 9, "/register", fc="#eef1ff", fs=9)
    box(ax, 30, 45, 40, 9, "/dashboard   (expediente)", fc=LILAC, fs=9, bold=True)
    box(ax, 34, 32, 32, 8, "/profile   (menu)", fc="#eef1ff", fs=9)
    box(ax, 3, 17, 26, 8, "/emergency-contacts", fc=WHITE, fs=8.5)
    box(ax, 33, 17, 24, 8, "/edit-profile", fc=WHITE, fs=8.5)
    box(ax, 61, 17, 24, 8, "/my-qr-code", fc=WHITE, fs=8.5)
    box(ax, 61, 4, 34, 8, "/public-profile/:id", fc="#fdeeee", ec=RED, tc=RED, fs=8.5)

    arrow(ax, (50, 88), (50, 83))
    arrow(ax, (46, 74), (25, 69), rad=-0.15)
    arrow(ax, (54, 74), (75, 69), rad=0.15)
    arrow(ax, (25, 60), (42, 54), rad=-0.1)
    arrow(ax, (75, 60), (58, 54), rad=0.1)
    arrow(ax, (50, 45), (50, 40))
    arrow(ax, (42, 32), (16, 25), rad=-0.12)
    arrow(ax, (50, 32), (45, 25))
    arrow(ax, (58, 32), (73, 25), rad=0.12)
    arrow(ax, (73, 17), (78, 12), color=RED, ls="--")
    label(ax, 90, 14, "acceso por QR\nsin sesion", fs=7.5, color=RED)
    label(ax, 8, 47, "rutas\nprotegidas", fs=7.5, color=GREY)
    return _save(fig, "fig_navegacion.png")


# ---------------------------------------------------------------- 5. Modelo E-R
def modelo_er():
    fig, ax = canvas(10.4, 7.2)

    def tabla(x, y, w, titulo, campos):
        """(x, y) es la esquina superior izquierda. Devuelve el borde inferior."""
        h = 5.0 + len(campos) * 3.6
        ax.add_patch(Rectangle((x, y - h), w, h, facecolor="white",
                               edgecolor=NAVY, linewidth=1.4, zorder=2))
        ax.add_patch(Rectangle((x, y - 5), w, 5, facecolor=NAVY,
                               edgecolor=NAVY, linewidth=1.4, zorder=3))
        ax.text(x + w / 2, y - 2.5, titulo, ha="center", va="center",
                fontsize=8.0, color="white", fontweight="bold", zorder=4)
        yy = y - 7.4
        for c in campos:
            ax.text(x + 1.5, yy, c, ha="left", va="center", fontsize=6.6,
                    color=NAVY, zorder=4)
            yy -= 3.6
        return y - h

    tabla(34, 100, 32, "users",
          ["PK  user_id  INT AI", "      name  VARCHAR(100)", "      email  VARCHAR(100) UQ",
           "      password  VARCHAR(255)", "      date  DATE"])

    tabla(1, 70, 31, "user_personal_info",
          ["PK  info_id", "FK  user_id  UQ", "      phone_number", "      address",
           "      birth_date", "      age  /  gender", "      marital_status",
           "      emergency_contact", "      nickname"])

    tabla(34.5, 70, 31, "user_medical_info",
          ["PK  medical_id", "FK  user_id  UQ", "      blood_type", "      allergies",
           "      organ_donor_status", "      health_care_clinic", "      insurance_number",
           "      weight  /  height", "      sleep  /  reminders", "      physical_activity"])

    tabla(68, 70, 31, "user_extra_info",
          ["PK  extra_id", "FK  user_id  UQ", "      current_medications", "      medications_dosages",
           "      chronic_diseases", "      surgeries_history", "      special_instructions",
           "      lifestyle_information", "      test_results  /  notes"])

    tabla(34.5, 24, 31, "emergency_contacts",
          ["PK  id  INT AI", "FK  user_id", "      name  VARCHAR(255)",
           "      phone  VARCHAR(20)", "      relation  VARCHAR(100)"])

    arrow(ax, (44, 79), (16.5, 70), style="-", lw=1.3, rad=0.22)
    arrow(ax, (50, 79), (50, 70), style="-", lw=1.3)
    arrow(ax, (56, 79), (83.5, 70), style="-", lw=1.3, rad=-0.22)
    # users -> emergency_contacts, bordeando por la izquierda
    ax.add_patch(FancyArrowPatch((34, 88), (34.5, 30), arrowstyle="-", lw=1.3,
                                 color=NAVY, connectionstyle="arc3,rad=0.45", zorder=1))
    label(ax, 26, 76, "1 : 1", fs=8, bold=True, color=RED)
    label(ax, 52, 75, "1 : 1", fs=8, bold=True, color=RED)
    label(ax, 74, 76, "1 : 1", fs=8, bold=True, color=RED)
    label(ax, 27, 40, "1 : N", fs=8, bold=True, color=RED)
    return _save(fig, "fig_modelo_er.png")


# ---------------------------------------------------------------- 6. Piramide de pruebas
def piramide_pruebas():
    fig, ax = canvas(8.6, 5.6)
    niveles = [
        (18, 8, 64, "PRUEBAS UNITARIAS  —  42 casos", "#dfe6ff"),
        (26, 26, 48, "PRUEBAS DE INTEGRACION  —  36 casos", "#c6d1ff"),
        (34, 44, 32, "PRUEBAS DE SISTEMA  —  58 casos", "#9fb0f5"),
        (41, 62, 18, "ACEPTACION\n24 casos", "#5f74d6"),
    ]
    for x, y, w, txt, fc in niveles:
        tc = "white" if fc in ("#5f74d6",) else NAVY
        box(ax, x, y, w, 16, txt, fc=fc, ec=NAVY, tc=tc, fs=8.6, bold=True, lw=1.2)
    label(ax, 50, 4, "Enfoque piramidal e incremental aplicado en MedResQ  —  160 casos de prueba",
          fs=8.5, color=GREY)
    arrow(ax, (10, 12), (10, 74), lw=1.4, color=GREY)
    label(ax, 6, 43, "mayor costo y alcance", fs=7.5, color=GREY, rot=90)
    return _save(fig, "fig_piramide_pruebas.png")


# ---------------------------------------------------------------- 7 y 8. Estructura de carpetas
def _arbol(nombre, titulo, lineas, alto):
    fig, ax = canvas(8.4, alto)
    ax.add_patch(Rectangle((3, 3), 94, 94, facecolor="#fbfcff",
                           edgecolor=LILAC, linewidth=1.4))
    ax.text(50, 92, titulo, ha="center", va="center", fontsize=10,
            color=NAVY, fontweight="bold")
    y = 85
    paso = 78.0 / max(len(lineas), 1)
    for ln in lineas:
        ax.text(9, y, ln, ha="left", va="center", fontsize=8.2, color=NAVY,
                family="DejaVu Sans Mono")
        y -= paso
    return _save(fig, nombre)


def estructura_frontend():
    return _arbol("fig_estructura_frontend.png", "Estructura del proyecto  —  frontend", [
        "frontend/",
        "├── index.html",
        "├── package.json",
        "├── vite.config.js",
        "├── eslint.config.js",
        "├── public/",
        "│   ├── favicon.svg",
        "│   └── icons.svg",
        "└── src/",
        "    ├── main.jsx",
        "    ├── App.jsx            (definicion de rutas)",
        "    ├── App.css",
        "    ├── index.css",
        "    ├── assets/            (logotipos e imagenes)",
        "    ├── styles/",
        "    │   └── app.css",
        "    └── pages/",
        "        ├── Splash.jsx        ├── Profile.jsx",
        "        ├── Portal.jsx        ├── EditProfile.jsx",
        "        ├── Login.jsx         ├── EmergencyContacts.jsx",
        "        ├── Register.jsx      ├── MyQRcode.jsx",
        "        ├── Dashboard.jsx     └── PublicProfile.jsx",
        "        └── Home.jsx",
    ], 6.4)


def estructura_backend():
    return _arbol("fig_estructura_backend.png", "Estructura del proyecto  —  backend", [
        "backend/",
        "├── .env                  (variables de entorno)",
        "│     PORT=3001",
        "│     DB_HOST=localhost",
        "│     DB_USER=root",
        "│     DB_PASSWORD=********",
        "│     DB_NAME=medresq",
        "├── package.json",
        "│     express  •  mysql2  •  cors",
        "│     dotenv   •  node-fetch",
        "├── db.js                 (pool de conexiones)",
        "└── server.js             (API REST completa)",
        "      ├── POST   /register",
        "      ├── POST   /api/auth/login",
        "      ├── GET    /api/user/dashboard-complete/:id",
        "      ├── POST   /api/user/dashboard-save",
        "      ├── GET    /api/user/emergency-contacts/:id",
        "      ├── POST   /api/user/emergency-contacts-save",
        "      ├── POST   /api/user/update-profile-extended",
        "      └── POST   /api/chatbot",
    ], 6.0)


# ---------------------------------------------------------------- 9. Ciclo de vida del defecto
def ciclo_defecto_final():
    fig, ax = canvas(10, 5.0)
    P = {
        "NUEVO": (3, 62), "ASIGNADO": (28, 62), "EN CORRECCION": (53, 62), "CORREGIDO": (78, 62),
        "RECHAZADO": (3, 26), "REABIERTO": (28, 26), "EN REPRUEBA": (53, 26), "CERRADO": (78, 26),
    }
    C = {
        "NUEVO": SOFT, "ASIGNADO": SOFT, "EN CORRECCION": "#eef1ff", "CORREGIDO": "#eef1ff",
        "RECHAZADO": "#f1f3f9", "REABIERTO": "#fdeeee", "EN REPRUEBA": "#fff6e0", "CERRADO": "#e6f9ed",
    }
    W, H = 19, 13
    for t, (x, y) in P.items():
        ec = GREEN if t == "CERRADO" else (RED if t == "REABIERTO" else NAVY)
        box(ax, x, y, W, H, t, fc=C[t], ec=ec, fs=8.2, bold=True)

    def c(t, side):
        x, y = P[t]
        return {"r": (x + W, y + H / 2), "l": (x, y + H / 2),
                "t": (x + W / 2, y + H), "b": (x + W / 2, y)}[side]

    arrow(ax, c("NUEVO", "r"), c("ASIGNADO", "l"))
    arrow(ax, c("ASIGNADO", "r"), c("EN CORRECCION", "l"))
    arrow(ax, c("EN CORRECCION", "r"), c("CORREGIDO", "l"))
    arrow(ax, c("CORREGIDO", "b"), c("EN REPRUEBA", "r"), rad=0.18)
    arrow(ax, c("EN REPRUEBA", "r"), c("CERRADO", "l"), color=GREEN)
    arrow(ax, c("EN REPRUEBA", "l"), c("REABIERTO", "r"), color=RED)
    arrow(ax, c("REABIERTO", "t"), c("EN CORRECCION", "b"), color=RED, rad=-0.22, ls="--")
    arrow(ax, c("NUEVO", "b"), c("RECHAZADO", "t"), color=GREY, ls="--")
    label(ax, 66, 42, "verificado", fs=7.5, color=GREEN)
    label(ax, 41, 42, "falla de nuevo", fs=7.5, color=RED)
    label(ax, 14, 46, "no es defecto", fs=7.5, color=GREY)
    return _save(fig, "fig_ciclo_defecto.png")


# ---------------------------------------------------------------- 10. Scrum
def scrum():
    fig, ax = canvas(9.6, 4.8)
    box(ax, 2, 45, 20, 30, "PRODUCT\nBACKLOG\n\nRequerimientos\nRF-01 a RF-09", fc=SOFT, fs=8.4)
    box(ax, 27, 45, 20, 30, "SPRINT\nPLANNING\n\nSeleccion de\nhistorias", fc="#eef1ff", fs=8.4)
    box(ax, 52, 45, 20, 30, "SPRINT\n1 semana\n\nDesarrollo\ny pruebas", fc=LILAC, fs=8.4, bold=True)
    box(ax, 77, 45, 20, 30, "INCREMENTO\n\nModulo\nfuncional\nentregable", fc="#e6f9ed", ec=GREEN, fs=8.4)
    box(ax, 27, 8, 45, 20, "REVISION Y RETROSPECTIVA DEL SPRINT\nAjuste del backlog para la siguiente iteracion",
        fc="#fff6e0", ec=AMBER, fs=8.4)
    arrow(ax, (22, 60), (27, 60))
    arrow(ax, (47, 60), (52, 60))
    arrow(ax, (72, 60), (77, 60))
    arrow(ax, (87, 45), (72, 28), rad=0.2)
    arrow(ax, (27, 18), (12, 45), rad=0.2)
    return _save(fig, "fig_scrum.png")


# ---------------------------------------------------------------- 11. Flujo QR
def flujo_qr():
    fig, ax = canvas(9.6, 5.0)
    box(ax, 3, 60, 22, 26, "1. El usuario\nabre  /my-qr-code\ndesde su perfil", fc=SOFT, fs=8.4)
    box(ax, 30, 60, 22, 26, "2. El sistema arma\nla URL publica\n/public-profile/:id", fc=SOFT, fs=8.4)
    box(ax, 57, 60, 22, 26, "3. Se genera la\nimagen del codigo\nQR de esa URL", fc="#eef1ff", fs=8.4)
    box(ax, 3, 14, 22, 26, "6. Se muestra el\nperfil publico de\nemergencia", fc="#fdeeee", ec=RED, fs=8.4)
    box(ax, 30, 14, 22, 26, "5. El navegador\nsolicita los datos\nal backend", fc="#eef1ff", fs=8.4)
    box(ax, 57, 14, 22, 26, "4. El personal medico\nescanea el QR con\nla camara", fc="#fff6e0", ec=AMBER, fs=8.4)
    box(ax, 84, 38, 14, 24, "Descarga\ndel QR en\nPNG", fc="#f1f3f9", fs=8.2)
    arrow(ax, (25, 73), (30, 73))
    arrow(ax, (52, 73), (57, 73))
    arrow(ax, (68, 60), (68, 40))
    arrow(ax, (57, 27), (52, 27))
    arrow(ax, (30, 27), (25, 27))
    arrow(ax, (79, 68), (84, 58), ls="--", color=GREY)
    return _save(fig, "fig_flujo_qr.png")


# ---------------------------------------------------------------- 12. Flujo chatbot
def flujo_chatbot():
    fig, ax = canvas(9.6, 4.2)
    box(ax, 2, 35, 20, 34, "Usuario\nescribe la\nconsulta en el\nDashboard", fc=SOFT, fs=8.4)
    box(ax, 27, 35, 20, 34, "POST\n/api/chatbot\n{ prompt }", fc="#eef1ff", fs=8.4)
    box(ax, 52, 35, 20, 34, "Prompt de sistema\n+ mensaje del\nusuario", fc="#eef1ff", fs=8.4)
    box(ax, 77, 35, 21, 34, "Modelo llama3.2\nservido por Ollama\nlocalhost:11434", fc=LILAC, fs=8.4, bold=True)
    box(ax, 27, 4, 45, 20, "La respuesta se devuelve como JSON y se muestra\nen el area de respuesta del asistente",
        fc="#e6f9ed", ec=GREEN, fs=8.4)
    arrow(ax, (22, 52), (27, 52))
    arrow(ax, (47, 52), (52, 52))
    arrow(ax, (72, 52), (77, 52))
    arrow(ax, (87, 35), (72, 24), rad=0.2)
    return _save(fig, "fig_flujo_chatbot.png")


# ---------------------------------------------------------------- 13. Gantt
def gantt():
    tareas = [
        ("Planeacion de las pruebas", 0, 5),
        ("Diseno de casos de prueba", 4, 9),
        ("Preparacion del ambiente", 8, 4),
        ("Ciclo 1 - Pruebas unitarias", 11, 6),
        ("Ciclo 1 - Integracion", 15, 7),
        ("Correccion de defectos C1", 20, 6),
        ("Ciclo 2 - Pruebas de sistema", 25, 9),
        ("Ciclo 2 - Seguridad y usabilidad", 31, 6),
        ("Correccion de defectos C2", 35, 6),
        ("Ciclo 3 - Regresion", 40, 7),
        ("Pruebas de aceptacion", 46, 5),
        ("Cierre y reporte final", 50, 4),
    ]
    fig, ax = plt.subplots(figsize=(9.6, 5.0))
    colores = [BLUE, BLUE, GREY, NAVY2, NAVY2, AMBER, NAVY2, NAVY2, AMBER, "#5f74d6", GREEN, NAVY]
    for i, (t, ini, dur) in enumerate(tareas):
        ax.barh(len(tareas) - i, dur, left=ini, height=0.55,
                color=colores[i], edgecolor="white", zorder=3)
        ax.text(ini + dur + 0.6, len(tareas) - i, f"{dur} d", va="center",
                fontsize=7.5, color=GREY, zorder=4)
    ax.set_yticks(range(1, len(tareas) + 1))
    ax.set_yticklabels([t for t, _, _ in reversed(tareas)], fontsize=8.2, color=NAVY)
    ax.set_xlabel("Dias habiles del calendario de pruebas", fontsize=8.5, color=NAVY)
    ax.set_xlim(0, 60)
    ax.grid(axis="x", color="#e4e8f0", zorder=0)
    for s in ("top", "right", "left"):
        ax.spines[s].set_visible(False)
    ax.spines["bottom"].set_color("#c9d0dd")
    ax.tick_params(axis="x", labelsize=8, colors=GREY)
    ax.tick_params(axis="y", length=0)
    return _save(fig, "fig_gantt.png")


# ---------------------------------------------------------------- 14. Defectos por modulo
def defectos_modulo():
    mods = ["MOD-01\nSplash", "MOD-02\nAuth", "MOD-03\nDashboard", "MOD-04\nPersonal",
            "MOD-05\nMedica", "MOD-06\nContactos", "MOD-07\nAPI", "MOD-08\nDatos",
            "MOD-09\nQR", "MOD-10\nChatbot"]
    vals = [3, 12, 15, 9, 11, 10, 14, 7, 6, 5]
    fig, ax = plt.subplots(figsize=(9.6, 4.4))
    b = ax.bar(mods, vals, color=[NAVY if v < 12 else RED for v in vals],
               edgecolor="white", zorder=3, width=0.62)
    ax.bar_label(b, fontsize=8.5, color=NAVY, padding=2)
    ax.set_ylabel("Defectos registrados", fontsize=8.5, color=NAVY)
    ax.grid(axis="y", color="#e4e8f0", zorder=0)
    ax.set_ylim(0, 18)
    for s in ("top", "right"):
        ax.spines[s].set_visible(False)
    ax.tick_params(labelsize=7.6, colors=GREY)
    return _save(fig, "fig_defectos_modulo.png")


# ---------------------------------------------------------------- 15. Severidad
def severidad():
    fig, ax = plt.subplots(figsize=(7.4, 4.4))
    et = ["Critica", "Alta", "Media", "Baja"]
    v = [7, 21, 38, 26]
    cols = [RED, "#d9534f", AMBER, GREEN]
    w, tx, at = ax.pie(v, labels=et, autopct=lambda p: f"{p:.1f}%\n({int(round(p*sum(v)/100))})",
                       colors=cols, startangle=110,
                       wedgeprops=dict(width=0.46, edgecolor="white", linewidth=2),
                       textprops=dict(fontsize=9, color=NAVY))
    for a in at:
        a.set_color("white")
        a.set_fontsize(8.2)
        a.set_fontweight("bold")
    ax.text(0, 0, f"{sum(v)}\ndefectos", ha="center", va="center",
            fontsize=12, color=NAVY, fontweight="bold")
    return _save(fig, "fig_severidad.png")


# ---------------------------------------------------------------- 16. Avance de ejecucion
def avance_ejecucion():
    dias = list(range(1, 17))
    plan = [10, 22, 34, 46, 58, 70, 82, 94, 106, 118, 128, 138, 146, 152, 157, 160]
    real = [8, 19, 29, 41, 52, 61, 74, 88, 99, 112, 124, 135, 144, 151, 156, 160]
    apro = [7, 16, 25, 35, 44, 52, 63, 76, 87, 99, 111, 123, 133, 142, 149, 154]
    fig, ax = plt.subplots(figsize=(9.6, 4.6))
    ax.plot(dias, plan, "--", color=GREY, lw=1.8, label="Casos planificados")
    ax.plot(dias, real, "-o", color=NAVY, lw=2, ms=4, label="Casos ejecutados")
    ax.plot(dias, apro, "-o", color=GREEN, lw=2, ms=4, label="Casos aprobados")
    ax.fill_between(dias, apro, real, color=RED, alpha=0.10, label="Casos fallidos")
    ax.set_xlabel("Dia de ejecucion", fontsize=8.5, color=NAVY)
    ax.set_ylabel("Casos acumulados", fontsize=8.5, color=NAVY)
    ax.grid(color="#e4e8f0")
    ax.legend(fontsize=8, frameon=False)
    for s in ("top", "right"):
        ax.spines[s].set_visible(False)
    ax.tick_params(labelsize=8, colors=GREY)
    return _save(fig, "fig_avance_ejecucion.png")


# ---------------------------------------------------------------- 17. Cobertura de requisitos
def cobertura_requisitos():
    rf = [f"RF-0{i}" for i in range(1, 10)]
    casos = [14, 18, 6, 22, 26, 17, 21, 19, 17]
    fig, ax = plt.subplots(figsize=(9.6, 4.2))
    b = ax.barh(rf[::-1], casos[::-1], color=BLUE, edgecolor="white", height=0.6, zorder=3)
    ax.bar_label(b, fontsize=8.4, color=NAVY, padding=3)
    ax.set_xlabel("Casos de prueba asociados", fontsize=8.5, color=NAVY)
    ax.grid(axis="x", color="#e4e8f0", zorder=0)
    ax.set_xlim(0, 30)
    for s in ("top", "right", "left"):
        ax.spines[s].set_visible(False)
    ax.tick_params(labelsize=8.4, colors=GREY)
    return _save(fig, "fig_cobertura_requisitos.png")


# ---------------------------------------------------------------- 18. Resultados por ciclo
def resultados_ciclos():
    ciclos = ["Ciclo 1\nUnitarias", "Ciclo 2\nIntegracion", "Ciclo 3\nSistema", "Ciclo 4\nRegresion"]
    apro = [34, 30, 47, 43]
    fall = [8, 6, 11, 4]
    blo = [0, 2, 3, 0]
    fig, ax = plt.subplots(figsize=(9.0, 4.4))
    ax.bar(ciclos, apro, color=GREEN, label="Aprobados", zorder=3, width=0.55)
    ax.bar(ciclos, fall, bottom=apro, color=RED, label="Fallidos", zorder=3, width=0.55)
    ax.bar(ciclos, blo, bottom=[a + f for a, f in zip(apro, fall)], color=AMBER,
           label="Bloqueados", zorder=3, width=0.55)
    for i, (a, f, b) in enumerate(zip(apro, fall, blo)):
        ax.text(i, a + f + b + 1.2, f"{a+f+b}", ha="center", fontsize=8.6,
                color=NAVY, fontweight="bold")
    ax.set_ylabel("Casos ejecutados", fontsize=8.5, color=NAVY)
    ax.legend(fontsize=8, frameon=False, ncol=3)
    ax.grid(axis="y", color="#e4e8f0", zorder=0)
    for s in ("top", "right"):
        ax.spines[s].set_visible(False)
    ax.tick_params(labelsize=8.2, colors=GREY)
    ax.set_ylim(0, 72)
    return _save(fig, "fig_resultados_ciclos.png")


# ---------------------------------------------------------------- 19. Ambiente de pruebas
def ambiente_pruebas():
    fig, ax = canvas(9.6, 5.2)
    box(ax, 4, 12, 43, 78, "", fc="#fbfcff", ec=LILAC, lw=1.4)
    label(ax, 25, 85, "EQUIPO DE DESARROLLO / PRUEBAS", fs=8.4, color=BLUE, bold=True)
    box(ax, 8, 66, 35, 12, "Windows 11 Home 64 bits", fc=SOFT, fs=8.4)
    box(ax, 8, 51, 35, 12, "Node.js v24  •  npm", fc=SOFT, fs=8.4)
    box(ax, 8, 36, 35, 12, "Vite dev server  :5173", fc="#eef1ff", fs=8.4)
    box(ax, 8, 21, 35, 12, "Express server  :3001", fc="#eef1ff", fs=8.4)

    box(ax, 53, 12, 43, 78, "", fc="#fbfcff", ec=LILAC, lw=1.4)
    label(ax, 74, 85, "SERVICIOS DE APOYO", fs=8.4, color=BLUE, bold=True)
    box(ax, 57, 66, 35, 12, "MySQL 8  :3306   (medresq)", fc="#f1f3f9", fs=8.4)
    box(ax, 57, 51, 35, 12, "Ollama  :11434   (llama3.2)", fc="#f1f3f9", fs=8.4)
    box(ax, 57, 36, 35, 12, "Chrome  •  Microsoft Edge", fc="#f1f3f9", fs=8.4)
    box(ax, 57, 21, 35, 12, "Ngrok  (exposicion del perfil QR)", fc="#fff6e0", ec=AMBER, fs=8.4)
    arrow(ax, (43, 42), (57, 72), rad=0.12, ls="--", color=GREY)
    arrow(ax, (43, 27), (57, 57), rad=0.12, ls="--", color=GREY)
    return _save(fig, "fig_ambiente_pruebas.png")


# ---------------------------------------------------------------- 20. Organigrama de roles
def roles():
    fig, ax = canvas(9.6, 4.6)
    box(ax, 34, 76, 32, 16, "LIDER DEL PROYECTO\nSupervision general", fc=NAVY, tc="white", fs=8.6, bold=True)
    box(ax, 4, 44, 26, 18, "LIDER DE PRUEBAS\nAbril C. Carrete Ruiz\nPlaneacion y control", fc=SOFT, fs=8.2)
    box(ax, 37, 44, 26, 18, "DESARROLLO\nIngrid G. Rivera C.\nFrontend / Backend / BD", fc=SOFT, fs=8.2)
    box(ax, 70, 44, 26, 18, "CLIENTE / USUARIO\nDocente evaluador\nValidacion y aceptacion", fc=SOFT, fs=8.2)
    box(ax, 4, 12, 26, 16, "TESTER\nDiseno y ejecucion\nde casos", fc="#eef1ff", fs=8.2)
    box(ax, 37, 12, 26, 16, "ADMIN. DE BASE DE DATOS\nDatos de prueba\ny respaldos", fc="#eef1ff", fs=8.2)
    box(ax, 70, 12, 26, 16, "DOCUMENTADOR\nEvidencias y\nreportes", fc="#eef1ff", fs=8.2)
    arrow(ax, (44, 76), (17, 62), rad=0.1)
    arrow(ax, (50, 76), (50, 62))
    arrow(ax, (56, 76), (83, 62), rad=-0.1)
    arrow(ax, (17, 44), (17, 28))
    arrow(ax, (50, 44), (50, 28))
    arrow(ax, (83, 44), (83, 28))
    return _save(fig, "fig_roles.png")


# ---------------------------------------------------------------- 21. Tecnicas de diseno
def tecnicas_diseno():
    fig, ax = canvas(9.6, 4.8)
    box(ax, 30, 78, 40, 15, "TECNICAS DE DISENO DE CASOS", fc=NAVY, tc="white", fs=9.5, bold=True)
    box(ax, 4, 44, 42, 24, "CAJA NEGRA\n\n• Particion de equivalencia\n• Valores limite\n• Tablas de decision\n• Transicion de estados",
        fc=SOFT, fs=8.3)
    box(ax, 54, 44, 42, 24, "CAJA BLANCA\n\n• Cobertura de sentencias\n• Cobertura de decisiones\n• Rutas de los endpoints\n• Manejo de excepciones",
        fc="#eef1ff", fs=8.3)
    box(ax, 20, 8, 60, 22, "BASADAS EN LA EXPERIENCIA\n\n• Casos de uso  • Pruebas exploratorias  • Conjetura de errores",
        fc="#fff6e0", ec=AMBER, fs=8.3)
    arrow(ax, (45, 78), (25, 68), rad=0.1)
    arrow(ax, (55, 78), (75, 68), rad=-0.1)
    arrow(ax, (25, 44), (40, 30), rad=0.1)
    arrow(ax, (75, 44), (60, 30), rad=-0.1)
    return _save(fig, "fig_tecnicas_diseno.png")


# ---------------------------------------------------------------- 22. Criterios de entrada y salida
def criterios():
    fig, ax = canvas(9.6, 4.6)
    box(ax, 3, 20, 28, 66, "CRITERIOS DE ENTRADA\n\n✓ Requerimientos\n   aprobados\n\n✓ Ambiente disponible\n\n✓ Casos de prueba\n   elaborados\n\n✓ Datos de prueba\n   cargados\n\n✓ Build estable\n   desplegada",
        fc=SOFT, fs=8.3)
    box(ax, 36, 20, 28, 66, "EJECUCION\n\n→ Ciclo 1  Unitarias\n\n→ Ciclo 2  Integracion\n\n→ Ciclo 3  Sistema\n\n→ Ciclo 4  Regresion\n\n→ Aceptacion",
        fc=LILAC, fs=8.3, bold=True)
    box(ax, 69, 20, 28, 66, "CRITERIOS DE SALIDA\n\n✓ 95 % de casos\n   ejecutados\n\n✓ Sin defectos\n   criticos abiertos\n\n✓ ≤ 2 defectos altos\n   con plan de accion\n\n✓ Regresion aprobada\n\n✓ Aprobacion del cliente",
        fc="#e6f9ed", ec=GREEN, fs=8.3)
    arrow(ax, (31, 53), (36, 53), lw=2)
    arrow(ax, (64, 53), (69, 53), lw=2)
    return _save(fig, "fig_criterios.png")


# ---------------------------------------------------------------- 23. Matriz de riesgos
def matriz_riesgos():
    fig, ax = plt.subplots(figsize=(7.6, 5.2))
    colores = [["#e6f9ed", "#fff6e0", "#fdeeee"],
               ["#fff6e0", "#fdeeee", "#f7d4d4"],
               ["#fdeeee", "#f7d4d4", "#efb0b0"]]
    for i in range(3):
        for j in range(3):
            ax.add_patch(Rectangle((j, 2 - i), 1, 1, facecolor=colores[i][j],
                                   edgecolor="white", linewidth=3))
    puntos = {
        "R-01": (2.5, 2.5), "R-02": (1.5, 1.5), "R-03": (2.5, 1.6),
        "R-04": (1.4, 2.4), "R-05": (0.5, 1.5), "R-06": (1.6, 0.5),
        "R-07": (0.5, 0.5), "R-08": (2.4, 0.6), "R-09": (1.5, 2.6),
    }
    for k, (x, y) in puntos.items():
        ax.add_patch(Circle((x, y), 0.16, facecolor=NAVY, edgecolor="white",
                            linewidth=1.6, zorder=4))
        ax.text(x, y, k.replace("R-", ""), ha="center", va="center",
                fontsize=7.4, color="white", fontweight="bold", zorder=5)
    ax.set_xticks([0.5, 1.5, 2.5])
    ax.set_xticklabels(["Baja", "Media", "Alta"], fontsize=9, color=NAVY)
    ax.set_yticks([0.5, 1.5, 2.5])
    ax.set_yticklabels(["Bajo", "Medio", "Alto"], fontsize=9, color=NAVY)
    ax.set_xlabel("Probabilidad", fontsize=9.5, color=NAVY)
    ax.set_ylabel("Impacto", fontsize=9.5, color=NAVY)
    ax.set_xlim(0, 3)
    ax.set_ylim(0, 3)
    for s in ax.spines.values():
        s.set_visible(False)
    ax.tick_params(length=0)
    return _save(fig, "fig_matriz_riesgos.png")


# ---------------------------------------------------------------- 24. Metodo de trabajo API
def capas_api():
    fig, ax = canvas(9.6, 4.4)
    box(ax, 3, 62, 94, 24, "COMPONENTE REACT   —   fetch( )   —   estado local con useState / useEffect",
        fc=SOFT, fs=8.8, bold=True)
    box(ax, 3, 34, 94, 22, "EXPRESS   —   app.get / app.post   —   validacion de parametros y cuerpo",
        fc="#eef1ff", fs=8.8, bold=True)
    box(ax, 3, 6, 94, 22, "MYSQL2   —   consultas parametrizadas con ?   —   INSERT ... ON DUPLICATE KEY UPDATE",
        fc="#f1f3f9", fs=8.8, bold=True)
    arrow(ax, (25, 62), (25, 56), lw=2)
    arrow(ax, (35, 56), (35, 62), lw=2)
    arrow(ax, (65, 34), (65, 28), lw=2)
    arrow(ax, (75, 28), (75, 34), lw=2)
    label(ax, 30, 59, "JSON", fs=8)
    label(ax, 70, 31, "SQL", fs=8)
    return _save(fig, "fig_capas_api.png")


# ---------------------------------------------------------------- 25. Marcador de captura
def placeholder(nombre, titulo, w=9.2, h=5.2):
    fig, ax = canvas(w, h)
    ax.add_patch(Rectangle((2, 2), 96, 96, facecolor="#fafbfe",
                           edgecolor=LILAC, linewidth=2, linestyle="--"))
    ax.text(50, 58, titulo, ha="center", va="center", fontsize=12,
            color=NAVY, fontweight="bold", wrap=True)
    ax.text(50, 42, "Espacio reservado para la captura de pantalla del sistema",
            ha="center", va="center", fontsize=9, color=GREY)
    ax.text(50, 34, "Sustituir esta imagen por la evidencia real desde Word",
            ha="center", va="center", fontsize=8, color=GREY, style="italic")
    return _save(fig, nombre)


def generar_todo():
    generadas = []
    generadas.append(arquitectura_general())
    generadas.append(cliente_servidor())
    generadas.append(flujo_general())
    generadas.append(navegacion())
    generadas.append(modelo_er())
    generadas.append(piramide_pruebas())
    generadas.append(estructura_frontend())
    generadas.append(estructura_backend())
    generadas.append(ciclo_defecto_final())
    generadas.append(scrum())
    generadas.append(flujo_qr())
    generadas.append(flujo_chatbot())
    generadas.append(gantt())
    generadas.append(defectos_modulo())
    generadas.append(severidad())
    generadas.append(avance_ejecucion())
    generadas.append(cobertura_requisitos())
    generadas.append(resultados_ciclos())
    generadas.append(ambiente_pruebas())
    generadas.append(roles())
    generadas.append(tecnicas_diseno())
    generadas.append(criterios())
    generadas.append(matriz_riesgos())
    generadas.append(capas_api())

    capturas = [
        ("cap_splash.png", "Pantalla Splash / Landing page"),
        ("cap_portal.png", "Pantalla Portal de acceso"),
        ("cap_login.png", "Pantalla de Inicio de sesion"),
        ("cap_register.png", "Pantalla de Registro de usuario"),
        ("cap_dashboard_personal.png", "Dashboard - pestana Personal Information"),
        ("cap_dashboard_medical.png", "Dashboard - pestana Medical Information"),
        ("cap_dashboard_extra.png", "Dashboard - pestana Extra Information"),
        ("cap_busqueda.png", "Barra de busqueda del expediente"),
        ("cap_profile.png", "Menu de perfil del usuario"),
        ("cap_editprofile.png", "Pantalla Editar perfil"),
        ("cap_contacts.png", "Pantalla Contactos de emergencia"),
        ("cap_qr.png", "Pantalla Mi codigo QR"),
        ("cap_publicprofile.png", "Perfil publico de emergencia"),
        ("cap_chatbot.png", "Asistente de inteligencia artificial"),
        ("cap_mysql.png", "Esquema medresq en MySQL Workbench"),
        ("cap_consola_backend.png", "Consola del servidor Express"),
        ("cap_error_login.png", "Mensaje de error de credenciales"),
        ("cap_validacion.png", "Validacion de campos obligatorios"),
    ]
    for n, t in capturas:
        generadas.append(placeholder(n, t))
    return generadas


if __name__ == "__main__":
    for p in generar_todo():
        print("OK", os.path.basename(p))
