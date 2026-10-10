import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const email = formData.get('email');
    const phone = formData.get('phone');
    const method = formData.get('method');

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier PDF reçu' }, { status: 400 });
    }

    console.log('--- 🚀 RÉCEPTION FACTURE ---');
    console.log(`Fichier reçu : ${file.name} (${file.size} octets)`);
    console.log(`Destinataire : ${email} / ${phone}`);
    console.log(`Méthode d'envoi : ${method}`);
    console.log('----------------------------');

    // Ici, on intégrera Resend et Twilio/Meta pour l'envoi réel
    // Pour l'instant, on simule un délai de traitement réseau
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({
      success: true,
      message: `Le PDF a été traité et envoyé avec succès via ${method} !`
    });

  } catch (error) {
    console.error('Erreur API send-invoice:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
