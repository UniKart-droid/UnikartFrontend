import React from "react";

const TermsOfUse = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-6 md:px-16">
      
      {/* HEADER */}
      <div className="max-w-5xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Terms of Use
        </h1>
        <p className="text-gray-600 text-lg">
          Please read these terms carefully before using UniKart. By accessing our platform, you agree to follow these rules.
        </p>
      </div>

      {/* MAIN CARD */}
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-8 md:p-12 space-y-8">

        {/* SECTION */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            1. Acceptance of Terms
          </h2>
          <p className="text-gray-600 leading-relaxed">
            By using UniKart, you agree to comply with these Terms of Use. If you do not agree with any part of these terms, you should not use our platform.
          </p>
        </section>

        <hr />

        {/* SECTION */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            2. Use of the Platform
          </h2>
          <p className="text-gray-600 leading-relaxed">
            UniKart is a student-focused marketplace where users can buy and sell items such as books, electronics, and study materials. You agree to use the platform only for lawful purposes.
          </p>
        </section>

        <hr />

        {/* SECTION */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            3. User Responsibilities
          </h2>
          <ul className="list-disc pl-5 text-gray-600 space-y-2">
            <li>Provide accurate and complete information.</li>
            <li>Ensure that listed items are genuine and owned by you.</li>
            <li>Maintain respectful communication with other users.</li>
          </ul>
        </section>

        <hr />

        {/* SECTION */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            4. Prohibited Activities
          </h2>
          <ul className="list-disc pl-5 text-gray-600 space-y-2">
            <li>Posting false or misleading listings.</li>
            <li>Engaging in fraudulent or illegal activities.</li>
            <li>Uploading harmful or inappropriate content.</li>
          </ul>
        </section>

        <hr />

        {/* SECTION */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            5. Transactions
          </h2>
          <p className="text-gray-600 leading-relaxed">
            UniKart acts only as a platform connecting buyers and sellers. We are not responsible for the quality, safety, or legality of items or transactions.
          </p>
        </section>

        <hr />

        {/* SECTION */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            6. Account Security
          </h2>
          <p className="text-gray-600 leading-relaxed">
            You are responsible for maintaining the confidentiality of your account credentials. Any activity under your account will be considered your responsibility.
          </p>
        </section>

        <hr />

        {/* SECTION */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            7. Termination
          </h2>
          <p className="text-gray-600 leading-relaxed">
            We reserve the right to suspend or terminate your access if you violate these terms or misuse the platform.
          </p>
        </section>

        <hr />

        {/* SECTION */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            8. Changes to Terms
          </h2>
          <p className="text-gray-600 leading-relaxed">
            UniKart may update these terms at any time. Continued use of the platform indicates your acceptance of the updated terms.
          </p>
        </section>

        <hr />

        {/* SECTION */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            9. Contact Us
          </h2>
          <p className="text-gray-600 leading-relaxed">
            If you have any questions regarding these Terms of Use, please contact us through the Contact page.
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

export default TermsOfUse;