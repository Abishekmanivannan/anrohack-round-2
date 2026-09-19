export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export type MedicineSuggestion = {
  name: string;
  reason: string;
};

export type LLMReply = {
  response: string;
  suggestions: string[];
  medicines: MedicineSuggestion[];
};

const normalize = (text: string) => text.toLowerCase();

const buildLocalHealthcareReply = (input: string): LLMReply => {
  const lower = normalize(input);

  const symptomMap: Array<{ keywords: string[]; response: string; suggestions: string[]; medicines: MedicineSuggestion[] }> = [
    {
      keywords: ['fever', 'temperature', 'hot', 'high temp'],
      response: 'Fever is often a sign your body is fighting an infection. Rest, hydrate, and monitor the temperature trend. If it stays high or you feel breathless, contact a clinician promptly.',
      suggestions: [
        'What medicines are usually used for fever and body aches?',
        'How long should I monitor this fever?',
        'Could my symptoms be related to an infection or dehydration?',
      ],
      medicines: [
        { name: 'Acetaminophen (Paracetamol)', reason: 'Often used to reduce fever and mild pain when taken at the labeled dose.' },
        { name: 'Ibuprofen', reason: 'May help with fever and body aches if safe for you and not contraindicated.' },
      ],
    },
    {
      keywords: ['cough', 'sore throat', 'throat pain'],
      response: 'A cough or sore throat can be caused by irritation, allergies, or infection. Warm fluids, rest, and monitoring the pattern are usually helpful, but a clinician should assess worsening symptoms.',
      suggestions: [
        'Can a cough syrup or lozenge help my throat?',
        'Should I be concerned if I also have fever or chest tightness?',
        'What home care steps reduce throat irritation?',
      ],
      medicines: [
        { name: 'Honey or lozenges', reason: 'Can help soothe a dry cough and throat irritation.' },
        { name: 'Cough suppressant', reason: 'May help reduce nighttime coughing when your doctor or pharmacist recommends it.' },
      ],
    },
    {
      keywords: ['headache', 'migraine', 'pain', 'body ache'],
      response: 'Headache or body pain can come from stress, dehydration, tension, or illness. It is helpful to track duration, intensity, and any related symptoms before choosing a plan.',
      suggestions: [
        'Do I need something for pain or just hydration and rest?',
        'Is this headache pattern serious enough to contact a clinician?',
        'Could this be related to dehydration or stress?',
      ],
      medicines: [
        { name: 'Acetaminophen', reason: 'Useful for mild-to-moderate pain if it is safe for you.' },
        { name: 'Ibuprofen', reason: 'Can help with headache or body aches, depending on your medical history.' },
      ],
    },
    {
      keywords: ['diarrhea', 'stomach', 'nausea', 'vomit'],
      response: 'Digestive discomfort often improves with fluids and easy foods. If you have severe abdominal pain, blood in the stool, or repeated vomiting, seek medical advice quickly.',
      suggestions: [
        'What fluids should I take to avoid dehydration?',
        'How long should I wait before a clinician review?',
        'Could this be food-related or infection-related?',
      ],
      medicines: [
        { name: 'Oral rehydration solution', reason: 'Helps replace fluids and salts when diarrhea or vomiting is ongoing.' },
        { name: 'Antiemetic (if prescribed)', reason: 'Can reduce nausea in some situations when directed by a clinician.' },
      ],
    },
  ];

  const matched = symptomMap.find(({ keywords }) => keywords.some((item) => lower.includes(item)));

  if (matched) {
    return {
      response: matched.response,
      suggestions: matched.suggestions,
      medicines: matched.medicines,
    };
  }

  return {
    response: 'I can help turn your symptoms into a clearer care plan. Tell me what symptoms you have, for how long, and whether you have fever, pain, cough, or digestive issues so I can suggest a more specific next step.',
    suggestions: [
      'What should I ask my doctor about these symptoms?',
      'Which medicines are commonly used for mild symptom relief?',
      'How should I monitor this at home?',
      'When should I book medical follow-up?',
    ],
    medicines: [
      { name: 'Follow clinician guidance', reason: 'Medication choice should match your symptoms, age, and any other medicines you take.' },
    ],
  };
};

const parseJsonResponse = (raw: string): Partial<LLMReply> | null => {
  try {
    const cleaned = raw.replace(/```json|```/gi, '').trim();
    return JSON.parse(cleaned) as Partial<LLMReply>;
  } catch {
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    try {
      return JSON.parse(jsonMatch[0]) as Partial<LLMReply>;
    } catch {
      return null;
    }
  }
};

export const getHealthcareAssistantReply = async (history: ChatMessage[]): Promise<LLMReply> => {
  const latestUserInput = [...history].reverse().find((m) => m.role === 'user')?.content || '';

  if (!latestUserInput.trim()) {
    return {
      response: 'Tell me about your symptoms and I will suggest next steps and possible medicine options.',
      suggestions: ['I have fever and body aches', 'I have a persistent cough', 'I have stomach pain and nausea'],
      medicines: [{ name: 'Symptom monitoring', reason: 'I can suggest home-care guidance once you share your symptoms.' }],
    };
  }

  const llmUrl = import.meta.env.VITE_LLM_API_URL as string | undefined;
  const llmApiKey = import.meta.env.VITE_LLM_API_KEY as string | undefined;

  if (llmUrl && llmApiKey) {
    try {
      const payload = {
        model: import.meta.env.VITE_LLM_MODEL || 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'You are a careful clinical assistant for general wellness guidance. Provide brief, empathetic, non-diagnostic advice. Return valid JSON only with keys: response, suggestions, medicines. suggestions must be an array of 3 strings. medicines must be an array of objects with name and reason. If the user symptoms are severe, advise contacting a clinician immediately. Do not give a diagnosis.',
          },
          ...history,
        ],
        temperature: 0.4,
        response_format: { type: 'json_object' },
      };

      const response = await fetch(llmUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${llmApiKey}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`LLM request failed: ${response.status}`);
      }

      const data = await response.json();
      const assistantText = data?.choices?.[0]?.message?.content as string | undefined;

      if (assistantText) {
        const parsed = parseJsonResponse(assistantText);

        if (parsed?.response && Array.isArray(parsed?.suggestions) && Array.isArray(parsed?.medicines)) {
          return {
            response: String(parsed.response),
            suggestions: parsed.suggestions.slice(0, 3).map((item) => String(item)),
            medicines: parsed.medicines.slice(0, 3).map((med) => ({
              name: String(med.name),
              reason: String(med.reason),
            })),
          };
        }
      }
    } catch (error) {
      console.warn('Falling back to local assistant logic because the OpenAI-compatible API call failed:', error);
    }
  }

  return buildLocalHealthcareReply(latestUserInput);
};
