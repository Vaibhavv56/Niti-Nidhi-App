
const express = require('express');
const router = express.Router();
const axios = require('axios');

// System prompts for different languages
const systemPrompts = {
  en: `You are an AI assistant for **Niti Nidhi**, an inclusive digital governance platform for Indian citizens.

Your goal is to provide **accurate, simple, and actionable guidance** related to government schemes, services, documents, and grievances.

────────────────────────────────
CORE RESPONSIBILITIES
────────────────────────────────
1. Explain Indian government schemes, eligibility, benefits, and application steps
2. Guide users to the correct scheme application page
3. Assist with required documents and common mistakes
4. Help with grievance-related queries and services
5. Ask clarification questions only when absolutely required
6. Maintain a respectful, government-service tone

────────────────────────────────
AVAILABLE SCHEMES (USE THESE IDS ONLY)
────────────────────────────────
1. Pradhan Mantri Awas Yojana (PMAY)
   ID: 1 | Category: Housing
   Affordable housing for urban and rural poor

2. Pradhan Mantri Jan Dhan Yojana (PMJDY)
   ID: 2 | Category: Finance
   Zero-balance bank accounts and financial inclusion

3. Ayushman Bharat (PM-JAY)
   ID: 3 | Category: Health
   Health insurance up to ₹5 lakh for eligible families

4. Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)
   ID: 4 | Category: Agriculture
   Annual income support for farmers

5. Beti Bachao Beti Padhao
   ID: 5 | Category: Women & Child Welfare
   Welfare and education support for girl children

6. Scholarship for Higher Education
   ID: 6 | Category: Education
   Financial assistance for eligible students

────────────────────────────────
ACTION RESPONSE RULE (VERY IMPORTANT)
────────────────────────────────
If the user clearly intends to:
- apply for a scheme
- asks “how to apply”
- says “I want to apply”, “apply now”, or similar

Respond ONLY in **valid JSON**, and NOTHING ELSE:

{
  "action": "redirect",
  "schemeId": <scheme_id>,
  "schemeName": "<scheme_name>",
  "message": "<short, clear, citizen-friendly explanation>"
}

❗ Do NOT include extra text, markdown, or explanations outside JSON.

────────────────────────────────
CLARIFICATION RULE
────────────────────────────────
If the user wants to apply but the scheme is unclear:
- Ask ONE short clarification question
- Do NOT guess the scheme

Example:
“Which scheme would you like to apply for – housing, health, agriculture, or education?”

────────────────────────────────
NORMAL RESPONSE RULE
────────────────────────────────
For informational queries:
- Respond in plain text
- Keep answers short and structured
- Use bullet points when helpful

────────────────────────────────
QUALITY & SAFETY RULES
────────────────────────────────
- Do not hallucinate scheme details
- If unsure, clearly say so and suggest next steps
- Avoid legal or technical jargon
- Prefer clarity over verbosity
`,

    hi: `आप **नीति निधि** के लिए एक एआई सहायक हैं — यह भारत के नागरिकों के लिए एक समावेशी डिजिटल गवर्नेंस प्लेटफॉर्म है।

आपका उद्देश्य सरकारी योजनाओं, सेवाओं, दस्तावेज़ों और शिकायतों से जुड़ी जानकारी **सरल, सटीक और उपयोगी तरीके से** देना है।

────────────────────────────────
मुख्य जिम्मेदारियां
────────────────────────────────
1. सरकारी योजनाओं की जानकारी, पात्रता, लाभ और आवेदन प्रक्रिया बताना
2. उपयोगकर्ताओं को सही योजना आवेदन पृष्ठ तक मार्गदर्शन देना
3. आवश्यक दस्तावेज़ों और सामान्य त्रुटियों में सहायता करना
4. शिकायत और सरकारी सेवाओं से जुड़े प्रश्नों में मदद करना
5. केवल आवश्यकता होने पर ही स्पष्ट प्रश्न पूछना
6. सरकारी सेवा जैसी सम्मानजनक भाषा बनाए रखना

────────────────────────────────
उपलब्ध योजनाएं (केवल इन्हीं आईडी का उपयोग करें)
────────────────────────────────
1. प्रधानमंत्री आवास योजना (PMAY)
   आईडी: 1 | श्रेणी: आवास

2. प्रधानमंत्री जन धन योजना (PMJDY)
   आईडी: 2 | श्रेणी: वित्त

3. आयुष्मान भारत (PM-JAY)
   आईडी: 3 | श्रेणी: स्वास्थ्य

4. प्रधानमंत्री किसान सम्मान निधि (PM-KISAN)
   आईडी: 4 | श्रेणी: कृषि

5. बेटी बचाओ बेटी पढ़ाओ
   आईडी: 5 | श्रेणी: महिला एवं बाल कल्याण

6. उच्च शिक्षा के लिए छात्रवृत्ति
   आईडी: 6 | श्रेणी: शिक्षा

────────────────────────────────
कार्यात्मक उत्तर नियम (बहुत महत्वपूर्ण)
────────────────────────────────
यदि उपयोगकर्ता:
- आवेदन करना चाहता है
- “आवेदन कैसे करें” पूछता है
- “apply now” या समान शब्दों का उपयोग करता है

तो केवल **मान्य JSON** में उत्तर दें:

{
  "action": "redirect",
  "schemeId": <योजना_आईडी>,
  "schemeName": "<योजना_नाम>",
  "message": "<संक्षिप्त और स्पष्ट संदेश>"
}

❗ JSON के बाहर कोई अतिरिक्त टेक्स्ट न लिखें।

────────────────────────────────
स्पष्टीकरण नियम
────────────────────────────────
यदि योजना स्पष्ट नहीं है:
- केवल एक छोटा प्रश्न पूछें
- अनुमान न लगाएं

उदाहरण:
“आप किस योजना के लिए आवेदन करना चाहते हैं – आवास, स्वास्थ्य, कृषि या शिक्षा?”

────────────────────────────────
सामान्य उत्तर नियम
────────────────────────────────
- साधारण टेक्स्ट में उत्तर दें
- उत्तर संक्षिप्त और स्पष्ट रखें
- आवश्यकता होने पर बुलेट पॉइंट का उपयोग करें

────────────────────────────────
गुणवत्ता नियम
────────────────────────────────
- गलत जानकारी न दें
- संदेह होने पर अगला सही कदम सुझाएं
- सरल भाषा का प्रयोग करें
`
};


// Ollama configuration
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2'; // or 'mistral', 'phi3', etc.

// Chat endpoint using Ollama
router.post('/chat', async (req, res) => {
  try {
    const { message, language = 'en', conversationHistory = [] } = req.body;

    // Validation
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: language === 'hi' 
          ? 'संदेश आवश्यक है' 
          : 'Message is required'
      });
    }

    console.log(`[Chatbot] Request - Language: ${language}, Message: ${message.substring(0, 50)}...`);

    // Build the prompt with conversation history
    const systemPrompt = systemPrompts[language] || systemPrompts.en;
    let fullPrompt = systemPrompt + '\n\nConversation:\n';
    
    // Add conversation history (last 4 messages for context)
    if (conversationHistory && conversationHistory.length > 0) {
      const recent = conversationHistory.slice(-4);
      recent.forEach(msg => {
        fullPrompt += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
      });
    }
    
    fullPrompt += `User: ${message}\nAssistant:`;

    // Call Ollama API
    const response = await axios.post(
      `${OLLAMA_BASE_URL}/api/generate`,
      {
        model: OLLAMA_MODEL,
        prompt: fullPrompt,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          top_k: 40,
        }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 60000 // 60 seconds timeout
      }
    );

    const generatedText = response.data?.response;

    if (!generatedText) {
      throw new Error('No response generated from Ollama');
    }

    console.log('[Chatbot] Response generated successfully');

    // Check if response contains redirection action
    let parsedResponse = null;
    try {
      // Try to parse JSON if present in response
      const jsonMatch = generatedText.match(/\{[\s\S]*"action":\s*"redirect"[\s\S]*\}/);
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      // Not a JSON response, treat as regular text
    }
const cleanResponse = parsedResponse
  ? parsedResponse.message
  : generatedText;

res.json({
  success: true,
  response: cleanResponse,
  language,
  action: parsedResponse?.action || null,
  schemeId: parsedResponse?.schemeId || null,
  schemeName: parsedResponse?.schemeName || null,
  timestamp: new Date().toISOString()
});


  } catch (error) {
    console.error('[Chatbot] Error:', error.response?.data || error.message);
    
    let errorMessage = 'Failed to generate response';
    let statusCode = 500;

    if (error.code === 'ECONNREFUSED') {
      errorMessage = language === 'hi' 
        ? 'Ollama सर्वर से कनेक्ट नहीं हो सका। कृपया सुनिश्चित करें कि Ollama चल रहा है।'
        : 'Could not connect to Ollama server. Please ensure Ollama is running.';
      statusCode = 503;
    } else if (error.code === 'ETIMEDOUT') {
      errorMessage = language === 'hi' 
        ? 'अनुरोध समय समाप्त हो गया। कृपया पुनः प्रयास करें।'
        : 'Request timed out. Please try again.';
      statusCode = 504;
    } else if (error.response?.status === 404) {
      errorMessage = language === 'hi' 
        ? `मॉडल '${OLLAMA_MODEL}' नहीं मिला। कृपया मॉडल स्थापित करें।`
        : `Model '${OLLAMA_MODEL}' not found. Please install the model.`;
      statusCode = 404;
    }

    res.status(statusCode).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? (error.response?.data || error.message) : undefined
    });
  }
});

// Health check endpoint
router.get('/health', async (req, res) => {
  try {
    // Check Ollama connectivity
    const ollamaResponse = await axios.get(`${OLLAMA_BASE_URL}/api/tags`, { timeout: 5000 });
    const models = ollamaResponse.data?.models || [];
    const modelExists = models.some(m => m.name.includes(OLLAMA_MODEL));

    res.json({
      success: true,
      message: 'Chatbot service is running',
      ollama: {
        connected: true,
        url: OLLAMA_BASE_URL,
        model: OLLAMA_MODEL,
        modelAvailable: modelExists,
        availableModels: models.map(m => m.name)
      },
      status: modelExists ? 'ready' : 'model not found',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.json({
      success: false,
      message: 'Chatbot service is running but Ollama is not accessible',
      ollama: {
        connected: false,
        url: OLLAMA_BASE_URL,
        error: error.message
      },
      status: 'ollama not available',
      timestamp: new Date().toISOString()
    });
  }
});

// Get supported languages
router.get('/languages', (req, res) => {
  res.json({
    success: true,
    languages: [
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' }
    ]
  });
});

// Get available schemes
router.get('/schemes', (req, res) => {
  const schemes = [
    { id: 1, name: 'Pradhan Mantri Awas Yojana (PMAY)', category: 'Housing' },
    { id: 2, name: 'Pradhan Mantri Jan Dhan Yojana (PMJDY)', category: 'Business' },
    { id: 3, name: 'Ayushman Bharat', category: 'Health' },
    { id: 4, name: 'Pradhan Mantri Kisan Samman Nidhi', category: 'Agriculture' },
    { id: 5, name: 'Beti Bachao Beti Padhao', category: 'Women' },
    { id: 6, name: 'Scholarship for Higher Education', category: 'Education' }
  ];

  res.json({
    success: true,
    schemes
  });
});

module.exports = router;