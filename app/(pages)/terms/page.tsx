import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsOfService() {
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
          <h1 className="text-4xl font-bold mb-6 text-white">
            Terms of Service
          </h1>

          <div className="space-y-6 text-gray-300">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing and using Learniqo, you accept and agree to be
                bound by the terms and provision of this agreement. If you do
                not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                2. Use License
              </h2>
              <p>
                Permission is granted to temporarily access the materials
                (information or software) on Learniqo for personal,
                non-commercial transitory viewing only. This is the grant of a
                license, not a transfer of title, and under this license you may
                not:
              </p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose</li>
                <li>Attempt to decompile or reverse engineer any software</li>
                <li>Remove any copyright or other proprietary notations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                3. User Accounts
              </h2>
              <p>
                When you create an account with us, you must provide information
                that is accurate, complete, and current at all times. Failure to
                do so constitutes a breach of the Terms, which may result in
                immediate termination of your account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                4. Educational Content
              </h2>
              <p>
                All educational content provided on Learniqo is for
                informational purposes only. We strive to provide accurate and
                up-to-date content, but we make no representations or warranties
                regarding the completeness, accuracy, or reliability of any
                content.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                5. Payment Terms
              </h2>
              <p>
                For paid services, you agree to pay all fees and charges at the
                prices in effect for the services you or other persons using
                your account receive. We reserve the right to change our fees at
                any time, upon notice to you if such change may affect your
                existing subscriptions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                6. Disclaimer
              </h2>
              <p>
                The materials on Learniqo are provided on an &apos;as is&apos;
                basis. Learniqo makes no warranties, expressed or implied, and
                hereby disclaims and negates all other warranties including,
                without limitation, implied warranties or conditions of
                merchantability, fitness for a particular purpose, or
                non-infringement of intellectual property.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                7. Limitations
              </h2>
              <p>
                In no event shall Learniqo or its suppliers be liable for any
                damages (including, without limitation, damages for loss of data
                or profit, or due to business interruption) arising out of the
                use or inability to use the materials on Learniqo.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                8. Changes to Terms
              </h2>
              <p>
                Learniqo reserves the right to revise these terms of service at
                any time without notice. By using this website you are agreeing
                to be bound by the then current version of these terms of
                service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                9. Contact Information
              </h2>
              <p>
                If you have any questions about these Terms of Service, please
                contact us at:
              </p>
              <p className="mt-2">
                Email:{" "}
                <a
                  href="mailto:support@learniqo.com"
                  className="text-blue-400 hover:text-blue-300"
                >
                  support@learniqo.com
                </a>
              </p>
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
