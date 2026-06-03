import React, { useState } from "react";

export default function App() {
  const [screen, setScreen] = useState("welcome");

  if (screen === "welcome") {
    return (
      <div style={{
        background: "#F7F5F0",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        fontFamily: "Georgia, serif"
      }}>
        <div style={{ fontSize: "48px", fontWeight: "700", color: "#1A1814", marginBottom: "16px" }}>
          М-Ремонт
        </div>
        <div style={{ fontSize: "18px", color: "#7A756C", marginBottom: "32px", textAlign: "center" }}>
          Калькулятор стоимости ремонта по реальным ценам
        </div>
        <button
          onClick={() => setScreen("calculator")}
          style={{
            background: "#B8864E",
            color: "#FFF",
            border: "none",
            padding: "16px 40px",
            fontSize: "16px",
            fontWeight: "700",
            borderRadius: "100px",
            cursor: "pointer",
            fontFamily: "inherit"
          }}
        >
          Начать расчёт
        </button>
      </div>
    );
  }

  if (screen === "calculator") {
    return (
      <div style={{
        background: "#F7F5F0",
        minHeight: "100vh",
        padding: "20px",
        fontFamily: "Georgia, serif"
      }}>
        <button
          onClick={() => setScreen("welcome")}
          style={{
            background: "transparent",
            color: "#B8864E",
            border: "none",
            fontSize: "16px",
            fontWeight: "700",
            cursor: "pointer",
            marginBottom: "20px"
          }}
        >
          ← Назад
        </button>
        <div style={{
          background: "#FFF",
          padding: "20px",
          borderRadius: "16px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)"
        }}>
          <h1 style={{ color: "#1A1814", marginBottom: "16px" }}>Калькулятор ремонта</h1>
          <p style={{ color: "#7A756C", marginBottom: "16px" }}>
            Приложение успешно загружено! ✅
          </p>
          <p style={{ color: "#7A756C" }}>
            Сервер Vercel работает и готов к использованию API распознавания планов.
          </p>
        </div>
      </div>
    );
  }
}
