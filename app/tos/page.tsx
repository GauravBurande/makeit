"use client";

import React from "react";

export default function TermsOfService() {
  return (
    <main className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <p className="mb-4 text-gray-600">Last updated: December 2024</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
        <p className="mb-4">
          By accessing and using our AI interior design service
          (&quot;Service&quot;), you accept and agree to be bound by the terms
          and provisions of this agreement. If you do not agree to abide by the
          above, please do not use this service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          2. Description of Service
        </h2>
        <p className="mb-4">
          Our Service provides AI-powered interior design generation. Users can
          upload room images and receive AI-generated interior design
          suggestions. The Service includes:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>AI-powered interior design generation</li>
          <li>Image upscaling capabilities</li>
          <li>Cloud storage for generated and uploaded images</li>
          <li>User account management and billing</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          3. User Accounts and Registration
        </h2>
        <p className="mb-4">
          To use our Service, you must create an account. You can register using
          Google OAuth or email magic links. You are responsible for:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Maintaining the confidentiality of your account credentials</li>
          <li>All activities that occur under your account</li>
          <li>Notifying us immediately of any unauthorized use</li>
          <li>Ensuring your account information is accurate and up-to-date</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">4. Acceptable Use Policy</h2>
        <p className="mb-4">You agree not to use the Service to:</p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>
            Upload images that violate copyright or intellectual property rights
          </li>
          <li>Generate content that is illegal, harmful, or offensive</li>
          <li>Attempt to reverse engineer or hack our systems</li>
          <li>
            Use the Service for commercial purposes without proper authorization
          </li>
          <li>Exceed rate limits or abuse our API endpoints</li>
          <li>Share your account credentials with others</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          5. Payment and Subscription Terms
        </h2>
        <p className="mb-4">
          Our Service operates on a subscription-based model with different
          tiers offering varying usage limits:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Payments are processed through Stripe</li>
          <li>Subscription fees are charged in advance on a recurring basis</li>
          <li>Usage limits are enforced based on your subscription tier</li>
          <li>Refunds are handled according to our refund policy</li>
          <li>You may cancel your subscription at any time</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">6. AI-Generated Content</h2>
        <p className="mb-4">
          Our Service uses AI models to generate interior design suggestions.
          You acknowledge that:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>AI-generated content may not always be accurate or suitable</li>
          <li>
            We do not guarantee the quality or appropriateness of generated
            designs
          </li>
          <li>
            You are responsible for reviewing and validating generated content
          </li>
          <li>AI models may occasionally fail or produce unexpected results</li>
          <li>We reserve the right to modify or improve our AI models</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">7. Intellectual Property</h2>
        <p className="mb-4">Regarding intellectual property rights:</p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>You retain ownership of images you upload to our Service</li>
          <li>
            AI-generated designs are provided for your use but may be subject to
            licensing terms
          </li>
          <li>
            Our Service, including its design and functionality, is protected by
            intellectual property laws
          </li>
          <li>
            You may not copy, modify, or distribute our Service without
            permission
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          8. Service Availability and Limitations
        </h2>
        <p className="mb-4">
          We strive to provide reliable service but cannot guarantee:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Uninterrupted or error-free operation</li>
          <li>Immediate processing of all requests</li>
          <li>Availability of all features at all times</li>
          <li>Compatibility with all devices or browsers</li>
        </ul>
        <p className="mb-4">
          We may temporarily suspend the Service for maintenance or updates.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          9. Data Storage and Processing
        </h2>
        <p className="mb-4">Your data is processed and stored as follows:</p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>User data is stored in MongoDB databases</li>
          <li>Images are stored in Cloudflare R2 storage</li>
          <li>Rate limiting data is stored in Redis</li>
          <li>We implement security measures to protect your data</li>
          <li>Data processing is subject to our Privacy Policy</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">10. Termination</h2>
        <p className="mb-4">
          We may terminate or suspend your account and access to the Service at
          any time, with or without cause, with or without notice. Upon
          termination:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Your right to use the Service will cease immediately</li>
          <li>We may delete your account and associated data</li>
          <li>Any outstanding payments remain due</li>
          <li>
            Provisions that should survive termination will remain in effect
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          11. Limitation of Liability
        </h2>
        <p className="mb-4">
          To the maximum extent permitted by law, we shall not be liable for any
          indirect, incidental, special, consequential, or punitive damages,
          including but not limited to loss of profits, data, or use, incurred
          by you or any third party.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">12. Changes to Terms</h2>
        <p className="mb-4">
          We reserve the right to modify these Terms at any time. We will notify
          users of any material changes via email or through our Service. Your
          continued use of the Service after such modifications constitutes
          acceptance of the updated Terms.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">13. Governing Law</h2>
        <p className="mb-4">
          These Terms shall be governed by and construed in accordance with the
          laws of the jurisdiction in which our company is registered, without
          regard to its conflict of law provisions.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">14. Contact Information</h2>
        <p className="mb-4">
          If you have any questions about these Terms of Service, please contact
          us through our support channels or email us at support@makeit.com.
        </p>
      </section>
    </main>
  );
}
