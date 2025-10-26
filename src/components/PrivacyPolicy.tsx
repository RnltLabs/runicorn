/**
 * Copyright (c) 2025 Roman Reinelt / RNLT Labs
 *
 * This software is proprietary and confidential.
 * Unauthorized use, reproduction, or distribution is prohibited.
 * For licensing information, contact: hello@rnltlabs.de
 */

import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PrivacyPolicyProps {
  onBack: () => void
}

export function PrivacyPolicy({ onBack }: PrivacyPolicyProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-8 -ml-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to App
        </Button>

        {/* Privacy Policy Content */}
        <article className="prose prose-slate dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">
            <strong>Last Updated:</strong> October 27, 2025
          </p>

          {/* 1. Data Controller */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">1. Data Controller</h2>
            <p>
              The data controller responsible for data processing on this website is:
            </p>
            <div className="bg-muted/50 rounded-lg p-6 my-4">
              <p className="font-semibold mb-2">RNLT Labs</p>
              <p>Roman Reinelt</p>
              <p>Germany</p>
              <p className="mt-4">
                <strong>Email:</strong>{" "}
                <a href="mailto:hello@rnltlabs.de" className="text-primary hover:underline">
                  hello@rnltlabs.de
                </a>
              </p>
              <p>
                <strong>Website:</strong>{" "}
                <a href="https://rnltlabs.de" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  rnltlabs.de
                </a>
              </p>
            </div>
          </section>

          {/* 2. General Information on Data Processing */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">2. General Information on Data Processing</h2>
            <h3 className="text-xl font-semibold mt-6 mb-3">2.1 Scope of Personal Data Processing</h3>
            <p>
              We process personal data of our users only to the extent necessary to provide a functional website
              and our content and services.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">2.2 Legal Basis</h3>
            <p>
              The legal basis for processing personal data is:
            </p>
            <ul className="list-disc pl-6 space-y-2 my-4">
              <li>
                <strong>Art. 6(1)(a) GDPR:</strong> Consent (e.g., cookie consent for analytics)
              </li>
              <li>
                <strong>Art. 6(1)(f) GDPR:</strong> Legitimate interest (e.g., error logging to ensure functionality)
              </li>
            </ul>
          </section>

          {/* 3. GPS Data and Client-Side Processing */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">3. GPS Data and Client-Side Processing</h2>

            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 my-6">
              <p className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Important: Your GPS Data Stays on Your Device
              </p>
              <p className="text-blue-800 dark:text-blue-200">
                Runicorn processes all GPS coordinates exclusively <strong>client-side in your browser</strong>.
                Your drawn routes are <strong>NOT stored on our servers</strong>.
              </p>
            </div>

            <h3 className="text-xl font-semibold mt-6 mb-3">3.1 What GPS Data Is Processed?</h3>
            <p>
              When you draw a route on the map with Runicorn, we process the following data:
            </p>
            <ul className="list-disc pl-6 space-y-2 my-4">
              <li>GPS coordinates (latitude and longitude) of your drawn route</li>
              <li>Routing requests to convert your drawing into a navigable route</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">3.2 Where Is GPS Data Processed?</h3>
            <table className="w-full border-collapse my-4">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 bg-muted">Processing</th>
                  <th className="text-left p-3 bg-muted">Location</th>
                  <th className="text-left p-3 bg-muted">Storage</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-3">Drawing route</td>
                  <td className="p-3">Browser (client-side)</td>
                  <td className="p-3 text-green-600 dark:text-green-400">Not stored</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3">Route calculation (Routing API)</td>
                  <td className="p-3">GraphHopper API (external)</td>
                  <td className="p-3 text-orange-600 dark:text-orange-400">Temporary, then deleted</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3">GPX export</td>
                  <td className="p-3">Browser (download)</td>
                  <td className="p-3 text-green-600 dark:text-green-400">Only on your device</td>
                </tr>
              </tbody>
            </table>

            <h3 className="text-xl font-semibold mt-6 mb-3">3.3 Legal Basis</h3>
            <p>
              <strong>Art. 6(1)(f) GDPR</strong> – Legitimate interest. Processing GPS coordinates
              is necessary to provide the core functionality of the application (route drawing and GPX export).
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">3.4 External Routing API (GraphHopper)</h3>
            <p>
              To convert your drawn route into a navigable path, we use the <strong>GraphHopper Routing API</strong>.
              Your GPS coordinates are transmitted to GraphHopper servers for this purpose.
            </p>
            <ul className="list-disc pl-6 space-y-2 my-4">
              <li><strong>Recipient:</strong> GraphHopper GmbH, Germany</li>
              <li><strong>Purpose:</strong> Route calculation on public roads/paths</li>
              <li><strong>Retention period:</strong> Temporary (only for request processing)</li>
              <li><strong>Privacy Policy:</strong>{" "}
                <a href="https://www.graphhopper.com/privacy/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  graphhopper.com/privacy
                </a>
              </li>
            </ul>
          </section>

          {/* 4. Map Service (OpenStreetMap) */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">4. Map Service (OpenStreetMap)</h2>
            <p>
              We use the <strong>OpenStreetMap</strong> map service to display the interactive map.
            </p>
            <ul className="list-disc pl-6 space-y-2 my-4">
              <li><strong>Provider:</strong> OpenStreetMap Foundation, UK</li>
              <li><strong>Data transmission:</strong> Your IP address is transmitted to OpenStreetMap servers when loading map tiles</li>
              <li><strong>Purpose:</strong> Display of map view</li>
              <li><strong>Legal basis:</strong> Art. 6(1)(f) GDPR (legitimate interest)</li>
              <li><strong>Privacy Policy:</strong>{" "}
                <a href="https://wiki.osmfoundation.org/wiki/Privacy_Policy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  OpenStreetMap Privacy Policy
                </a>
              </li>
            </ul>
          </section>

          {/* 5. Web Analytics (Umami) */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">5. Web Analytics (Umami)</h2>
            <p>
              This website uses <strong>Umami Analytics</strong>, a privacy-friendly web analytics service.
              Umami is self-hosted on our servers in Germany.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">5.1 Scope of Data Processing</h3>
            <p>
              Umami collects the following <strong>anonymized</strong> data:
            </p>
            <ul className="list-disc pl-6 space-y-2 my-4">
              <li>Visited pages (URL without personal parameters)</li>
              <li>Referrer (where you came from)</li>
              <li>Browser and operating system (User-Agent)</li>
              <li>Screen resolution</li>
              <li>Country (derived from IP address, IP is <strong>not</strong> stored)</li>
            </ul>

            <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-6 my-6">
              <p className="font-semibold text-green-900 dark:text-green-100 mb-2">
                Privacy-First Analytics
              </p>
              <ul className="text-green-800 dark:text-green-200 space-y-1">
                <li>No cookies</li>
                <li>No IP addresses stored</li>
                <li>No cross-site tracking</li>
                <li>GDPR-compliant without consent</li>
                <li>Self-hosted in Germany</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold mt-6 mb-3">5.2 Legal Basis</h3>
            <p>
              <strong>Art. 6(1)(f) GDPR</strong> – Legitimate interest. Umami only collects anonymized data
              without personal reference, therefore no consent is required.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">5.3 Hosting</h3>
            <ul className="list-disc pl-6 space-y-2 my-4">
              <li><strong>Server location:</strong> Germany (Hetzner)</li>
              <li><strong>Umami URL:</strong> analytics.rnltlabs.de</li>
              <li><strong>Privacy:</strong>{" "}
                <a href="https://umami.is/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  umami.is/privacy
                </a>
              </li>
            </ul>
          </section>

          {/* 6. Error Logging (GlitchTip) */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">6. Error Logging (GlitchTip)</h2>
            <p>
              To improve stability and fix errors, we use <strong>GlitchTip</strong>,
              a self-hosted error tracking service.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">6.1 Scope of Data Processing</h3>
            <p>
              When technical errors occur, the following data is transmitted to GlitchTip:
            </p>
            <ul className="list-disc pl-6 space-y-2 my-4">
              <li>Error message and stack trace</li>
              <li>Browser and operating system</li>
              <li>Visited URL (without personal parameters)</li>
              <li>Anonymized IP address (last octet removed)</li>
            </ul>

            <p className="mt-4">
              <strong>Not collected:</strong>
            </p>
            <ul className="list-disc pl-6 space-y-2 my-4">
              <li>GPS coordinates of your drawn routes</li>
              <li>Complete IP addresses</li>
              <li>Cookies or tracking IDs</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">6.2 Legal Basis</h3>
            <p>
              <strong>Art. 6(1)(f) GDPR</strong> – Legitimate interest. Error logging serves to
              ensure technical functionality and improvement of the application.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">6.3 Hosting and Retention Period</h3>
            <ul className="list-disc pl-6 space-y-2 my-4">
              <li><strong>Server location:</strong> Germany (Hetzner)</li>
              <li><strong>GlitchTip URL:</strong> errors.rnltlabs.de</li>
              <li><strong>Retention period:</strong> 90 days, then automatic deletion</li>
              <li><strong>Privacy:</strong>{" "}
                <a href="https://glitchtip.com/documentation/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  GlitchTip Documentation
                </a>
              </li>
            </ul>
          </section>

          {/* 7. Hosting */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">7. Hosting</h2>
            <p>
              This website is hosted by:
            </p>
            <div className="bg-muted/50 rounded-lg p-6 my-4">
              <p className="font-semibold mb-2">Hetzner Online GmbH</p>
              <p>Industriestr. 25</p>
              <p>91710 Gunzenhausen</p>
              <p>Germany</p>
              <p className="mt-4">
                <strong>Privacy Policy:</strong>{" "}
                <a href="https://www.hetzner.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  hetzner.com/legal/privacy-policy
                </a>
              </p>
            </div>

            <h3 className="text-xl font-semibold mt-6 mb-3">7.1 Data Processing Agreement (Art. 28 GDPR)</h3>
            <p>
              We have concluded a <strong>Data Processing Agreement (DPA)</strong> with Hetzner, which ensures
              compliance with GDPR requirements.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">7.2 Processed Data</h3>
            <p>
              When visiting the website, the following technical data is automatically processed:
            </p>
            <ul className="list-disc pl-6 space-y-2 my-4">
              <li>IP address (anonymized after 24 hours)</li>
              <li>Date and time of request</li>
              <li>Time zone difference to Greenwich Mean Time (GMT)</li>
              <li>Content of request (specific page)</li>
              <li>Access status/HTTP status code</li>
              <li>Amount of data transferred</li>
              <li>Website from which the request originates</li>
              <li>Browser and operating system</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">7.3 Legal Basis and Purpose</h3>
            <p>
              <strong>Art. 6(1)(f) GDPR</strong> – Legitimate interest. Processing this data is
              necessary for operating the website and ensuring IT security.
            </p>
          </section>

          {/* 8. Cookies */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">8. Cookies</h2>

            <h3 className="text-xl font-semibold mt-6 mb-3">8.1 What Are Cookies?</h3>
            <p>
              Cookies are small text files that are stored on your device when you visit a website.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">8.2 What Cookies Do We Use?</h3>

            <div className="overflow-x-auto my-6">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b bg-muted">
                    <th className="text-left p-3">Cookie</th>
                    <th className="text-left p-3">Type</th>
                    <th className="text-left p-3">Purpose</th>
                    <th className="text-left p-3">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-3 font-mono text-sm">runicorn-cookie-consent</td>
                    <td className="p-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        Necessary
                      </span>
                    </td>
                    <td className="p-3">Stores your cookie consent</td>
                    <td className="p-3">1 year</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-mono text-sm">theme</td>
                    <td className="p-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        Necessary
                      </span>
                    </td>
                    <td className="p-3">Stores your dark/light mode preference</td>
                    <td className="p-3">1 year</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 my-6">
              <p className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Note: Umami Analytics Uses NO Cookies
              </p>
              <p className="text-blue-800 dark:text-blue-200">
                Our analytics tool does not set cookies and does not track you across websites.
              </p>
            </div>

            <h3 className="text-xl font-semibold mt-6 mb-3">8.3 Managing Cookies</h3>
            <p>
              You can change your cookie settings at any time in your browser:
            </p>
            <ul className="list-disc pl-6 space-y-2 my-4">
              <li>
                <strong>Chrome:</strong> Settings → Privacy and Security → Cookies
              </li>
              <li>
                <strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data
              </li>
              <li>
                <strong>Safari:</strong> Preferences → Privacy → Cookies and Website Data
              </li>
            </ul>
          </section>

          {/* 9. Your Rights as a Data Subject */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">9. Your Rights as a Data Subject</h2>
            <p>
              Under the GDPR, you have the following rights:
            </p>

            <div className="space-y-6 my-6">
              <div className="border-l-4 border-primary pl-4">
                <h3 className="font-semibold mb-2">Right of Access (Art. 15 GDPR)</h3>
                <p className="text-muted-foreground">
                  You can request information about your stored personal data.
                </p>
              </div>

              <div className="border-l-4 border-primary pl-4">
                <h3 className="font-semibold mb-2">Right to Rectification (Art. 16 GDPR)</h3>
                <p className="text-muted-foreground">
                  You can request the correction of inaccurate data.
                </p>
              </div>

              <div className="border-l-4 border-primary pl-4">
                <h3 className="font-semibold mb-2">Right to Erasure (Art. 17 GDPR)</h3>
                <p className="text-muted-foreground">
                  You can request the deletion of your data, unless legal retention obligations apply.
                </p>
              </div>

              <div className="border-l-4 border-primary pl-4">
                <h3 className="font-semibold mb-2">Right to Restriction of Processing (Art. 18 GDPR)</h3>
                <p className="text-muted-foreground">
                  You can request the restriction of processing of your data.
                </p>
              </div>

              <div className="border-l-4 border-primary pl-4">
                <h3 className="font-semibold mb-2">Right to Data Portability (Art. 20 GDPR)</h3>
                <p className="text-muted-foreground">
                  You can receive your data in a structured, commonly used, and machine-readable format.
                </p>
              </div>

              <div className="border-l-4 border-primary pl-4">
                <h3 className="font-semibold mb-2">Right to Object (Art. 21 GDPR)</h3>
                <p className="text-muted-foreground">
                  You can object to the processing of your data if it is based on legitimate interest.
                </p>
              </div>

              <div className="border-l-4 border-primary pl-4">
                <h3 className="font-semibold mb-2">Right to Withdraw Consent (Art. 7(3) GDPR)</h3>
                <p className="text-muted-foreground">
                  You can withdraw any consent given at any time with effect for the future.
                </p>
              </div>
            </div>

            <h3 className="text-xl font-semibold mt-6 mb-3">9.1 Contact for Privacy Requests</h3>
            <p>
              To exercise your rights, please contact:
            </p>
            <div className="bg-muted/50 rounded-lg p-6 my-4">
              <p>
                <strong>Email:</strong>{" "}
                <a href="mailto:hello@rnltlabs.de" className="text-primary hover:underline">
                  hello@rnltlabs.de
                </a>
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                We will respond to your request within 30 days.
              </p>
            </div>

            <h3 className="text-xl font-semibold mt-6 mb-3">9.2 Right to Lodge a Complaint with a Supervisory Authority</h3>
            <p>
              You have the right to lodge a complaint with a data protection supervisory authority:
            </p>
            <div className="bg-muted/50 rounded-lg p-6 my-4">
              <p className="font-semibold mb-2">
                State Commissioner for Data Protection and Freedom of Information Baden-Württemberg
              </p>
              <p>Lautenschlagerstraße 20</p>
              <p>70173 Stuttgart</p>
              <p>Germany</p>
              <p className="mt-4">
                <strong>Phone:</strong> +49 711 615541-0
              </p>
              <p>
                <strong>Email:</strong>{" "}
                <a href="mailto:poststelle@lfdi.bwl.de" className="text-primary hover:underline">
                  poststelle@lfdi.bwl.de
                </a>
              </p>
              <p>
                <strong>Website:</strong>{" "}
                <a href="https://www.baden-wuerttemberg.datenschutz.de/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  baden-wuerttemberg.datenschutz.de
                </a>
              </p>
            </div>
          </section>

          {/* 10. Data Security */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">10. Data Security</h2>
            <p>
              We employ technical and organizational security measures to protect your data against accidental
              or intentional manipulation, loss, destruction, or access by unauthorized persons.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">10.1 Technical Measures</h3>
            <ul className="list-disc pl-6 space-y-2 my-4">
              <li>
                <strong>HTTPS Encryption:</strong> All data transmissions are encrypted via TLS 1.2+
              </li>
              <li>
                <strong>Content Security Policy (CSP):</strong> Protection against Cross-Site Scripting (XSS) attacks
              </li>
              <li>
                <strong>IP Anonymization:</strong> IP addresses are stored anonymized
              </li>
              <li>
                <strong>No Data Storage:</strong> GPS data is not stored on servers
              </li>
              <li>
                <strong>Server Location:</strong> Germany (Hetzner) – subject to GDPR
              </li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">10.2 Organizational Measures</h3>
            <ul className="list-disc pl-6 space-y-2 my-4">
              <li>Regular security updates</li>
              <li>Access controls and authorization concepts</li>
              <li>Regular privacy training</li>
              <li>Data protection impact assessments for changes</li>
            </ul>
          </section>

          {/* 11. Data Sharing with Third Parties */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">11. Data Sharing with Third Parties</h2>
            <p>
              We only share your personal data with third parties in the following cases:
            </p>

            <div className="overflow-x-auto my-6">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b bg-muted">
                    <th className="text-left p-3">Recipient</th>
                    <th className="text-left p-3">Purpose</th>
                    <th className="text-left p-3">Location</th>
                    <th className="text-left p-3">DPA</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-3 font-semibold">Hetzner Online GmbH</td>
                    <td className="p-3">Hosting, server operations</td>
                    <td className="p-3">Germany</td>
                    <td className="p-3">Yes</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-semibold">GraphHopper GmbH</td>
                    <td className="p-3">Routing API (GPS coordinates)</td>
                    <td className="p-3">Germany</td>
                    <td className="p-3">No</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-semibold">OpenStreetMap</td>
                    <td className="p-3">Map tiles</td>
                    <td className="p-3">UK</td>
                    <td className="p-3">No</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-sm text-muted-foreground mt-4">
              <strong>DPA:</strong> Data Processing Agreement according to Art. 28 GDPR
            </p>
          </section>

          {/* 12. Data Retention */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">12. Data Retention</h2>
            <p>
              We only store personal data for as long as necessary for the respective purpose:
            </p>

            <div className="overflow-x-auto my-6">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b bg-muted">
                    <th className="text-left p-3">Data Type</th>
                    <th className="text-left p-3">Retention Period</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-3">GPS coordinates (drawn routes)</td>
                    <td className="p-3 text-green-600 dark:text-green-400 font-semibold">
                      Not stored (client-side only)
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">Web analytics (Umami)</td>
                    <td className="p-3">Anonymized, unlimited</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">Error logs (GlitchTip)</td>
                    <td className="p-3">90 days, then automatic deletion</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">Server logs (IP addresses)</td>
                    <td className="p-3">24 hours, then anonymized</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3">Cookie consent</td>
                    <td className="p-3">1 year (localStorage)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 13. Changes to This Privacy Policy */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">13. Changes to This Privacy Policy</h2>
            <p>
              We reserve the right to update this privacy policy to adapt it to changed legal situations or
              changes in our data processing.
            </p>
            <p className="mt-4">
              The current version of this privacy policy can always be found at:
            </p>
            <p className="mt-2">
              <a href="https://runicorn.io/#/datenschutz" className="text-primary hover:underline font-medium">
                runicorn.io/#/datenschutz
              </a>
            </p>
          </section>

          {/* Footer */}
          <section className="mt-16 pt-8 border-t">
            <p className="text-sm text-muted-foreground">
              <strong>Last updated:</strong> October 27, 2025
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              If you have questions about this privacy policy, please contact:{" "}
              <a href="mailto:hello@rnltlabs.de" className="text-primary hover:underline">
                hello@rnltlabs.de
              </a>
            </p>
          </section>
        </article>
      </div>
    </div>
  )
}
