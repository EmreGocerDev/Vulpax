import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    // Validation
    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { error: 'Tüm alanlar zorunludur' },
        { status: 400 }
      );
    }

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'Vulpax Digital <onboarding@resend.dev>', // Resend'in verified domain'i kullanıyoruz
      to: ['emregocernew@gmail.com'],
      replyTo: email,
      subject: `Yeni İletişim Formu - ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: #000;
                color: #fff;
                padding: 20px;
                text-align: center;
                margin-bottom: 30px;
              }
              .content {
                background: #f5f5f5;
                padding: 20px;
                border-radius: 5px;
              }
              .field {
                margin-bottom: 15px;
              }
              .label {
                font-weight: bold;
                color: #666;
                display: block;
                margin-bottom: 5px;
              }
              .value {
                color: #000;
                padding: 10px;
                background: #fff;
                border-left: 3px solid #000;
              }
              .footer {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #ddd;
                text-align: center;
                color: #666;
                font-size: 12px;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>🔔 Yeni İletişim Formu</h1>
              <p>Vulpax Digital - İletişim Talebi</p>
            </div>
            
            <div class="content">
              <div class="field">
                <span class="label">👤 Ad Soyad:</span>
                <div class="value">${name}</div>
              </div>
              
              <div class="field">
                <span class="label">📧 E-posta:</span>
                <div class="value"><a href="mailto:${email}">${email}</a></div>
              </div>
              
              <div class="field">
                <span class="label">📱 Telefon:</span>
                <div class="value"><a href="tel:${phone}">${phone}</a></div>
              </div>
              
              <div class="field">
                <span class="label">💬 Mesaj:</span>
                <div class="value">${message.replace(/\n/g, '<br>')}</div>
              </div>
            </div>
            
            <div class="footer">
              <p>Bu mesaj Vulpax Digital web sitesindeki iletişim formundan gönderilmiştir.</p>
              <p>Müşteriyle iletişime geçmek için yukarıdaki e-posta veya telefon bilgilerini kullanabilirsiniz.</p>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Email gönderilemedi', details: error },
        { status: 500 }
      );
    }

    console.log('Email sent successfully:', data);
    return NextResponse.json(
      { success: true, messageId: data?.id },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
