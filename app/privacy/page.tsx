"use client";

import React from "react";

export default function PrivacyPolicy() {
  return (
    <main className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="mb-4 text-gray-600">Last updated: December 2024</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
        <p className="mb-4">
          This Privacy Policy describes how we collect, use, and protect your
          personal information when you use our AI interior design service. We
          are committed to protecting your privacy and ensuring the security of
          your data.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          2. Information We Collect
        </h2>
        <p className="mb-4">We collect the following types of information:</p>

        <h3 className="text-lg font-semibold mb-2 mt-6">
          2.1 Account Information
        </h3>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Email address (for magic link authentication)</li>
          <li>Google account information (when using OAuth)</li>
          <li>Account preferences and settings</li>
          <li>Subscription and billing information</li>
        </ul>

        <h3 className="text-lg font-semibold mb-2 mt-6">2.2 Usage Data</h3>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Images you upload for interior design generation</li>
          <li>AI-generated design images</li>
          <li>Usage patterns and preferences</li>
          <li>API request logs and performance data</li>
        </ul>

        <h3 className="text-lg font-semibold mb-2 mt-6">2.3 Technical Data</h3>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>IP addresses and location data</li>
          <li>Browser type and version</li>
          <li>Device information and operating system</li>
          <li>Cookies and similar tracking technologies</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          3. How We Use Your Information
        </h2>
        <p className="mb-4">
          We use your information for the following purposes:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Providing and maintaining our AI interior design service</li>
          <li>Processing your design generation requests</li>
          <li>Managing your account and subscription</li>
          <li>Processing payments through Stripe</li>
          <li>Sending important service notifications via Mailgun</li>
          <li>Improving our AI models and service quality</li>
          <li>Preventing fraud and abuse</li>
          <li>Complying with legal obligations</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          4. Data Storage and Processing
        </h2>
        <p className="mb-4">
          Your data is stored and processed using the following services:
        </p>

        <h3 className="text-lg font-semibold mb-2 mt-6">
          4.1 Database Storage (MongoDB)
        </h3>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>User account information</li>
          <li>Subscription and billing data</li>
          <li>Generated design metadata</li>
          <li>Service usage history</li>
        </ul>

        <h3 className="text-lg font-semibold mb-2 mt-6">
          4.2 Image Storage (Cloudflare R2)
        </h3>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Uploaded room images</li>
          <li>AI-generated design images</li>
          <li>Upscaled and processed images</li>
        </ul>

        <h3 className="text-lg font-semibold mb-2 mt-6">
          4.3 Caching and Rate Limiting (Redis)
        </h3>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Rate limiting data for API protection</li>
          <li>Temporary prediction status tracking</li>
          <li>Session management data</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          5. AI Processing and Third-Party Services
        </h2>
        <p className="mb-4">
          We use the following third-party services for AI processing:
        </p>

        <h3 className="text-lg font-semibold mb-2 mt-6">
          5.1 Replicate AI Models
        </h3>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Interior design generation AI models</li>
          <li>Image upscaling AI models</li>
          <li>Webhook processing for AI completion events</li>
        </ul>

        <h3 className="text-lg font-semibold mb-2 mt-6">
          5.2 Payment Processing (Stripe)
        </h3>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Subscription management</li>
          <li>Payment processing</li>
          <li>Billing and invoicing</li>
        </ul>

        <h3 className="text-lg font-semibold mb-2 mt-6">
          5.3 Email Services (Mailgun)
        </h3>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Magic link authentication emails</li>
          <li>Service notifications</li>
          <li>Account-related communications</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">6. Data Security</h2>
        <p className="mb-4">We implement the following security measures:</p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Encryption of data in transit and at rest</li>
          <li>Secure authentication using NextAuth.js</li>
          <li>Rate limiting to prevent abuse</li>
          <li>Regular security audits and updates</li>
          <li>Access controls and authentication</li>
          <li>Secure API endpoints with proper validation</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">7. Data Retention</h2>
        <p className="mb-4">We retain your data for the following periods:</p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Account data: Until account deletion or termination</li>
          <li>Generated images: Based on your subscription tier</li>
          <li>Payment records: As required by law (typically 7 years)</li>
          <li>Logs and analytics: Up to 12 months</li>
          <li>Redis cache data: Up to 24 hours for temporary processing</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          8. Your Rights and Choices
        </h2>
        <p className="mb-4">
          You have the following rights regarding your data:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Access your personal data</li>
          <li>Correct inaccurate information</li>
          <li>Request deletion of your account and data</li>
          <li>Export your data in a portable format</li>
          <li>Opt-out of marketing communications</li>
          <li>Control cookie preferences</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">9. Cookies and Tracking</h2>
        <p className="mb-4">We use cookies and similar technologies to:</p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Maintain your session and authentication</li>
          <li>Remember your preferences</li>
          <li>Analyze service usage and performance</li>
          <li>Improve user experience</li>
        </ul>
        <p className="mb-4">
          You can control cookie settings through your browser preferences.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          10. Children&apos;s Privacy
        </h2>
        <p className="mb-4">
          Our Service is not intended for children under 13 years of age. We do
          not knowingly collect personal information from children under 13. If
          you believe we have collected such information, please contact us
          immediately.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          11. International Data Transfers
        </h2>
        <p className="mb-4">
          Your data may be processed and stored in countries other than your
          own. We ensure that such transfers comply with applicable data
          protection laws and implement appropriate safeguards.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          12. Changes to This Policy
        </h2>
        <p className="mb-4">
          We may update this Privacy Policy from time to time. We will notify
          you of any material changes via email or through our Service. Your
          continued use of the Service after such changes constitutes acceptance
          of the updated policy.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">13. Contact Us</h2>
        <p className="mb-4">
          If you have any questions about this Privacy Policy or our data
          practices, please contact us at privacy@makeit.com or through our
          support channels.
        </p>
      </section>
    </main>
  );
}
