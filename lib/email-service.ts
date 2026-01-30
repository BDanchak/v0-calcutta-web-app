// Email service for sending confirmation and invite emails
interface EmailData {
  to: string
  subject: string
  html: string
}

export async function sendEmail(emailData: EmailData): Promise<boolean> {
  try {
    // In a real application, you would integrate with an email service like:
    // - SendGrid
    // - Mailgun
    // - AWS SES
    // - Nodemailer with SMTP

    // For now, we'll simulate the email sending and log it
    console.log("📧 Email sent:", {
      to: emailData.to,
      subject: emailData.subject,
      timestamp: new Date().toISOString(),
    })

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In production, replace this with actual email service integration:
    /*
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    })
    
    return response.ok
    */

    return true
  } catch (error) {
    console.error("Failed to send email:", error)
    return false
  }
}

export function generateConfirmationEmail(name: string, email: string): EmailData {
  const confirmationLink = `${window.location.origin}/confirm-email?token=${btoa(email)}`

  return {
    to: email,
    subject: "Welcome to Calcutta Fantasy - Confirm Your Email",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">🏆 Welcome to Calcutta Fantasy!</h1>
        </div>
        
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333;">Hi ${name}!</h2>
          
          <p style="color: #666; line-height: 1.6;">
            Thank you for joining Calcutta Fantasy! We're excited to have you as part of our community.
          </p>
          
          <p style="color: #666; line-height: 1.6;">
            To complete your registration and start creating or joining leagues, please confirm your email address by clicking the button below:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${confirmationLink}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 5px; 
                      display: inline-block;
                      font-weight: bold;">
              Confirm Email Address
            </a>
          </div>
          
          <p style="color: #666; line-height: 1.6; font-size: 14px;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${confirmationLink}" style="color: #667eea;">${confirmationLink}</a>
          </p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px;">
            If you didn't create an account with Calcutta Fantasy, you can safely ignore this email.
          </p>
        </div>
      </div>
    `,
  }
}

export function generateLeagueInviteEmail(
  inviterName: string,
  leagueName: string,
  leagueDescription: string,
  inviteCode: string,
  recipientEmail: string,
): EmailData {
  const joinLink = `${window.location.origin}/leagues/join?code=${inviteCode}`

  return {
    to: recipientEmail,
    subject: `You're Invited to Join "${leagueName}" on Calcutta Fantasy!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">🏆 League Invitation</h1>
        </div>
        
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333;">You're Invited!</h2>
          
          <p style="color: #666; line-height: 1.6;">
            <strong>${inviterName}</strong> has invited you to join their league on Calcutta Fantasy:
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
            <h3 style="color: #333; margin: 0 0 10px 0;">${leagueName}</h3>
            <p style="color: #666; margin: 0; line-height: 1.5;">${leagueDescription}</p>
          </div>
          
          <p style="color: #666; line-height: 1.6;">
            Join now to participate in the auction and compete for prizes!
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${joinLink}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 5px; 
                      display: inline-block;
                      font-weight: bold;">
              Join League Now
            </a>
          </div>
          
          <div style="background: #e8f2ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0; color: #333; font-size: 14px;">
              <strong>League Code:</strong> <code style="background: white; padding: 2px 6px; border-radius: 3px;">${inviteCode}</code><br>
              You can also join manually by entering this code on the Calcutta Fantasy website.
            </p>
          </div>
          
          <p style="color: #666; line-height: 1.6; font-size: 14px;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${joinLink}" style="color: #667eea;">${joinLink}</a>
          </p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px;">
            New to Calcutta Fantasy? <a href="${window.location.origin}/register" style="color: #667eea;">Create your free account</a> to get started!
          </p>
        </div>
      </div>
    `,
  }
}
