"use client"

import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Shield, Eye, Lock, Database, Users } from "lucide-react"
import Link from "next/link"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          <div className="text-center">
            <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-foreground">Privacy Policy</h1>
            <p className="text-muted-foreground mt-2">Last updated: January 1, 2024</p>
          </div>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="h-5 w-5 mr-2 text-blue-500" />
                Our Commitment to Privacy
              </CardTitle>
              <CardDescription>
                Your privacy is important to us. This policy explains how we collect, use, and protect your information.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                At Calcutta Fantasy, we are committed to protecting your privacy and ensuring the security of your
                personal information. This Privacy Policy describes how we collect, use, disclose, and safeguard your
                information when you use our platform.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2 text-green-500" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Personal Information</h4>
                <p className="text-muted-foreground mb-2">
                  We collect information you provide directly to us, including:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Name, email address, and contact information</li>
                  <li>Payment information (processed securely by third-party providers)</li>
                  <li>Profile information and preferences</li>
                  <li>Communications with us and other users</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Usage Information</h4>
                <p className="text-muted-foreground mb-2">
                  We automatically collect certain information about your use of our platform:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Device information and browser type</li>
                  <li>IP address and location data</li>
                  <li>Usage patterns and preferences</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground mb-4">We use the information we collect to:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and manage your account</li>
                <li>Communicate with you about your account and our services</li>
                <li>Personalize your experience and provide relevant content</li>
                <li>Detect, prevent, and address fraud and security issues</li>
                <li>Comply with legal obligations and enforce our terms</li>
                <li>Send you marketing communications (with your consent)</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-purple-500" />
                Information Sharing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share your information
                in the following circumstances:
              </p>
              <div>
                <h4 className="font-semibold mb-2">Service Providers</h4>
                <p className="text-muted-foreground">
                  We work with trusted third-party service providers who help us operate our platform, including payment
                  processors, hosting providers, and analytics services.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Legal Requirements</h4>
                <p className="text-muted-foreground">
                  We may disclose your information if required by law, court order, or government regulation, or to
                  protect our rights and the safety of our users.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Business Transfers</h4>
                <p className="text-muted-foreground">
                  In the event of a merger, acquisition, or sale of assets, your information may be transferred as part
                  of the transaction.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="h-5 w-5 mr-2 text-red-500" />
                Data Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We implement appropriate technical and organizational security measures to protect your personal
                information against unauthorized access, alteration, disclosure, or destruction.
              </p>
              <div>
                <h4 className="font-semibold mb-2">Security Measures Include:</h4>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security assessments and updates</li>
                  <li>Access controls and authentication requirements</li>
                  <li>Secure payment processing through certified providers</li>
                  <li>Regular monitoring for suspicious activity</li>
                </ul>
              </div>
              <p className="text-muted-foreground">
                However, no method of transmission over the internet or electronic storage is 100% secure. While we
                strive to protect your information, we cannot guarantee absolute security.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Rights and Choices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground mb-4">
                You have the following rights regarding your personal information:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Access and review your personal information</li>
                <li>Correct inaccurate or incomplete information</li>
                <li>Delete your account and associated data</li>
                <li>Opt out of marketing communications</li>
                <li>Request a copy of your data in a portable format</li>
                <li>Object to certain processing activities</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                To exercise these rights, please contact us using the information provided below. We will respond to
                your request within a reasonable timeframe.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cookies and Tracking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We use cookies and similar tracking technologies to enhance your experience on our platform. Cookies are
                small data files stored on your device that help us remember your preferences and improve our services.
              </p>
              <div>
                <h4 className="font-semibold mb-2">Types of Cookies We Use:</h4>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Essential cookies for platform functionality</li>
                  <li>Performance cookies to analyze usage patterns</li>
                  <li>Preference cookies to remember your settings</li>
                  <li>Marketing cookies for targeted advertising (with consent)</li>
                </ul>
              </div>
              <p className="text-muted-foreground">
                You can control cookie settings through your browser preferences, but disabling certain cookies may
                affect platform functionality.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Children's Privacy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Our services are not intended for children under 18 years of age. We do not knowingly collect personal
                information from children under 18. If we become aware that we have collected personal information from
                a child under 18, we will take steps to delete such information promptly.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Changes to This Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We may update this Privacy Policy from time to time to reflect changes in our practices or applicable
                laws. We will notify you of any material changes by posting the updated policy on our website and
                updating the "Last updated" date. Your continued use of our services after such changes constitutes
                acceptance of the updated policy.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                If you have any questions about this Privacy Policy or our privacy practices, please contact us:
              </p>
              <div className="space-y-2 text-muted-foreground">
                <p>Email: privacy@calcuttafantasy.com</p>
                <p>Phone: 1-800-FANTASY</p>
                <p>Address: 123 Fantasy Lane, Sports City, SC 12345</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
