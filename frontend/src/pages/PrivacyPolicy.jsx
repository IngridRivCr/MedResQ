import React from "react";
import { useNavigate } from "react-router-dom";

export default function PrivacyPolicy() {
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
        Privacy Policy
      </h1>
      <p style={{ fontSize: "13px", color: "#666666", marginBottom: "24px" }}>
        Last updated: June 20, 2026
      </p>

      <p style={{ fontSize: "14px", color: "#333333", lineHeight: "1.6", marginBottom: "16px" }}>
        At MedResQ, we value your privacy and are committed to protecting your personal
        information. This Privacy Policy explains how we collect, use, and safeguard your
        data when you use our mobile application. By using MedResQ, you agree to the
        practices described below.
      </p>

      <Section title="1. Information We Collect">
        We may collect the following types of information: personal data such as name,
        email address, or contact details provided during registration or communication;
        usage data including device information, app interactions, IP address, and
        technical details about your use of the app; and optional information you choose
        to provide (e.g., profile info or preferences).
      </Section>

      <Section title="2. How We Use the Information">
        We use your data to operate and improve the application and its features, provide
        user support and respond to inquiries, send important updates or notifications
        related to the app, and ensure compliance with legal and security requirements. We
        do not sell or rent your personal information to third parties.
      </Section>

      <Section title="3. Data Storage and Security">
        Your data is stored securely using reasonable technical and organizational measures
        to prevent unauthorized access, loss, or misuse. While we take these precautions,
        no method of transmission or storage is completely secure, and we cannot guarantee
        absolute protection.
      </Section>

      <Section title="4. Sharing of Information">
        We may share limited data with trusted service providers who assist us in app
        operations (for example, hosting, analytics, or maintenance). These providers are
        required to handle your information confidentially and use it only for the purposes
        we specify. We may also share information when required by law or to protect our
        legal rights.
      </Section>

      <Section title="5. User Rights">
        You have the right to access, correct, or delete your personal data, and to
        withdraw consent for data processing (where applicable). Requests can be made via
        our contact email: support@medresq.com.
      </Section>

      <Section title="6. Changes to This Policy">
        We may update this Privacy Policy from time to time. Any changes will be reflected
        with a new "Last updated" date. Continued use of the application after such updates
        implies acceptance of the revised policy.
      </Section>

      <Section title="7. Contact">
        If you have any questions or concerns about this Privacy Policy or the handling of
        your data, please contact us at: supportmedresq@gmail.com
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