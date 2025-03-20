import React from "react";

const PrivacyPolicy: React.FC = () => {
  return (
    <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
      <h2>Privacy Policy</h2>
      <p>
        At Calculx, we respect your privacy and are committed to protecting your
        personal data. This policy outlines how we collect, use, and safeguard
        your information when you use our services.
      </p>

      <h3>1. Information We Collect</h3>
      <p>We may collect the following types of information:</p>
      <ul>
        <li>
          <strong>Personal Information:</strong> Name, email address, phone
          number, and other details provided during registration.
        </li>
        <li>
          <strong>Usage Data:</strong> Information about how you interact with
          our services, including IP address, browser type, and access times.
        </li>
        <li>
          <strong>Payment Information:</strong> Payment details required for
          subscriptions or transactions (processed securely by third-party
          providers).
        </li>
      </ul>

      <h3>2. How We Use Your Information</h3>
      <p>Your information is used to:</p>
      <ul>
        <li>Provide and improve our services.</li>
        <li>Personalize your user experience.</li>
        <li>Communicate updates, promotions, or important notices.</li>
        <li>Ensure compliance with legal and regulatory requirements.</li>
      </ul>

      <h3>3. Data Sharing and Disclosure</h3>
      <p>
        We do not sell or share your personal information with third parties
        except:
      </p>
      <ul>
        <li>With your explicit consent.</li>
        <li>
          To trusted service providers who assist in delivering our services.
        </li>
        <li>
          To comply with legal obligations, such as responding to lawful
          requests or protecting against fraud.
        </li>
      </ul>

      <h3>4. Data Security</h3>
      <p>
        We implement robust security measures to protect your information from
        unauthorized access, alteration, or disclosure. However, no method of
        transmission or storage is entirely secure. Use our services at your
        discretion.
      </p>

      <h3>5. Your Rights</h3>
      <p>You have the right to:</p>
      <ul>
        <li>Access, update, or delete your personal information.</li>
        <li>Withdraw consent for data processing, where applicable.</li>
        <li>Opt-out of receiving non-essential communications.</li>
      </ul>
      <p>
        To exercise these rights, contact us at{" "}
        <a href="mailto:support@calculx.com">support@calculx.com</a>.
      </p>

      <h3>6. Data Retention</h3>
      <p>
        We retain your information only as long as necessary to fulfill the
        purposes outlined in this policy or as required by law.
      </p>

      <h3>7. Third-Party Services</h3>
      <p>
        Our services may include links to third-party websites or services.
        Please note that we are not responsible for their privacy practices.
        Review their privacy policies for details.
      </p>

      <h3>8. Updates to This Policy</h3>
      <p>
        We may update this privacy policy from time to time. Changes will be
        communicated via email or within the application. Continued use of our
        services indicates acceptance of the updated policy.
      </p>

      <h3>9. Contact Us</h3>
      <p>
        For questions or concerns about this privacy policy, please contact us:
        <ul>
          <li>
            Email: <a href="mailto:support@calculx.com">support@calculx.com</a>
          </li>
          <li>Phone: +123 456 7890</li>
        </ul>
      </p>
    </div>
  );
};

export default PrivacyPolicy;
