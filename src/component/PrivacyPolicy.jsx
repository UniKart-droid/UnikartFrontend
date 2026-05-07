import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-6 md:px-16 mt-16">
      
      {/* HEADER */}
      <div className="max-w-5xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Privacy Policy
        </h1>
        <p className="text-gray-600 text-lg">
          Your privacy is important to us. This policy explains how UniKart collects, uses, and protects your information.
        </p>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-8 md:p-12 space-y-8">

        {/* SECTION */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            1. Information We Collect
          </h2>
          <p className="text-gray-600 leading-relaxed">
            We collect information that you provide directly, such as your name, email, contact details, and item listings. We may also collect basic usage data to improve our platform.
          </p>
        </section>

        <hr />

        {/* SECTION */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            2. How We Use Your Information
          </h2>
          <ul className="list-disc pl-5 text-gray-600 space-y-2">
            <li>To provide and improve our services.</li>
            <li>To connect buyers and sellers.</li>
            <li>To communicate updates, offers, or support messages.</li>
          </ul>
        </section>

        <hr />

        {/* SECTION */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            3. Sharing of Information
          </h2>
          <p className="text-gray-600 leading-relaxed">
            We do not sell your personal information. Your details may be shared only with other users as required for transactions or when required by law.
          </p>
        </section>

        <hr />

        {/* SECTION */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            4. Data Security
          </h2>
          <p className="text-gray-600 leading-relaxed">
            We take appropriate measures to protect your data from unauthorized access, misuse, or disclosure.
          </p>
        </section>

        <hr />

        {/* SECTION */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            5. Cookies
          </h2>
          <p className="text-gray-600 leading-relaxed">
            We may use cookies to enhance user experience, track usage patterns, and improve our services.
          </p>
        </section>

        <hr />

        {/* SECTION */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            6. Your Rights
          </h2>
          <ul className="list-disc pl-5 text-gray-600 space-y-2">
            <li>You can request access to your personal data.</li>
            <li>You can request correction or deletion of your data.</li>
            <li>You can opt out of communications at any time.</li>
          </ul>
        </section>

        <hr />

        {/* SECTION */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            7. Changes to This Policy
          </h2>
          <p className="text-gray-600 leading-relaxed">
            We may update this Privacy Policy from time to time. Continued use of UniKart means you accept the updated policy.
          </p>
        </section>

        <hr />

        {/* SECTION */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            8. Contact Us
          </h2>
          <p className="text-gray-600 leading-relaxed">
            If you have any questions regarding this Privacy Policy, please contact us through the Contact page.
          </p>
        </section>

      </div>

      {/* FOOTER NOTE */}
      <div className="text-center text-gray-500 mt-8 text-sm">
        Last updated: {new Date().getFullYear()}
      </div>
    </div>
  );
};

export default PrivacyPolicy;