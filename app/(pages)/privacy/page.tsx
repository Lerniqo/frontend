import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="container mx-auto py-12 px-4 max-w-4xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/10">
          <h1 className="text-4xl font-bold mb-6 text-white">Privacy Policy</h1>

          <div className="space-y-6 text-gray-300">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                1. Introduction
              </h2>
              <p>
                Welcome to Learniqo. We respect your privacy and are committed
                to protecting your personal data. This privacy policy will
                inform you about how we look after your personal data when you
                visit our website and tell you about your privacy rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                2. Data We Collect
              </h2>
              <p>
                We may collect, use, store and transfer different kinds of
                personal data about you:
              </p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>
                  <strong>Identity Data:</strong> First name, last name,
                  username
                </li>
                <li>
                  <strong>Contact Data:</strong> Email address, telephone number
                </li>
                <li>
                  <strong>Technical Data:</strong> IP address, browser type,
                  device information
                </li>
                <li>
                  <strong>Usage Data:</strong> Information about how you use our
                  website and services
                </li>
                <li>
                  <strong>Profile Data:</strong> Your interests, preferences,
                  learning progress
                </li>
                <li>
                  <strong>Payment Data:</strong> Payment card details (processed
                  by third-party payment processors)
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                3. How We Use Your Data
              </h2>
              <p>We use your data to:</p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Provide and maintain our educational services</li>
                <li>Manage your account and provide customer support</li>
                <li>Process your payments and prevent fraud</li>
                <li>Personalize your learning experience</li>
                <li>Send you updates about your courses and progress</li>
                <li>Improve our services and develop new features</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                4. Data Security
              </h2>
              <p>
                We have implemented appropriate security measures to prevent
                your personal data from being accidentally lost, used, or
                accessed in an unauthorized way. We limit access to your
                personal data to those employees, agents, contractors, and other
                third parties who have a business need to know.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                5. Data Sharing
              </h2>
              <p>We may share your personal data with:</p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Service providers who help us operate our platform</li>
                <li>Payment processors for transaction processing</li>
                <li>Analytics providers to help us improve our services</li>
                <li>
                  Law enforcement or regulatory authorities when required by law
                </li>
              </ul>
              <p className="mt-2">
                We do not sell your personal data to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                6. Your Rights
              </h2>
              <p>Under data protection laws, you have the right to:</p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to processing of your data</li>
                <li>Request transfer of your data</li>
                <li>Withdraw consent at any time</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                7. Cookies
              </h2>
              <p>
                We use cookies and similar tracking technologies to track
                activity on our service and store certain information. Cookies
                are files with a small amount of data which may include an
                anonymous unique identifier. You can instruct your browser to
                refuse all cookies or to indicate when a cookie is being sent.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                8. Children&apos;s Privacy
              </h2>
              <p>
                Our service is intended for users who are at least 13 years old.
                If you are a parent or guardian and you are aware that your
                child has provided us with personal data without your consent,
                please contact us.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                9. Data Retention
              </h2>
              <p>
                We will only retain your personal data for as long as necessary
                to fulfill the purposes we collected it for, including for the
                purposes of satisfying any legal, accounting, or reporting
                requirements.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                10. Changes to This Policy
              </h2>
              <p>
                We may update our Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page and updating the &quot;Last updated&quot; date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                11. Contact Us
              </h2>
              <p>
                If you have any questions about this Privacy Policy, please
                contact us:
              </p>
              <ul className="list-none ml-4 mt-2 space-y-1">
                <li>
                  Email:{" "}
                  <a
                    href="mailto:privacy@learniqo.com"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    privacy@learniqo.com
                  </a>
                </li>
                <li>
                  Email:{" "}
                  <a
                    href="mailto:support@learniqo.com"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    support@learniqo.com
                  </a>
                </li>
              </ul>
            </section>

            <div className="pt-6 mt-6 border-t border-white/10">
              <p className="text-sm text-gray-400">
                Last updated: October 15, 2025
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
