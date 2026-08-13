import React from "react";
import { useNavigate } from "react-router-dom";

export default function TermsAndConditions() {
  const navigate = useNavigate();

  return (
    <div style={{
      fontFamily: "'Segoe UI', Roboto, Helvetica, sans-serif",
      backgroundColor: "#ffffff",
      minHeight: "100vh",
      padding: "40px 20px",
      boxSizing: "border-box",
      position: "relative",
      maxWidth: "700px",
      margin: "0 auto"
    }}>
      <div
        onClick={() => navigate("/profile")}
        style={{
          fontSize: "32px",
          color: "#0b0e2d",
          cursor: "pointer",
          fontWeight: "bold",
          userSelect: "none",
          lineHeight: "1",
          marginBottom: "20px"
        }}
      >
        &lt;
      </div>

      <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "#0b0e2d", marginBottom: "8px" }}>
        Terms and Conditions
      </h1>
      <p style={{ fontSize: "13px", color: "#666666", marginBottom: "24px" }}>
        Last updated: June 20, 2026
      </p>

      <p style={{ fontSize: "14px", color: "#333333", lineHeight: "1.6", marginBottom: "16px" }}>
        By downloading or using MedResQ, you agree to the following terms and conditions.
        If you do not agree, we recommend that you do not use the application.
      </p>

      <Section title="Use of the service">
        The application is offered for lawful and personal purposes. The user agrees not to
        use it in a way that causes damage, disruption, or misuse of the service.
      </Section>

      <Section title="Registration and account">
        The user is responsible for the information they provide and the use of their
        account. We reserve the right to suspend accounts that violate these terms.
      </Section>

      <Section title="Intellectual property">
        All content, design, and code of the application belong to RIC. Unauthorized
        copying or distribution is not permitted.
      </Section>

      <Section title="Privacy">
        Personal information is treated in accordance with our Privacy Policy, available
        in the application.
      </Section>

      <Section title="Limitation of liability">
        We do not guarantee that the service will be free of errors or interruptions. We
        assume no responsibility for damages resulting from the use of the application.
      </Section>

      <Section title="Modifications">
        We may update these terms at any time. Continued use of the application implies
        acceptance of the modifications.
      </Section>

      <Section title="Applicable law">
        These terms are governed by the laws of Mexico. Any dispute will be resolved
        before the competent courts of that jurisdiction.
      </Section>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: "18px" }}>
      <h2 style={{ fontSize: "16px", fontWeight: "bold", color: "#0b0e2d", marginBottom: "6px" }}>
        {title}
      </h2>
      <p style={{ fontSize: "14px", color: "#333333", lineHeight: "1.6", margin: 0 }}>
        {children}
      </p>
    </div>
  );
}