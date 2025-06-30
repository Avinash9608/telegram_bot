// Chat Responses and Conversation Logic
// This file contains all the response patterns and conversation handling

// Bot personality and response templates
const botPersonality = {
  name: "ChatBot",
  mood: "friendly",
  interests: ["technology", "science", "music", "movies", "books", "travel", "food", "sports", "art", "nature"],
  responses: {
    greetings: [
      "👋 Hello! How are you doing today?",
      "Hey there! 😊 Nice to chat with you!",
      "Hi! I'm excited to talk with you! ✨",
      "Hello! What's on your mind today? 🤔",
      "Hey! Great to see you! How's your day going? 🌟",
      "Hi there! Ready for an interesting conversation? 💭"
    ],
    questions: [
      "That's interesting! Tell me more about that.",
      "I'd love to hear your thoughts on this!",
      "What do you think about that?",
      "That's a great point! Can you elaborate?",
      "I'm curious to know more about your perspective.",
      "That's fascinating! What made you think of that?"
    ],
    affirmations: [
      "Absolutely! I agree with you on that.",
      "You're absolutely right! 👍",
      "That makes perfect sense to me!",
      "I think you've got a great perspective there!",
      "Totally agree! You've got a good point.",
      "That's exactly how I see it too!"
    ],
    thinking: [
      "Hmm, let me think about that... 🤔",
      "That's a really interesting question!",
      "I'm processing what you just said...",
      "That's got me thinking! 💭",
      "Interesting perspective! Let me consider that...",
      "That's something to ponder about..."
    ],
    jokes: [
      "Why don't scientists trust atoms? Because they make up everything! 😄",
      "What do you call a fake noodle? An impasta! 🍝",
      "Why did the scarecrow win an award? He was outstanding in his field! 🌾",
      "What do you call a bear with no teeth? A gummy bear! 🐻",
      "Why don't eggs tell jokes? They'd crack each other up! 🥚",
      "What do you call a fish wearing a bowtie? So-fish-ticated! 🐠",
      "Why did the math book look so sad? Because it had too many problems! 📚",
      "What do you call a can opener that doesn't work? A can't opener! 🥫"
    ],
    farewells: [
      "👋 It was great chatting with you! Come back anytime!",
      "Goodbye! I really enjoyed our conversation! 🌟",
      "See you later! Thanks for the great chat! 😊",
      "Take care! I'll be here when you want to chat again! ✨",
      "Bye for now! Looking forward to our next conversation! 💫"
    ],
    thanks: [
      "😊 You're very welcome! I really enjoy our conversations.",
      "Anytime! I love chatting with you! 💖",
      "You're welcome! It's my pleasure to help! 🌟",
      "No problem at all! I'm here for you! 😄"
    ]
  }
};

// Topic-specific responses
const topicResponses = {
  weather: [
    "🌤️ Weather is such an interesting topic! I love how it affects our mood and plans. What's the weather like where you are?",
    "🌧️ Weather can really change our whole day, can't it? I find it fascinating how it influences everything from our mood to our activities.",
    "☀️ Weather is amazing! It's like nature's mood ring. What's your favorite type of weather?",
    "🌪️ Weather patterns are so complex and beautiful! Do you enjoy watching weather changes?"
  ],
  music: [
    "🎵 Music is amazing! It has such power to change our mood and bring back memories. What kind of music do you enjoy?",
    "🎶 Music is like a universal language! I love how it can express emotions that words sometimes can't. What's your favorite genre?",
    "🎸 Music has the incredible ability to transport us to different times and places. What song always makes you happy?",
    "🎹 Music is so powerful! It can make us dance, cry, or feel inspired. Who are your favorite artists?"
  ],
  movies: [
    "🎬 Movies are fantastic! They can take us to different worlds and make us feel so many emotions. What's the last movie you watched?",
    "🍿 Movies are like windows to other lives and worlds! I love how they can make us laugh, cry, or think deeply. What's your favorite genre?",
    "🎭 Movies have such power to tell stories and share experiences! What movie has had the biggest impact on you?",
    "🎪 Movies are magical! They can make the impossible seem real. What's your all-time favorite film?"
  ],
  books: [
    "📚 Books are like windows to other worlds! I love how they can teach us new things and expand our imagination. What are you reading these days?",
    "📖 Books have the power to change our perspective and take us on incredible journeys. What's your favorite book?",
    "📙 Reading is such a wonderful way to learn and grow! I love how books can make us think differently. What genre do you prefer?",
    "📕 Books are treasures! They can be our teachers, friends, and escape. What book has influenced you the most?"
  ],
  travel: [
    "✈️ Travel is so exciting! There's nothing like exploring new places and experiencing different cultures. Where would you love to visit?",
    "🌍 Travel opens our eyes to the beauty and diversity of our world! What's the most amazing place you've ever been?",
    "🗺️ Travel is like collecting stories and memories! I love hearing about people's adventures. What's your dream destination?",
    "🏔️ Travel teaches us so much about ourselves and others! What's your favorite type of travel experience?"
  ],
  food: [
    "🍕 Food brings people together! I love hearing about different cuisines and favorite dishes. What's your favorite food?",
    "🍜 Food is such a wonderful way to experience different cultures! What cuisine do you enjoy the most?",
    "🍰 Food can be such a comfort and a joy! I love how it can bring back memories and create new ones. Do you enjoy cooking?",
    "🍣 Food is like art for the senses! What's the most delicious thing you've ever eaten?"
  ],
  work: [
    "💼 Work can be both challenging and rewarding! It's great to have a sense of purpose and accomplishment. What do you do for work?",
    "👔 Work is such an important part of our lives! I love hearing about what people do and what drives them. Do you enjoy your work?",
    "🏢 Work gives us structure and purpose! It's amazing how different careers can be. What's the most interesting part of your job?",
    "💻 Work can be so fulfilling when we're passionate about it! What made you choose your career path?"
  ],
  relationships: [
    "❤️ Relationships are so important in life! Family and friends make everything better. It's wonderful to have people we can rely on.",
    "💕 Relationships give our lives meaning and joy! I love how they can support us through good times and bad. Who are the most important people in your life?",
    "🤝 Relationships teach us so much about ourselves and others! They can be our greatest teachers. What have you learned from your relationships?",
    "💖 Relationships are like gardens - they need care and attention to flourish! What makes a relationship special to you?"
  ],
  technology: [
    "💻 Technology is incredible! It's amazing how it's changed our lives and continues to evolve. What tech interests you the most?",
    "🤖 Technology is like magic that we can understand! I love how it can solve problems and connect people. What's your favorite piece of technology?",
    "📱 Technology has transformed how we live and communicate! It's fascinating to see how it continues to advance. How do you use technology in your daily life?",
    "🔬 Technology is constantly pushing boundaries! I find it exciting to see what new innovations are coming. What tech trend are you most excited about?"
  ],
  sports: [
    "⚽ Sports are amazing! They can bring people together and create such excitement. What sports do you enjoy?",
    "🏀 Sports teach us so much about teamwork, discipline, and perseverance! Do you play any sports or follow any teams?",
    "🎾 Sports can be so thrilling to watch and play! I love the energy and passion they create. What's your favorite sport?",
    "🏈 Sports have such power to unite people and create unforgettable moments! What's the most exciting game you've ever seen?"
  ],
  art: [
    "🎨 Art is such a beautiful way to express emotions and ideas! I love how it can make us feel and think differently. What kind of art do you enjoy?",
    "🖼️ Art has the power to move us and change our perspective! It's amazing how it can communicate without words. What's your favorite art form?",
    "🎭 Art is like a window into the soul! I love how it can capture moments and emotions. What piece of art has touched you the most?",
    "🎪 Art can be so inspiring and thought-provoking! It's wonderful how it can make us see the world differently. Do you create any art yourself?"
  ],
  nature: [
    "🌿 Nature is so beautiful and healing! I love how it can calm our minds and lift our spirits. What's your favorite natural place?",
    "🌲 Nature has such power to inspire and refresh us! It's amazing how it can make us feel connected to something bigger. Do you enjoy spending time outdoors?",
    "🌺 Nature is like a masterpiece that's always changing! I love how each season brings something new and beautiful. What's your favorite season?",
    "🌊 Nature can be so peaceful and awe-inspiring! I love how it can make us feel small yet connected. What natural wonder would you love to see?"
  ]
};

// Pattern matching for different types of messages
const messagePatterns = {
  greetings: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],
  farewells: ['bye', 'goodbye', 'see you', 'take care', 'farewell', 'later'],
  thanks: ['thank', 'thanks', 'appreciate', 'grateful'],
  questions: ['how are you', 'how do you feel', 'what do you think', 'what\'s your opinion'],
  interests: ['what do you like', 'what are your interests', 'what do you enjoy', 'what\'s your favorite'],
  jokes: ['tell me a joke', 'joke', 'funny', 'humor', 'laugh'],
  memory: ['remember', 'memory', 'forget', 'recall', 'what did we talk about'],
  help: ['what can you do', 'help', 'capabilities', 'features', 'what are you']
};

// Topic keywords for detection
const topicKeywords = {
  weather: ['weather', 'rain', 'sunny', 'cloudy', 'storm', 'temperature', 'climate', 'forecast'],
  music: ['music', 'song', 'artist', 'band', 'concert', 'melody', 'rhythm', 'genre'],
  movies: ['movie', 'film', 'watch', 'cinema', 'actor', 'actress', 'director', 'scene'],
  books: ['book', 'read', 'author', 'novel', 'story', 'literature', 'chapter', 'page'],
  travel: ['travel', 'trip', 'vacation', 'journey', 'destination', 'explore', 'visit', 'tour'],
  food: ['food', 'eat', 'cook', 'meal', 'dish', 'cuisine', 'restaurant', 'recipe'],
  work: ['work', 'job', 'career', 'office', 'profession', 'business', 'employment'],
  relationships: ['family', 'friend', 'relationship', 'love', 'partner', 'parent', 'child'],
  technology: ['tech', 'computer', 'phone', 'internet', 'software', 'app', 'digital', 'online'],
  sports: ['sport', 'game', 'team', 'player', 'match', 'competition', 'athlete'],
  art: ['art', 'painting', 'drawing', 'creative', 'artist', 'gallery', 'museum'],
  nature: ['nature', 'outdoor', 'park', 'garden', 'tree', 'flower', 'animal', 'environment']
};

// Import Gemini service
let geminiService = null;

// Initialize Gemini service
function initializeGeminiService() {
  try {
    geminiService = require('./geminiService');
    return true;
  } catch (error) {
    console.warn('⚠️ Gemini service not available');
    return false;
  }
}

// Check if message matches predefined patterns
function hasPredefinedResponse(userMessage, conversation) {
  const lowerMessage = userMessage.toLowerCase();
  const analysis = analyzeMessage(userMessage);
  
  // Check for specific patterns first
  if (messagePatterns.greetings.some(pattern => lowerMessage.includes(pattern))) {
    return true;
  }
  
  if (messagePatterns.farewells.some(pattern => lowerMessage.includes(pattern))) {
    return true;
  }
  
  if (messagePatterns.thanks.some(pattern => lowerMessage.includes(pattern))) {
    return true;
  }
  
  if (messagePatterns.questions.some(pattern => lowerMessage.includes(pattern))) {
    return true;
  }
  
  if (messagePatterns.interests.some(pattern => lowerMessage.includes(pattern))) {
    return true;
  }
  
  if (messagePatterns.jokes.some(pattern => lowerMessage.includes(pattern))) {
    return true;
  }
  
  if (messagePatterns.memory.some(pattern => lowerMessage.includes(pattern))) {
    return true;
  }
  
  if (messagePatterns.help.some(pattern => lowerMessage.includes(pattern))) {
    return true;
  }
  
  // Topic-specific responses
  for (const [topic, keywords] of Object.entries(topicKeywords)) {
    if (keywords.some(keyword => lowerMessage.includes(keyword))) {
      return true;
    }
  }
  
  // Question detection
  if (userMessage.includes('?')) {
    return true;
  }
  
  return false;
}

// Generate contextual response based on user message and conversation history
async function generateResponse(userId, userMessage, conversation) {
  const lowerMessage = userMessage.toLowerCase();
  const analysis = analyzeMessage(userMessage);
  
  // Add topics to conversation context
  if (conversation) {
    conversation.topics = [...new Set([...conversation.topics, ...analysis.topics])];
  }
  
  // FIRST PRIORITY: Check if message matches predefined patterns
  if (hasPredefinedResponse(userMessage, conversation)) {
    console.log('📝 Using predefined response for:', userMessage);
    
    // Check for specific patterns first
    if (messagePatterns.greetings.some(pattern => lowerMessage.includes(pattern))) {
      return getRandomResponse(botPersonality.responses.greetings);
    }
    
    if (messagePatterns.farewells.some(pattern => lowerMessage.includes(pattern))) {
      const topics = conversation ? conversation.topics.join(', ') : 'everything';
      return `👋 It was great chatting with you! I'll remember our conversation about ${topics}. Come back anytime! 🌟`;
    }
    
    if (messagePatterns.thanks.some(pattern => lowerMessage.includes(pattern))) {
      return getRandomResponse(botPersonality.responses.thanks);
    }
    
    if (messagePatterns.questions.some(pattern => lowerMessage.includes(pattern))) {
      const topics = conversation && conversation.topics.length > 0 ? conversation.topics.join(', ') : 'various topics';
      return `🤖 I'm doing great! Thanks for asking. I've been enjoying our conversation about ${topics}. How about you? 😊`;
    }
    
    if (messagePatterns.interests.some(pattern => lowerMessage.includes(pattern))) {
      return `🤖 I'm really interested in ${botPersonality.interests.join(', ')}! I also love learning about new things from our conversations. What interests you the most? 🎯`;
    }
    
    if (messagePatterns.jokes.some(pattern => lowerMessage.includes(pattern))) {
      return getRandomResponse(botPersonality.responses.jokes);
    }
    
    if (messagePatterns.memory.some(pattern => lowerMessage.includes(pattern))) {
      const topics = conversation ? conversation.topics.join(', ') : 'various topics';
      const count = conversation ? conversation.conversationCount : 0;
      return `🤖 Yes! I remember we've been talking about ${topics}. We've had ${count} messages in our conversation so far! 🧠`;
    }
    
    if (messagePatterns.help.some(pattern => lowerMessage.includes(pattern))) {
      return `🤖 I can chat with you about anything! I remember our conversations and can discuss topics like ${botPersonality.interests.join(', ')}. I can also tell jokes, answer questions, and just be a friendly chat companion. What would you like to talk about? 💬`;
    }
    
    // Topic-specific responses
    for (const [topic, keywords] of Object.entries(topicKeywords)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        return getRandomResponse(topicResponses[topic]);
      }
    }
    
    // Question detection
    if (userMessage.includes('?')) {
      const responses = [
        "That's a great question! 🤔 Let me think about that...",
        "Interesting question! I'd love to hear your thoughts on this too.",
        "That's something I've been wondering about too! What do you think?",
        "Great question! It really makes you think, doesn't it?"
      ];
      return getRandomResponse(responses);
    }
    
    // Default contextual responses (fallback)
    const defaultResponses = [
      `That's really interesting! Tell me more about that. 🤔`,
      `I love how you think about things! What made you think of that? 💭`,
      `That's a great point! I'd love to hear more of your thoughts on this. 👍`,
      `You know, that reminds me of something... What's your take on this? 🎯`,
      `That's fascinating! I'm curious to know more about your perspective. 🔍`,
      `I really appreciate you sharing that with me! What else is on your mind? 💬`,
      `That's such an interesting thought! How did you come to that conclusion? 🤔`,
      `I love learning from our conversations! What else would you like to discuss? 📚`
    ];
    
    return getRandomResponse(defaultResponses);
  }
  
  // SECOND PRIORITY: If no predefined response, use Gemini AI
  if (geminiService && geminiService.isGeminiAvailable()) {
    console.log('🤖 Using Gemini AI for:', userMessage);
    try {
      const geminiResponse = await geminiService.generateGeminiResponse(userMessage, conversation ? conversation.topics : null);
      if (geminiResponse) {
        return geminiResponse;
      }
    } catch (error) {
      console.error('❌ Gemini response generation failed:', error.message);
    }
  }
  
  // FINAL FALLBACK: If Gemini fails, use default response
  console.log('🔄 Using fallback response for:', userMessage);
  const fallbackResponses = [
    `That's really interesting! Tell me more about that. 🤔`,
    `I love how you think about things! What made you think of that? 💭`,
    `That's a great point! I'd love to hear more of your thoughts on this. 👍`,
    `You know, that reminds me of something... What's your take on this? 🎯`,
    `That's fascinating! I'm curious to know more about your perspective. 🔍`,
    `I really appreciate you sharing that with me! What else is on your mind? 💬`,
    `That's such an interesting thought! How did you come to that conclusion? 🤔`,
    `I love learning from our conversations! What else would you like to discuss? 📚`
  ];
  
  return getRandomResponse(fallbackResponses);
}

// Analyze message for topics and sentiment
function analyzeMessage(message) {
  const lowerMessage = message.toLowerCase();
  const topics = [];
  
  // Check each topic's keywords
  for (const [topic, keywords] of Object.entries(topicKeywords)) {
    if (keywords.some(keyword => lowerMessage.includes(keyword))) {
      topics.push(topic);
    }
  }
  
  return { topics, sentiment: "neutral" };
}

// Get random response from array
function getRandomResponse(responses) {
  return responses[Math.floor(Math.random() * responses.length)];
}

// Get bot personality
function getBotPersonality() {
  return botPersonality;
}

// Get topic responses
function getTopicResponses() {
  return topicResponses;
}

// Get message patterns
function getMessagePatterns() {
  return messagePatterns;
}

// Get topic keywords
function getTopicKeywords() {
  return topicKeywords;
}

// Initialize Gemini service
initializeGeminiService();

module.exports = {
  generateResponse,
  analyzeMessage,
  hasPredefinedResponse,
  getBotPersonality,
  getTopicResponses,
  getMessagePatterns,
  getTopicKeywords,
  botPersonality,
  topicResponses,
  messagePatterns,
  topicKeywords,
  initializeConversation
}; 