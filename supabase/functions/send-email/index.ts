import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  type: 'waitlist' | 'welcome' | 'creator-application';
  to: string;
  data?: any;
}

const SMTP2GO_API_KEY = Deno.env.get("SMTP2GO_API_KEY");
const SENDER_EMAIL = Deno.env.get("SMTP2GO_SENDER_EMAIL") || "noreply@cabana.tdstudiosny.com";
const SENDER_NAME = Deno.env.get("SMTP2GO_SENDER_NAME") || "FansWorld";

async function sendEmail(to: string, subject: string, htmlContent: string) {
  if (!SMTP2GO_API_KEY) {
    throw new Error("SMTP2GO_API_KEY environment variable is required");
  }

  try {
    const response = await fetch("https://api.smtp2go.com/v3/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Smtp2go-Api-Key": SMTP2GO_API_KEY,
      },
      body: JSON.stringify({
        api_key: SMTP2GO_API_KEY,
        to: [to],
        sender: `${SENDER_NAME} <${SENDER_EMAIL}>`,
        subject,
        html_body: htmlContent,
        text_body: htmlContent.replace(/<[^>]*>/g, ""), // Strip HTML
      }),
    });

    const result = await response.json();

    if (!response.ok || result.data?.error) {
      throw new Error(`Email send failed: ${result.data?.error || response.statusText}`);
    }

    return {
      success: true,
      messageId: result.data?.message_id,
    };
  } catch (error) {
    console.error("Email send error:", error);
    throw error;
  }
}

function getWaitlistEmailTemplate(email: string, vipCode?: string) {
  return {
    subject: "🎉 Welcome to the FansWorld VIP Waitlist!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%); color: white; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #60a5fa; font-size: 28px; margin: 0;">FansWorld</h1>
          <p style="color: #94a3b8; margin: 5px 0;">Luxury Creator Platform</p>
        </div>
        
        <div style="background: rgba(255, 255, 255, 0.05); border-radius: 12px; padding: 25px; margin: 20px 0;">
          <h2 style="color: #f8fafc; margin-top: 0;">You're on the VIP List! 🚀</h2>
          <p style="color: #cbd5e1; line-height: 1.6;">
            Thank you for joining the exclusive FansWorld waitlist. You'll be among the first to access our luxury creator platform.
          </p>
          
          ${vipCode ? `
            <div style="background: rgba(96, 165, 250, 0.1); border: 1px solid #60a5fa; border-radius: 8px; padding: 15px; margin: 20px 0;">
              <h3 style="color: #60a5fa; margin: 0 0 10px 0;">Your VIP Access Code</h3>
              <code style="background: rgba(0,0,0,0.3); padding: 8px 12px; border-radius: 4px; font-size: 16px; color: #f1f5f9;">${vipCode}</code>
            </div>
          ` : ''}
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://cabana.tdstudiosny.com" 
               style="background: linear-gradient(45deg, #60a5fa, #a855f7); color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold;">
              Visit Landing Page
            </a>
          </div>
        </div>
      </div>
    `
  };
}

function getWelcomeEmailTemplate(name: string) {
  return {
    subject: "🎊 Welcome to FansWorld!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%); color: white; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #60a5fa; font-size: 28px; margin: 0;">Welcome to FansWorld!</h1>
        </div>
        
        <div style="background: rgba(255, 255, 255, 0.05); border-radius: 12px; padding: 25px; margin: 20px 0;">
          <h2 style="color: #f8fafc; margin-top: 0;">Hi ${name}! 👋</h2>
          <p style="color: #cbd5e1; line-height: 1.6;">
            Your FansWorld account is now active. Welcome to the future of content creation!
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://cabana.tdstudiosny.com/dashboard" 
               style="background: linear-gradient(45deg, #60a5fa, #a855f7); color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold;">
              Go to Dashboard
            </a>
          </div>
        </div>
      </div>
    `
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, to, data }: EmailRequest = await req.json();

    let emailTemplate;
    
    switch (type) {
      case 'waitlist':
        emailTemplate = getWaitlistEmailTemplate(to, data?.vipCode);
        break;
      case 'welcome':
        emailTemplate = getWelcomeEmailTemplate(data?.name || 'Creator');
        break;
      default:
        throw new Error(`Invalid email type: ${type}`);
    }

    const result = await sendEmail(to, emailTemplate.subject, emailTemplate.html);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Send email error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error" 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});