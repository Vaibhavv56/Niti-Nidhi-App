import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

// Hardcoded demo responses
const demoResponses = {
  en: {
    schemes: {
      keywords: ['schemes', 'scheme', 'list', 'tell me', 'show', 'available', 'what are'],
      response: `Here are some popular government schemes:

1. PM-KISAN - Direct income support to farmers
2. Ayushman Bharat - Health insurance for poor families
3. Sukanya Samriddhi Yojana - Savings scheme for girl child
4. PM Awas Yojana - Housing for all
5. Pradhan Mantri Mudra Yojana - Financial support for small businesses

Would you like to know more about any specific scheme?`
    },
    pmkisan: {
      keywords: ['pm-kisan', 'pm kisan', 'kisan', 'farmer', 'agriculture'],
      response: `PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)

Eligibility:
- All landholding farmers
- Must have valid Aadhaar card
- Bank account linked to Aadhaar

Benefits:
- ₹6,000 per year in 3 installments
- Direct transfer to bank account

How to Apply:
1. Visit PM-KISAN portal
2. Register with Aadhaar number
3. Provide land details
4. Submit online application

For more details, visit: pmkisan.gov.in`
    },
    ayushman: {
      keywords: ['ayushman', 'health', 'insurance', 'medical', 'hospital'],
      response: `Ayushman Bharat (PM-JAY)

Eligibility:
- Bottom 40% of population (SECC data)
- Annual income below ₹5 lakh
- No upper age limit

Benefits:
- Health cover of ₹5 lakh per family/year
- Cashless treatment at empanelled hospitals
- Covers 1,400+ medical procedures

How to Apply:
1. Check eligibility at pmjay.gov.in
2. Visit nearest Ayushman Mitra
3. Provide Aadhaar and family details
4. Get your card instantly`
    },
    sukanya: {
      keywords: ['sukanya', 'girl', 'daughter', 'savings', 'education'],
      response: `Sukanya Samriddhi Yojana

Eligibility:
- Girl child below 10 years
- Parents or legal guardian can open account
- Maximum 2 accounts per family

Benefits:
- High interest rate (currently 8.2%)
- Tax benefits under 80C
- Maturity after girl turns 21

How to Apply:
1. Visit any post office or authorized bank
2. Fill account opening form
3. Submit girl's birth certificate
4. Minimum deposit: ₹250`
    },
    awas: {
      keywords: ['awas', 'house', 'housing', 'home', 'construction'],
      response: `PM Awas Yojana (Housing for All)

Eligibility:
- EWS/LIG/MIG income groups
- Should not own pucca house
- No family member should have availed Central assistance

Benefits:
- Subsidy on home loan interest
- Direct financial assistance up to ₹2.5 lakh
- Affordable housing units

How to Apply:
1. Visit pmaymis.gov.in
2. Register with Aadhaar
3. Fill online application
4. Submit required documents`
    },
    mudra: {
      keywords: ['mudra', 'loan', 'business', 'startup', 'entrepreneur'],
      response: `Pradhan Mantri Mudra Yojana

Eligibility:
- Non-corporate, non-farm enterprises
- New or existing small businesses
- No collateral required

Benefits:
Three categories of loans:
- Shishu: up to ₹50,000
- Kishore: ₹50,000 to ₹5 lakh
- Tarun: ₹5 lakh to ₹10 lakh

How to Apply:
1. Approach any bank/NBFC/MFI
2. Submit business plan
3. Provide KYC documents
4. Get loan approval`
    },
    default: {
      keywords: [],
      response: `I can help you with information about government schemes. You can ask me:
- "Tell me about different schemes"
- "Explain PM-KISAN"
- "What is Ayushman Bharat?"
- "Tell me about Sukanya Samriddhi Yojana"
- "Explain PM Awas Yojana"
- "What is Mudra loan?"

How can I assist you?`
    }
  },
  hi: {
    schemes: {
      keywords: ['योजना', 'योजनाएं', 'बताओ', 'दिखाओ', 'कौन कौन', 'सरकारी'],
      response: `यहाँ कुछ लोकप्रिय सरकारी योजनाएं हैं:

1. पीएम-किसान - किसानों के लिए प्रत्यक्ष आय सहायता
2. आयुष्मान भारत - गरीब परिवारों के लिए स्वास्थ्य बीमा
3. सुकन्या समृद्धि योजना - बालिकाओं के लिए बचत योजना
4. पीएम आवास योजना - सभी के लिए आवास
5. प्रधानमंत्री मुद्रा योजना - छोटे व्यवसायों के लिए वित्तीय सहायता

क्या आप किसी विशेष योजना के बारे में जानना चाहेंगे?`
    },
    pmkisan: {
      keywords: ['किसान', 'पीएम-किसान', 'कृषि', 'खेती'],
      response: `पीएम-किसान (प्रधानमंत्री किसान सम्मान निधि)

पात्रता:
- सभी भूमिधारक किसान
- वैध आधार कार्ड होना चाहिए
- बैंक खाता आधार से लिंक होना चाहिए

लाभ:
- प्रति वर्ष ₹6,000 तीन किस्तों में
- बैंक खाते में सीधा हस्तांतरण

आवेदन कैसे करें:
1. PM-KISAN पोर्टल पर जाएं
2. आधार नंबर से रजिस्टर करें
3. भूमि विवरण प्रदान करें
4. ऑनलाइन आवेदन जमा करें

अधिक जानकारी के लिए: pmkisan.gov.in`
    },
    ayushman: {
      keywords: ['आयुष्मान', 'स्वास्थ्य', 'बीमा', 'चिकित्सा', 'अस्पताल'],
      response: `आयुष्मान भारत (PM-JAY)

पात्रता:
- जनसंख्या का निचला 40% (SECC डेटा)
- वार्षिक आय ₹5 लाख से कम
- कोई आयु सीमा नहीं

लाभ:
- प्रति परिवार/वर्ष ₹5 लाख का स्वास्थ्य कवर
- सूचीबद्ध अस्पतालों में कैशलेस उपचार
- 1,400+ चिकित्सा प्रक्रियाएं शामिल

आवेदन कैसे करें:
1. pmjay.gov.in पर पात्रता जांचें
2. निकटतम आयुष्मान मित्र से मिलें
3. आधार और परिवार विवरण दें
4. तुरंत अपना कार्ड प्राप्त करें`
    },
    sukanya: {
      keywords: ['सुकन्या', 'बेटी', 'बालिका', 'बचत', 'शिक्षा'],
      response: `सुकन्या समृद्धि योजना

पात्रता:
- 10 वर्ष से कम उम्र की बालिका
- माता-पिता या कानूनी अभिभावक खाता खोल सकते हैं
- प्रति परिवार अधिकतम 2 खाते

लाभ:
- उच्च ब्याज दर (वर्तमान में 8.2%)
- 80C के तहत कर लाभ
- बालिका के 21 वर्ष की होने पर परिपक्वता

आवेदन कैसे करें:
1. किसी भी डाकघर या अधिकृत बैंक में जाएं
2. खाता खोलने का फॉर्म भरें
3. बालिका का जन्म प्रमाण पत्र जमा करें
4. न्यूनतम जमा: ₹250`
    },
    awas: {
      keywords: ['आवास', 'घर', 'मकान', 'निर्माण'],
      response: `पीएम आवास योजना (सभी के लिए आवास)

पात्रता:
- EWS/LIG/MIG आय समूह
- पक्का मकान नहीं होना चाहिए
- किसी परिवार के सदस्य ने केंद्रीय सहायता का लाभ नहीं उठाया हो

लाभ:
- गृह ऋण ब्याज पर सब्सिडी
- ₹2.5 लाख तक प्रत्यक्ष वित्तीय सहायता
- किफायती आवास इकाइयां

आवेदन कैसे करें:
1. pmaymis.gov.in पर जाएं
2. आधार से रजिस्टर करें
3. ऑनलाइन आवेदन भरें
4. आवश्यक दस्तावेज जमा करें`
    },
    mudra: {
      keywords: ['मुद्रा', 'ऋण', 'लोन', 'व्यवसाय', 'बिजनेस'],
      response: `प्रधानमंत्री मुद्रा योजना

पात्रता:
- गैर-कॉर्पोरेट, गैर-कृषि उद्यम
- नया या मौजूदा छोटा व्यवसाय
- कोई संपार्श्विक आवश्यक नहीं

लाभ:
ऋण की तीन श्रेणियां:
- शिशु: ₹50,000 तक
- किशोर: ₹50,000 से ₹5 लाख
- तरुण: ₹5 लाख से ₹10 लाख

आवेदन कैसे करें:
1. किसी भी बैंक/NBFC/MFI से संपर्क करें
2. व्यवसाय योजना प्रस्तुत करें
3. KYC दस्तावेज़ प्रदान करें
4. ऋण स्वीकृति प्राप्त करें`
    },
    default: {
      keywords: [],
      response: `मैं आपको सरकारी योजनाओं के बारे में जानकारी देने में मदद कर सकता हूं। आप मुझसे पूछ सकते हैं:
- "विभिन्न योजनाओं के बारे में बताओ"
- "पीएम-किसान समझाओ"
- "आयुष्मान भारत क्या है?"
- "सुकन्या समृद्धि योजना के बारे में बताओ"
- "पीएम आवास योजना समझाओ"
- "मुद्रा लोन क्या है?"

मैं आपकी कैसे सहायता कर सकता हूं?`
    }
  }
};

const ChatbotScreen = ({ onBack }) => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'Hello! I am your government schemes assistant. How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
      language: 'en'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState('en');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  useEffect(() => {
    const welcomeMessages = {
      en: 'Hello! I am your government schemes assistant. How can I help you today?',
      hi: 'नमस्ते! मैं आपका सरकारी योजना सहायक हूं। आज मैं आपकी कैसे मदद कर सकता हूं?'
    };

    setMessages([{
      id: '1',
      text: welcomeMessages[language],
      sender: 'bot',
      timestamp: new Date(),
      language: language
    }]);
  }, [language]);

  const findBestResponse = (userMessage, lang) => {
    const msg = userMessage.toLowerCase();
    const responses = demoResponses[lang];

    // Check each category for keyword matches
    for (const [key, value] of Object.entries(responses)) {
      if (key === 'default') continue;
      
      const hasMatch = value.keywords.some(keyword => 
        msg.includes(keyword.toLowerCase())
      );
      
      if (hasMatch) {
        return value.response;
      }
    }

    return responses.default.response;
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date(),
      language: language
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    // Simulate processing delay for realistic demo
    setTimeout(() => {
      const botResponse = findBestResponse(userMessage.text, language);
      
      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
        language: language
      };

      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const speakText = (text) => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
      return;
    }

    const languageCode = language === 'hi' ? 'hi-IN' : 'en-US';

    Speech.speak(text, {
      language: languageCode,
      pitch: 1.0,
      rate: 0.9,
      onStart: () => setIsSpeaking(true),
      onDone: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
      onError: () => {
        setIsSpeaking(false);
        Alert.alert(
          language === 'hi' ? 'त्रुटि' : 'Error',
          language === 'hi' 
            ? 'ऑडियो चलाने में समस्या हुई।'
            : 'Failed to play audio.'
        );
      }
    });
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'hi' : 'en');
    Speech.stop();
    setIsSpeaking(false);
  };

  const clearChat = () => {
    Alert.alert(
      language === 'hi' ? 'चैट साफ़ करें' : 'Clear Chat',
      language === 'hi' 
        ? 'क्या आप सभी संदेश हटाना चाहते हैं?'
        : 'Do you want to delete all messages?',
      [
        {
          text: language === 'hi' ? 'रद्द करें' : 'Cancel',
          style: 'cancel'
        },
        {
          text: language === 'hi' ? 'हटाएं' : 'Delete',
          onPress: () => {
            const welcomeMessages = {
              en: 'Hello! I am your government schemes assistant. How can I help you today?',
              hi: 'नमस्ते! मैं आपका सरकारी योजना सहायक हूं। आज मैं आपकी कैसे मदद कर सकता हूं?'
            };

            setMessages([{
              id: '1',
              text: welcomeMessages[language],
              sender: 'bot',
              timestamp: new Date(),
              language: language
            }]);
            Speech.stop();
            setIsSpeaking(false);
          },
          style: 'destructive'
        }
      ]
    );
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Ionicons name="chatbubbles" size={24} color="#fff" />
          <Text style={styles.headerTitle}>
            {language === 'hi' ? 'सरकारी योजना सहायक' : 'Scheme Assistant'}
          </Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={toggleLanguage}
          >
            <Text style={styles.languageText}>
              {language === 'en' ? 'अ' : 'A'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={clearChat}
          >
            <Ionicons name="trash-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages Area with Keyboard Avoiding */}
      <KeyboardAvoidingView
        style={styles.contentContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageWrapper,
                message.sender === 'user' ? styles.userMessageWrapper : styles.botMessageWrapper
              ]}
            >
              <View
                style={[
                  styles.messageBubble,
                  message.sender === 'user' ? styles.userMessage : styles.botMessage
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    message.sender === 'user' ? styles.userMessageText : styles.botMessageText
                  ]}
                >
                  {message.text}
                </Text>
                <Text
                  style={[
                    styles.timestamp,
                    message.sender === 'user' ? styles.userTimestamp : styles.botTimestamp
                  ]}
                >
                  {formatTime(message.timestamp)}
                </Text>
              </View>
              {message.sender === 'bot' && (
                <TouchableOpacity
                  style={styles.speakerButton}
                  onPress={() => speakText(message.text)}
                >
                  <Ionicons
                    name={isSpeaking ? "volume-high" : "volume-medium-outline"}
                    size={20}
                    color="#6366f1"
                  />
                </TouchableOpacity>
              )}
            </View>
          ))}
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#6366f1" />
              <Text style={styles.loadingText}>
                {language === 'hi' ? 'टाइप कर रहा है...' : 'Typing...'}
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder={
              language === 'hi'
                ? 'अपना प्रश्न लिखें...'
                : 'Type your question...'
            }
            placeholderTextColor="#9ca3af"
            multiline
            maxLength={500}
            editable={!isLoading}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!inputText.trim() || isLoading) && styles.sendButtonDisabled
            ]}
            onPress={sendMessage}
            disabled={!inputText.trim() || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="send" size={20} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#6366f1',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: Platform.OS === 'ios' ? 50 : 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  backButton: {
    padding: 4,
    marginRight: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    padding: 6,
  },
  languageText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  contentContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  messageWrapper: {
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  userMessageWrapper: {
    justifyContent: 'flex-end',
  },
  botMessageWrapper: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  userMessage: {
    backgroundColor: '#6366f1',
    borderBottomRightRadius: 4,
  },
  botMessage: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  userMessageText: {
    color: '#fff',
  },
  botMessageText: {
    color: '#1f2937',
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
  },
  userTimestamp: {
    color: '#e0e7ff',
    textAlign: 'right',
  },
  botTimestamp: {
    color: '#9ca3af',
  },
  speakerButton: {
    marginLeft: 8,
    padding: 8,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 16,
    maxWidth: '80%',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6b7280',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  input: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingTop: 10,
    fontSize: 15,
    maxHeight: 100,
    color: '#1f2937',
  },
  sendButton: {
    backgroundColor: '#6366f1',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#c7d2fe',
  },
});

export default ChatbotScreen;