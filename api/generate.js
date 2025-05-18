// api/generate.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(400).json({ error: 'Only POST allowed' });
  }

  const { inputText, tone, language } = req.body;

  if (!inputText || !tone || !language) {
    return res.status(400).json({ error: 'Missing fields in request' });
  }

  const prompt = `
Agisci come un esperto di app di dating. L'utente ha ricevuto questo messaggio: "${inputText}"
Rispondi in tono ${tone}. Scrivi in ${language}.
Genera 3 possibili risposte brevi, con un tono naturale, realistico e simpatico, adatte per Tinder o Bumble.
Usa emoji dove ha senso, senza esagerare.
Scrivi le 3 risposte su 3 righe distinte, senza numerarle.
`;

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "OpenAI-Project": "proj_ZGHbmAMCAkX8qMMpFtYF6cKl"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 250,
        temperature: 0.8
      })
    });

    const data = await openaiRes.json();
    const output = data.choices?.[0]?.message?.content;

    if (!output) {
      return res.status(500).json({ error: 'Empty response from GPT' });
    }

    res.status(200).json({ output });

  } catch (err) {
    console.error('GPT error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}
