/**
 * Email Service using SMTP2GO
 * Handles transactional emails for FansWorld
 */

interface EmailOptions {
  to: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
}

interface WaitlistEmailData {
  email: string;
  vipCode?: string;
}

interface WelcomeEmailData {
  email: string;
  name: string;
  inviteCode?: string;
}

/**
 * Send email via SMTP2GO API
 */
export async function sendEmail({ to, subject, htmlContent, textContent }: EmailOptions) {
  const apiKey = process.env.SMTP2GO_API_KEY;
  const senderEmail = process.env.SMTP2GO_SENDER_EMAIL || 'noreply@cabana.tdstudiosny.com';
  const senderName = process.env.SMTP2GO_SENDER_NAME || 'FansWorld';

  if (!apiKey) {
    throw new Error('SMTP2GO_API_KEY environment variable is required');
  }

  try {
    const response = await fetch('https://api.smtp2go.com/v3/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Smtp2go-Api-Key': apiKey,
      },
      body: JSON.stringify({
        api_key: apiKey,
        to: [to],
        sender: `${senderName} <${senderEmail}>`,
        subject,
        html_body: htmlContent,
        text_body: textContent || htmlContent.replace(/<[^>]*>/g, ''), // Strip HTML for text version
      }),
    });

    const result = await response.json();

    if (!response.ok || result.data?.error) {
      throw new Error(`Email send failed: ${result.data?.error || response.statusText}`);
    }

    return {
      success: true,
      messageId: result.data?.message_id,
      result
    };

  } catch (error) {
    console.error('Email send error:', error);
    throw error;
  }
}

/**
 * Send waitlist confirmation email
 */
export async function sendWaitlistEmail({ email, vipCode }: WaitlistEmailData) {
  const subject = "🎉 Welcome to the FansWorld VIP Waitlist!";
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%); color: white; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #60a5fa; font-size: 28px; margin: 0;">FansWorld</h1>
        <p style="color: #94a3b8; margin: 5px 0;">Luxury Creator Platform</p>
      </div>
      
      <div style="background: rgba(255, 255, 255, 0.05); border-radius: 12px; padding: 25px; margin: 20px 0;">
        <h2 style="color: #f8fafc; margin-top: 0;">You're on the VIP List! 🚀</h2>
        <p style="color: #cbd5e1; line-height: 1.6;">
          Thank you for joining the exclusive FansWorld waitlist. You'll be among the first to access our luxury creator platform when we launch.
        </p>
        
        ${vipCode ? `
          <div style="background: rgba(96, 165, 250, 0.1); border: 1px solid #60a5fa; border-radius: 8px; padding: 15px; margin: 20px 0;">
            <h3 style="color: #60a5fa; margin: 0 0 10px 0;">Your VIP Access Code</h3>
            <code style="background: rgba(0,0,0,0.3); padding: 8px 12px; border-radius: 4px; font-size: 16px; color: #f1f5f9;">${vipCode}</code>
            <p style="color: #94a3b8; font-size: 14px; margin: 10px 0 0 0;">
              Use this code for exclusive early access when we launch.
            </p>
          </div>
        ` : ''}
        
        <div style="margin: 25px 0;">
          <h3 style="color: #f8fafc;">What's Next?</h3>
          <ul style="color: #cbd5e1; line-height: 1.8;">
            <li>We'll notify you 24 hours before launch</li>
            <li>VIP members get exclusive features and pricing</li>
            <li>Follow us on social media for updates</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://cabana.tdstudiosny.com" 
             style="background: linear-gradient(45deg, #60a5fa, #a855f7); color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold;">
            Visit Landing Page
          </a>
        </div>
      </div>
      
      <div style="text-align: center; color: #64748b; font-size: 12px; margin-top: 30px;">
        <p>FansWorld - The Future of Creator Economy</p>
        <p>If you didn't sign up for this, please ignore this email.</p>
      </div>
    </div>
  `;

  return sendEmail({
    to: email,
    subject,
    htmlContent
  });
}

/**
 * Send welcome email after registration
 */
export async function sendWelcomeEmail({ email, name, inviteCode }: WelcomeEmailData) {
  const subject = "🎊 Welcome to FansWorld - Let's Get Started!";
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%); color: white; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #60a5fa; font-size: 28px; margin: 0;">Welcome to FansWorld!</h1>
        <p style="color: #94a3b8; margin: 5px 0;">You're now part of the exclusive creator community</p>
      </div>
      
      <div style="background: rgba(255, 255, 255, 0.05); border-radius: 12px; padding: 25px; margin: 20px 0;">
        <h2 style="color: #f8fafc; margin-top: 0;">Hi ${name}! 👋</h2>
        <p style="color: #cbd5e1; line-height: 1.6;">
          Your FansWorld account is now active. You're part of an exclusive community of creators and fans building the future of content.
        </p>
        
        <div style="margin: 25px 0;">
          <h3 style="color: #f8fafc;">Quick Start Guide:</h3>
          <ul style="color: #cbd5e1; line-height: 1.8;">
            <li><strong>Complete your profile</strong> - Add photos and bio</li>
            <li><strong>Set up monetization</strong> - Connect payment methods</li>
            <li><strong>Create content</strong> - Share your first post</li>
            <li><strong>Build your audience</strong> - Invite fans to subscribe</li>
          </ul>
        </div>
        
        ${inviteCode ? `
          <div style="background: rgba(168, 85, 247, 0.1); border: 1px solid #a855f7; border-radius: 8px; padding: 15px; margin: 20px 0;">
            <h3 style="color: #a855f7; margin: 0 0 10px 0;">Your Referral Code</h3>
            <code style="background: rgba(0,0,0,0.3); padding: 8px 12px; border-radius: 4px; font-size: 16px; color: #f1f5f9;">${inviteCode}</code>
            <p style="color: #94a3b8; font-size: 14px; margin: 10px 0 0 0;">
              Invite friends and earn rewards for each successful referral.
            </p>
          </div>
        ` : ''}
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://cabana.tdstudiosny.com/dashboard" 
             style="background: linear-gradient(45deg, #60a5fa, #a855f7); color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold;">
            Go to Dashboard
          </a>
        </div>
      </div>
      
      <div style="background: rgba(255, 255, 255, 0.02); border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h3 style="color: #f8fafc; margin-top: 0;">Need Help?</h3>
        <p style="color: #cbd5e1;">
          Our support team is here to help you succeed. Reach out anytime at 
          <a href="mailto:support@cabana.tdstudiosny.com" style="color: #60a5fa;">support@cabana.tdstudiosny.com</a>
        </p>
      </div>
      
      <div style="text-align: center; color: #64748b; font-size: 12px; margin-top: 30px;">
        <p>FansWorld - The Future of Creator Economy</p>
        <p>© 2025 FansWorld. All rights reserved.</p>
      </div>
    </div>
  `;

  return sendEmail({
    to: email,
    subject,
    htmlContent
  });
}

/**
 * Send creator application status email
 */
export async function sendCreatorApplicationEmail(email: string, status: 'approved' | 'rejected', reason?: string) {
  const isApproved = status === 'approved';
  const subject = isApproved ? "🎉 Creator Application Approved!" : "Creator Application Update";
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%); color: white; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #60a5fa; font-size: 28px; margin: 0;">FansWorld</h1>
        <p style="color: #94a3b8; margin: 5px 0;">Creator Application Update</p>
      </div>
      
      <div style="background: rgba(255, 255, 255, 0.05); border-radius: 12px; padding: 25px; margin: 20px 0;">
        ${isApproved ? `
          <h2 style="color: #10b981; margin-top: 0;">Congratulations! 🎊</h2>
          <p style="color: #cbd5e1; line-height: 1.6;">
            Your creator application has been approved. You now have access to all creator features including monetization tools, analytics, and subscriber management.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://cabana.tdstudiosny.com/dashboard" 
               style="background: linear-gradient(45deg, #10b981, #059669); color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold;">
              Start Creating
            </a>
          </div>
        ` : `
          <h2 style="color: #f59e0b; margin-top: 0;">Application Update</h2>
          <p style="color: #cbd5e1; line-height: 1.6;">
            Thank you for your interest in becoming a FansWorld creator. After review, we're unable to approve your application at this time.
          </p>
          ${reason ? `
            <div style="background: rgba(245, 158, 11, 0.1); border: 1px solid #f59e0b; border-radius: 8px; padding: 15px; margin: 20px 0;">
              <h3 style="color: #f59e0b; margin: 0 0 10px 0;">Feedback</h3>
              <p style="color: #cbd5e1; margin: 0;">${reason}</p>
            </div>
          ` : ''}
          <p style="color: #cbd5e1; line-height: 1.6;">
            You're welcome to reapply in the future. Focus on building your audience and improving your content quality.
          </p>
        `}
      </div>
      
      <div style="text-align: center; color: #64748b; font-size: 12px; margin-top: 30px;">
        <p>FansWorld - The Future of Creator Economy</p>
      </div>
    </div>
  `;

  return sendEmail({
    to: email,
    subject,
    htmlContent
  });
}