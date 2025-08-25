import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Download, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'

const TermsOfServicePage = () => {
  const lastUpdated = '2025-01-22'
  const effectiveDate = '2025-02-01'

  const sections = [
    {
      id: 'acceptance',
      title: '1. Acceptance of Terms',
      content: `By accessing or using Cabana ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of the Terms, then you may not access the Service. These Terms apply to all visitors, users, creators, and others who access or use the Service.`
    },
    {
      id: 'description',
      title: '2. Description of Service',
      content: `Cabana is a premium content platform that connects content creators with their fans through subscriptions, tips, messages, and other interactive features. The Service allows creators to monetize their content and build direct relationships with their audience.`
    },
    {
      id: 'accounts',
      title: '3. User Accounts',
      content: `
        <h4>3.1 Account Registration</h4>
        <p>You must register for an account to access certain features. You must provide accurate and complete information and keep it updated.</p>
        
        <h4>3.2 Account Security</h4>
        <p>You are responsible for safeguarding your password and all activities under your account. Notify us immediately of any unauthorized use.</p>
        
        <h4>3.3 Age Requirements</h4>
        <p>You must be at least 18 years old to create an account. By creating an account, you represent that you are 18 or older.</p>
      `
    },
    {
      id: 'content',
      title: '4. Content and Conduct',
      content: `
        <h4>4.1 Content Ownership</h4>
        <p>You retain ownership of content you post. By posting content, you grant Cabana a license to use, display, and distribute your content on the Service.</p>
        
        <h4>4.2 Content Guidelines</h4>
        <p>All content must comply with our Community Guidelines. Content that violates these guidelines may be removed without notice.</p>
        
        <h4>4.3 Prohibited Content</h4>
        <ul>
          <li>Illegal, harmful, or offensive content</li>
          <li>Harassment, bullying, or threats</li>
          <li>Spam or misleading information</li>
          <li>Content that infringes on intellectual property rights</li>
          <li>Content involving minors</li>
        </ul>
      `
    },
    {
      id: 'payments',
      title: '5. Payments and Subscriptions',
      content: `
        <h4>5.1 Subscription Fees</h4>
        <p>Creators set their own subscription prices. Subscribers will be charged the amount displayed at the time of subscription.</p>
        
        <h4>5.2 Payment Processing</h4>
        <p>All payments are processed through third-party payment processors. By making a purchase, you agree to their terms.</p>
        
        <h4>5.3 Refund Policy</h4>
        <p>All sales are final. Refunds are only provided in exceptional circumstances at our discretion.</p>
        
        <h4>5.4 Creator Earnings</h4>
        <p>Creators earn a percentage of subscription fees and tips. Cabana retains a platform fee as described in our Creator Agreement.</p>
      `
    },
    {
      id: 'intellectual-property',
      title: '6. Intellectual Property',
      content: `
        <h4>6.1 Platform Rights</h4>
        <p>Cabana, its logo, and features are protected by trademark, copyright, and other laws. You may not use our intellectual property without permission.</p>
        
        <h4>6.2 User Content</h4>
        <p>You represent that you own or have rights to all content you post. You may not post content that infringes on others' rights.</p>
        
        <h4>6.3 DMCA Policy</h4>
        <p>We respect intellectual property rights. If you believe content infringes your rights, please submit a DMCA notice as outlined in our Copyright Policy.</p>
      `
    },
    {
      id: 'privacy',
      title: '7. Privacy',
      content: `Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information. By using the Service, you agree to our Privacy Policy.`
    },
    {
      id: 'termination',
      title: '8. Termination',
      content: `
        <h4>8.1 Termination by You</h4>
        <p>You may terminate your account at any time by contacting us or using account deletion features.</p>
        
        <h4>8.2 Termination by Us</h4>
        <p>We may terminate or suspend accounts that violate these Terms, engage in harmful conduct, or for any reason at our discretion.</p>
        
        <h4>8.3 Effect of Termination</h4>
        <p>Upon termination, your right to use the Service ceases. Content and data may be deleted, though some information may be retained as required by law.</p>
      `
    },
    {
      id: 'disclaimers',
      title: '9. Disclaimers',
      content: `
        <p>THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.</p>
        
        <p>We do not guarantee that the Service will be uninterrupted, secure, or error-free. Use of the Service is at your own risk.</p>
      `
    },
    {
      id: 'limitation',
      title: '10. Limitation of Liability',
      content: `
        <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW, CABANA SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFITS, DATA, OR USE, ARISING FROM YOUR USE OF THE SERVICE.</p>
        
        <p>Our total liability shall not exceed the amount paid by you in the twelve months preceding the claim.</p>
      `
    },
    {
      id: 'governing-law',
      title: '11. Governing Law',
      content: `These Terms are governed by the laws of the State of Delaware, without regard to conflict of law principles. Any disputes shall be resolved in the courts of Delaware.`
    },
    {
      id: 'changes',
      title: '12. Changes to Terms',
      content: `We reserve the right to modify these Terms at any time. We will provide notice of material changes. Continued use of the Service after changes constitutes acceptance of the new Terms.`
    },
    {
      id: 'contact',
      title: '13. Contact Information',
      content: `
        <p>If you have questions about these Terms, please contact us:</p>
        <ul>
          <li>Email: legal@cabana.com</li>
          <li>Address: Cabana, Inc., 123 Creator Street, San Francisco, CA 94105</li>
          <li>Phone: 1-800-CABANA1</li>
        </ul>
      `
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>Last updated: {new Date(lastUpdated).toLocaleDateString()}</span>
                <span>Effective: {new Date(effectiveDate).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link to="/support/contact">
                  <Mail className="h-4 w-4 mr-2" />
                  Questions?
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Table of Contents */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardContent className="p-6">
                <h2 className="font-semibold mb-4">Table of Contents</h2>
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="block text-sm text-gray-600 hover:text-purple-600 py-1"
                    >
                      {section.title}
                    </a>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-8">
                <div className="prose prose-gray max-w-none">
                  <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-800 mb-0">
                      <strong>Important:</strong> Please read these Terms of Service carefully before using Cabana. 
                      By creating an account or using our service, you agree to be bound by these terms.
                    </p>
                  </div>

                  {sections.map((section) => (
                    <section key={section.id} id={section.id} className="mb-8">
                      <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                        {section.title}
                      </h2>
                      <div 
                        className="text-gray-700 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: section.content.replace(/\n\s*\n/g, '</p><p>').replace(/\n/g, '<br>') }}
                      />
                    </section>
                  ))}
                </div>

                {/* Footer */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="font-semibold mb-4">Questions or Concerns?</h3>
                    <p className="text-gray-600 mb-4">
                      If you have any questions about these Terms of Service, please don't hesitate to contact us. 
                      We're here to help!
                    </p>
                    <div className="flex gap-3">
                      <Button asChild variant="outline">
                        <Link to="/support/contact">
                          Contact Support
                        </Link>
                      </Button>
                      <Button asChild variant="outline">
                        <Link to="/support/help">
                          Visit Help Center
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TermsOfServicePage