import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import * as htmlToImage from "html-to-image";

export default function MyQRcode() {
  const navigate = useNavigate();
  const qrContainerRef = useRef(null);
  const [userId, setUserId] = useState("2");
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    const session = localStorage.getItem("user");
    if (session) {
      try {
        const user = JSON.parse(session);
        console.log("Sesión cargada en QR:", user);

        const realId = user.user_id || user.id || user.id_usuario || "2";
        setUserId(String(realId));
        setUserName(user.name || user.nombre || "User");
      } catch (e) {
        console.error("Error cargando sesión:", e);
      }
    }
  }, []);

  // Función para descargar la imagen del QR
  const downloadQRCode = () => {
    if (qrContainerRef.current === null) return;
    htmlToImage.toPng(qrContainerRef.current, { backgroundColor: "#ffffff", pixelRatio: 3 })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `MedResQ-QR-${userName.replace(/\s+/g, "-")}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error("No se pudo generar la imagen del QR:", err);
      });
  };

  // URL dinámica exacta con el user_id
  const profileUrl = `${window.location.origin}/public-profile/${userId}`;

  // Imagen del QR generada por un servicio externo gratuito (sin dependencias de React)
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=190x190&data=${encodeURIComponent(profileUrl)}`;

  return (
    <div style={{
      fontFamily: "'Segoe UI', Roboto, Helvetica, sans-serif",
      backgroundColor: "#ffffff",
      minHeight: "100vh",
      padding: "40px 20px",
      boxSizing: "border-box",
      position: "relative",
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }}>

      {/* Botón de regreso */}
      <div
        onClick={() => navigate("/profile")}
        style={{
          position: "absolute",
          top: "40px",
          left: "40px",
          fontSize: "32px",
          color: "#0b0e2d",
          cursor: "pointer",
          fontWeight: "bold",
          userSelect: "none",
          lineHeight: "1"
        }}
      >
        &lt;
      </div>

      {/* Título Principal */}
      <h1 style={{
        fontSize: "28px",
        fontWeight: "bold",
        color: "#0b0e2d",
        marginTop: "20px",
        marginBottom: "40px",
        textAlign: "center"
      }}>
        QR Code
      </h1>

      {/* Tarjeta contenedora */}
      <div style={{
        backgroundColor: "#e8eff9",
        borderRadius: "16px",
        padding: "40px",
        maxWidth: "900px",
        width: "100%",
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: "40px",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)",
        boxSizing: "border-box",
        marginBottom: "50px"
      }}>

        {/* COLUMNA: EL CÓDIGO QR REAL */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div
            ref={qrContainerRef}
            onClick={downloadQRCode}
            title="Click to download QR Code"
            style={{
              backgroundColor: "#ffffff",
              padding: "20px",
              borderRadius: "28px",
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0 8px 24px rgba(11, 14, 45, 0.15)"
            }}
          >
            <img
              src={qrImageUrl}
              alt="Código QR de tu perfil médico"
              width={190}
              height={190}
            />
          </div>
          <span style={{
            fontSize: "12px",
            color: "#0b0e2d",
            marginTop: "12px",
            opacity: 0.7,
            fontWeight: "500",
            cursor: "pointer"
          }} onClick={downloadQRCode}>
            ⬇ Click QR code to download
          </span>
        </div>

        {/* Info lateral con todo el texto */}
        <div style={{
          flex: "1",
          minWidth: "280px",
          display: "flex",
          flexDirection: "column",
          gap: "16px"
        }}>
          <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#0b0e2d", margin: 0 }}>
            Scan QR code to connect
          </h2>
          <p style={{ fontSize: "14px", fontWeight: "bold", color: "#0b0e2d", margin: 0, lineHeight: "1.4" }}>
            Use your camera app or QR code reader on your device
          </p>
          <p style={{ fontSize: "14px", color: "#333333", margin: 0, lineHeight: "1.5" }}>
            Link your QR code to your profile so that, in case of an emergency, authorized medical personnel can quickly access your medical information and provide timely care.
          </p>
          <p style={{ fontSize: "14px", color: "#333333", margin: 0, lineHeight: "1.5" }}>
            Set an image of your QR code as your lock screen wallpaper or keep it easily accessible on your device. This allows medical personnel to scan it quickly during an emergency and access your authorized medical information.
          </p>
        </div>
      </div>

      {/* Nota final */}
      <p style={{
        fontSize: "12px",
        color: "#444444",
        textAlign: "center",
        maxWidth: "600px",
        lineHeight: "1.4",
        margin: "0 auto",
        fontWeight: "500"
      }}>
        Note: Keep your medical information up to date to ensure you receive the most appropriate care.
      </p>
    </div>
  );
}