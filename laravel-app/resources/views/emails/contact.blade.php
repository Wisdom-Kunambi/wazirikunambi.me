<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>New Portfolio Message</title>
<style>
  body { margin: 0; padding: 0; background: #0a0a0a; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }
  .wrapper { max-width: 580px; margin: 40px auto; background: #111118; border: 1px solid #222235; border-radius: 6px; overflow: hidden; }
  .header { padding: 32px 36px 24px; border-bottom: 1px solid #222235; }
  .label { font-size: 10px; font-family: monospace; letter-spacing: 0.28em; text-transform: uppercase; color: #555577; margin: 0 0 10px; }
  .title { font-size: 22px; font-weight: 800; color: #f0f0f8; margin: 0; letter-spacing: -0.03em; line-height: 1.1; }
  .body { padding: 28px 36px; }
  .field { margin-bottom: 22px; }
  .field-label { font-size: 9px; font-family: monospace; letter-spacing: 0.32em; text-transform: uppercase; color: #555577; margin: 0 0 6px; }
  .field-value { font-size: 15px; color: #c8c8e0; margin: 0; line-height: 1.5; }
  .field-value a { color: #6677ff; text-decoration: none; }
  .message-box { background: #16161f; border: 1px solid #222235; border-radius: 4px; padding: 18px 20px; margin-top: 6px; }
  .message-box p { font-size: 14px; color: #b0b0cc; margin: 0; white-space: pre-wrap; line-height: 1.65; }
  .divider { height: 1px; background: #222235; margin: 4px 0 22px; }
  .footer { padding: 20px 36px; border-top: 1px solid #222235; }
  .footer p { font-size: 11px; font-family: monospace; letter-spacing: 0.18em; text-transform: uppercase; color: #444466; margin: 0; }
  .dot { display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #6677ff; margin-right: 8px; vertical-align: middle; }
</style>
</head>
<body>
<div class="wrapper">
  <div class="header">
    <p class="label">Portfolio · New Message</p>
    <h1 class="title">{{ $name }} sent you a message</h1>
  </div>
  <div class="body">
    <div class="field">
      <p class="field-label">From</p>
      <p class="field-value">{{ $name }}</p>
    </div>
    <div class="divider"></div>
    <div class="field">
      <p class="field-label">Reply to</p>
      <p class="field-value"><a href="mailto:{{ $email }}">{{ $email }}</a></p>
    </div>
    <div class="divider"></div>
    <div class="field">
      <p class="field-label">Message</p>
      <div class="message-box"><p>{{ $body }}</p></div>
    </div>
    <div class="divider"></div>
    <div class="field" style="margin-bottom:0">
      <p class="field-label">Received</p>
      <p class="field-value">{{ now('Africa/Dar_es_Salaam')->format('D, d M Y · H:i') }} EAT</p>
    </div>
  </div>
  <div class="footer">
    <p><span class="dot"></span>wazirikunambi.me portfolio contact form</p>
  </div>
</div>
</body>
</html>
