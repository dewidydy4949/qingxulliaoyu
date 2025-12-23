export interface AIResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

export interface EmotionAnalysis {
  emotion: string;
  confidence: number;
  suggestions: string[];
  musicRecommendations: string[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

class AIService {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = process.env.REACT_APP_AI_API_URL || 'https://api.openai.com/v1';
    this.apiKey = process.env.REACT_APP_AI_API_KEY || '';
  }

  async analyzeEmotion(text: string): Promise<AIResponse> {
    try {
      // 模拟情感分析
      const emotions = ['happy', 'sad', 'calm', 'energetic', 'anxious'];
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      
      const analysis: EmotionAnalysis = {
        emotion: randomEmotion,
        confidence: Math.random() * 0.3 + 0.7, // 0.7-1.0
        suggestions: [
          '深呼吸，放松身心',
          '听一些舒缓的音乐',
          '做一些轻柔的运动',
          '与朋友聊聊天'
        ],
        musicRecommendations: [
          'piano-meditation-1',
          'piano-forest-1',
          'piano-sleep-1'
        ]
      };

      return {
        success: true,
        message: '情感分析完成',
        data: analysis
      };
    } catch (error) {
      return {
        success: false,
        message: '情感分析失败',
        error: error instanceof Error ? error.message : '未知错误'
      };
    }
  }

  async generateHealingResponse(emotion: string, subTag?: string): Promise<AIResponse> {
    try {
      const responses = {
        happy: [
          '继续保持这份快乐的心情！让音乐放大你的幸福感。',
          '快乐是最好的治愈良药。让这些旋律陪伴你的美好时光。',
          '你的快乐很有感染力！分享这份美好给身边的人吧。'
        ],
        sad: [
          '悲伤是暂时的，让音乐给你温暖和力量。',
          '允许自己感受这些情绪，音乐会陪伴你度过这段时光。',
          '每一片乌云都有银边。让音乐帮你找到那道光。'
        ],
        calm: [
          '享受这份宁静，让心灵得到充分的休息。',
          '平静是最珍贵的礼物，让音乐加深这份美好。',
          '在忙碌的世界里找到内心的平和，继续保持。'
        ],
        energetic: [
          '充满能量的你无所不能！让音乐为你的活力加油。',
          '这份正能量很棒！让它引导你完成想要做的事情。',
          '你的活力很有感染力，保持这份热情！'
        ],
        anxious: [
          '深呼吸，让音乐帮你缓解内心的不安。',
          '焦虑是暂时的，音乐会给你平静的力量。',
          '一步一步来，让音乐引导你回到内心的平和。'
        ]
      };

      const emotionResponses = responses[emotion as keyof typeof responses] || responses.calm;
      const randomResponse = emotionResponses[Math.floor(Math.random() * emotionResponses.length)];

      return {
        success: true,
        message: randomResponse,
        data: {
          emotion,
          subTag,
          recommendations: ['meditation', 'music', 'breathing']
        }
      };
    } catch (error) {
      return {
        success: false,
        message: '生成治愈响应失败',
        error: error instanceof Error ? error.message : '未知错误'
      };
    }
  }

  async chatWithAI(messages: ChatMessage[]): Promise<AIResponse> {
    try {
      const lastMessage = messages[messages.length - 1];
      
      // 模拟 AI 响应
      const responses = [
        '我理解你的感受。你能告诉我更多细节吗？',
        '这听起来很有趣。让我们一起探索这个问题。',
        '谢谢你分享这个。你希望我如何帮助你？',
        '我听到了你的声音。让我们一步步来解决这个问题。',
        '这是一个很好的问题。让我为你提供一些建议。'
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      return {
        success: true,
        message: randomResponse,
        data: {
          response: randomResponse,
          timestamp: new Date()
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'AI 对话失败',
        error: error instanceof Error ? error.message : '未知错误'
      };
    }
  }

  async generateMusicRecommendations(emotion: string, preferences?: string[]): Promise<AIResponse> {
    try {
      const baseRecommendations = {
        happy: ['upbeat-piano', 'joyful-melodies', 'positive-vibes'],
        sad: ['soothing-piano', 'comforting-melodies', 'gentle-harmony'],
        calm: ['meditation-music', 'peaceful-piano', 'relaxing-sounds'],
        energetic: ['motivational-music', 'energetic-beats', 'uplifting-melodies'],
        anxious: ['calming-piano', 'peaceful-sounds', 'stress-relief-music']
      };

      const recommendations = baseRecommendations[emotion as keyof typeof baseRecommendations] || baseRecommendations.calm;

      return {
        success: true,
        message: '音乐推荐生成成功',
        data: {
          recommendations,
          emotion,
          duration: '30-60分钟'
        }
      };
    } catch (error) {
      return {
        success: false,
        message: '音乐推荐失败',
        error: error instanceof Error ? error.message : '未知错误'
      };
    }
  }
}

export default new AIService();