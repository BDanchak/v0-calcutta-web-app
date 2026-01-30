"use client"

import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Shield, AlertTriangle, Users, DollarSign } from "lucide-react"
import Link from "next/link"

export default function TermsPage() {
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
            <h1 className="text-3xl font-bold text-foreground">Terms of Service</h1>
            <p className="text-muted-foreground mt-2">Last updated: January 1, 2024</p>
          </div>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
                Important Notice
              </CardTitle>
              <CardDescription>Please read these terms carefully before using Calcutta Fantasy</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                By accessing and using Calcutta Fantasy, you accept and agree to be bound by the terms and provision of
                this agreement. These Terms of Service govern your use of our platform and services.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>1. Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                By creating an account or using our services, you agree to comply with and be bound by these Terms of
                Service and our Privacy Policy. If you do not agree to these terms, please do not use our platform.
              </p>
              <p className="text-muted-foreground">
                We reserve the right to modify these terms at any time. Changes will be effective immediately upon
                posting to our website. Your continued use of the service constitutes acceptance of any changes.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-blue-500" />
                2. User Accounts and Eligibility
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Age Requirements</h4>
                <p className="text-muted-foreground">
                  You must be at least 18 years old to use Calcutta Fantasy. By using our service, you represent and
                  warrant that you meet this age requirement.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Account Responsibility</h4>
                <p className="text-muted-foreground">
                  You are responsible for maintaining the confidentiality of your account credentials and for all
                  activities that occur under your account. You agree to notify us immediately of any unauthorized use
                  of your account.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Accurate Information</h4>
                <p className="text-muted-foreground">
                  You agree to provide accurate, current, and complete information during registration and to update
                  such information as necessary to maintain its accuracy.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-green-500" />
                3. Financial Terms and Payments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Entry Fees and Payments</h4>
                <p className="text-muted-foreground">
                  Participation in leagues may require entry fees. All payments are processed securely through our
                  third-party payment processors. Entry fees are non-refundable once a league auction has begun.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Prize Distribution</h4>
                <p className="text-muted-foreground">
                  Prizes are distributed according to the rules established for each league. We reserve the right to
                  withhold prizes in cases of suspected fraud, cheating, or violation of these terms.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Tax Responsibility</h4>
                <p className="text-muted-foreground">
                  You are responsible for any taxes owed on winnings. We may be required to report winnings to tax
                  authorities and may request tax identification information from winners.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Platform Rules and Conduct</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Fair Play</h4>
                <p className="text-muted-foreground">
                  All users must participate fairly and honestly. Collusion, fraud, or any attempt to manipulate
                  auctions or results is strictly prohibited and may result in account termination and forfeiture of
                  winnings.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Prohibited Activities</h4>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Creating multiple accounts to gain unfair advantage</li>
                  <li>Using automated bidding systems or bots</li>
                  <li>Sharing account credentials with others</li>
                  <li>Attempting to manipulate or interfere with platform operations</li>
                  <li>Harassment or inappropriate behavior toward other users</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                All content, features, and functionality of Calcutta Fantasy, including but not limited to text,
                graphics, logos, and software, are owned by us or our licensors and are protected by copyright,
                trademark, and other intellectual property laws.
              </p>
              <p className="text-muted-foreground">
                You may not reproduce, distribute, modify, or create derivative works of our content without express
                written permission.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Calcutta Fantasy is provided "as is" without warranties of any kind. We do not guarantee uninterrupted
                or error-free service. In no event shall we be liable for any indirect, incidental, special, or
                consequential damages.
              </p>
              <p className="text-muted-foreground">
                Our total liability to you for any claims arising from your use of the service shall not exceed the
                amount you paid to us in the twelve months preceding the claim.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Termination</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We reserve the right to terminate or suspend your account at any time for violation of these terms or
                for any other reason at our sole discretion. You may also terminate your account at any time by
                contacting us.
              </p>
              <p className="text-muted-foreground">
                Upon termination, your right to use the service will cease immediately, but these terms will remain in
                effect as to any prior use of the service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="space-y-2 text-muted-foreground">
                <p>Email: legal@calcuttafantasy.com</p>
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
