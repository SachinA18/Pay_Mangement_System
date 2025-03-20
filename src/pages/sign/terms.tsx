import React from "react";

const TermsAndConditions: React.FC = () => {
  return (
    <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
      <h2>Terms & Conditions</h2>
      <p>
        These terms and conditions outline the rules and regulations for the use
        of Calculx&apos;s services. By accessing or using Calculx, you agree to
        these terms in full. If you disagree with these terms, please refrain
        from using our services.
      </p>
      <h3>1. Definitions</h3>
      <p>
        - **Service**: Refers to the features and functionalities provided by
        Calculx, including but not limited to accounting tools, reports, and
        analytics.
      </p>
      <p>
        - **User**: Refers to any individual or entity using Calculx&apos;s
        services.
      </p>

      <h3>2. User Responsibilities</h3>
      <p>
        You agree to:
        <ul className="list-none ml-4">
          <li>
            - Provide accurate and complete information during registration and
            maintain up-to-date account details.
          </li>
          <li>
            - Use the service in compliance with applicable laws and
            regulations.
          </li>
          <li>
            - Be responsible for all activities under your account, including
            protecting your password and restricting access.
          </li>
        </ul>
      </p>

      <h3>3. Prohibited Uses</h3>
      <p>
        Users must not:
        <ul className="list-none ml-4">
          <li>- Attempt to hack, reverse-engineer, or disrupt the service.</li>
          <li>
            - Upload or distribute harmful content such as viruses or malicious
            code.
          </li>
          <li>
            - Engage in any activity that may harm Calculx&apos;s reputation or
            interfere with the service&apos;s integrity.
          </li>
        </ul>
      </p>

      <h3>4. Data Privacy</h3>
      <p>
        - Calculx respects your privacy and complies with applicable data
        protection regulations. We do not sell or share your data without your
        consent.
      </p>
      <p>
        - You retain ownership of your data; however, Calculx has the right to
        use aggregated, anonymized data for improving its services.
      </p>

      <h3>5. Payment and Subscription</h3>
      <p>
        - Calculx may offer both free and paid subscription plans. Payment terms
        will be specified during the subscription process.
      </p>
      <p>
        - Subscriptions will auto-renew unless canceled. Users can manage or
        cancel subscriptions via their account settings.
      </p>

      <h3>6. Limitation of Liability</h3>
      <p>
        - Calculx is provided on an as-is basis. We are not liable for service
        interruptions, data loss, or any damages resulting from the use of our
        services.
      </p>
      <p>
        - While we strive for 99.9% uptime, occasional maintenance or technical
        issues may occur.
      </p>

      <h3>7. Amendments</h3>
      <p>
        - Calculx reserves the right to modify these terms at any time. Users
        will be notified of significant changes via email or within the
        application.
      </p>
      <p>
        - Continued use of the service after updates indicates acceptance of the
        revised terms.
      </p>

      <h3>8. Termination</h3>
      <p>
        - Calculx reserves the right to suspend or terminate accounts for
        violation of these terms or misuse of the service.
      </p>
      <p>
        - Users can terminate their account at any time by contacting customer
        support.
      </p>

      <h3>9. Governing Law</h3>
      <p>
        These terms are governed by and construed in accordance with the laws of
        [Your Country/State]. Disputes will be resolved exclusively in [Your
        Court/Location].
      </p>

      <h3>10. Contact Us</h3>
      <p>
        For questions or concerns about these terms, contact us at:
        <ul className="list-none ml-4">
          <li>- Email: support@calculx.com</li>
          <li>- Phone: +123 456 7890</li>
        </ul>
      </p>
    </div>
  );
};

export default TermsAndConditions;
