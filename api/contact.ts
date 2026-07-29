import type { IncomingMessage, ServerResponse } from 'http';

interface ContactRequestBody {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export default async function handler(req: IncomingMessage & { body?: any }, res: ServerResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: false, message: 'Method Not Allowed. Only POST is supported.' }));
    return;
  }

  try {
    let body: ContactRequestBody = {};
    if (typeof req.body === 'object' && req.body !== null) {
      body = req.body;
    } else {
      const buffers: Uint8Array[] = [];
      for await (const chunk of req) {
        buffers.push(chunk);
      }
      const rawBody = Buffer.concat(buffers).toString('utf-8');
      if (rawBody) {
        try {
          body = JSON.parse(rawBody);
        } catch {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false, message: 'Invalid JSON payload.' }));
          return;
        }
      }
    }

    const { name, email, subject, message } = body;

    // Server-side field validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: false, message: 'Name must be at least 2 characters long.' }));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: false, message: 'Please provide a valid email address.' }));
      return;
    }

    if (!message || typeof message !== 'string' || message.trim().length < 5) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: false, message: 'Message must be at least 5 characters long.' }));
      return;
    }

    // Determine access key from environment if available
    const accessKey =
      process.env.WEB3FORMS_ACCESS_KEY ||
      process.env.VITE_WEB3FORMS_ACCESS_KEY ||
      process.env.PUBLIC_WEB3FORMS_ACCESS_KEY;

    // Option 1: Web3Forms if key is configured
    if (accessKey && accessKey !== 'your_web3forms_access_key_here') {
      const web3Response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: name.trim(),
          email: email.trim(),
          subject: (subject && subject.trim()) || `New Portfolio Contact Message from ${name.trim()}`,
          message: message.trim(),
          from_name: "Ram's Portfolio",
        }),
      });

      const data = await web3Response.json();

      if (web3Response.ok && data.success) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(
          JSON.stringify({
            success: true,
            message: 'Message delivered successfully to Ramashish Yadav!',
          })
        );
        return;
      }
    }

    // Option 2: Fallback to FormSubmit (Zero-config email forwarding directly to yadavramashish42449@gmail.com)
    const targetEmail = 'yadavramashish42449@gmail.com';
    const formSubmitRes = await fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Referer: 'https://ram-portfolio-hazel.vercel.app/',
        Origin: 'https://ram-portfolio-hazel.vercel.app',
      },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        _subject: (subject && subject.trim()) || `Portfolio Message from ${name.trim()}`,
        message: message.trim(),
        _template: 'table',
        _captcha: 'false',
      }),
    });

    const fsData = await formSubmitRes.json();

    if (formSubmitRes.ok && (fsData.success === 'true' || fsData.success === true)) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          success: true,
          message: 'Message delivered successfully to Ramashish Yadav!',
        })
      );
      return;
    } else if (fsData.message && fsData.message.includes('needs Activation')) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          success: true,
          message:
            "Activation required: An email has been sent to yadavramashish42449@gmail.com. Please click the 'Activate Form' link in your Gmail inbox to receive messages instantly!",
        })
      );
      return;
    } else {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          success: false,
          message: fsData.message || 'Failed to dispatch email. Please try again.',
        })
      );
      return;
    }
  } catch (error: any) {
    console.error('Contact API Error:', error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        success: false,
        message: 'Internal server error while processing message delivery.',
      })
    );
  }
}
