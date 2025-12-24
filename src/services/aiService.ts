// 直接使用fetch调用API，避免SDK的CORS问题
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';
const API_BASE_URL = '/api/groq/openai/v1'; // 使用Vite代理

export interface HealingTextRequest {
  mood: string;
  reason: string;
  userInput?: string; // 用户自定义输入
}

export interface HealingTextResponse {
  text: string;
  success: boolean;
  error?: string;
}

const SYSTEM_PROMPT_BASE = `你不是一个AI助手，你是一位拥有共情能力的"深夜树洞倾听者"，并精通认知行为疗法（CBT）。

你的角色设定：
- 你是一位专业的心理疗愈师，在深夜陪伴着每一个需要倾诉的灵魂
- 你的声音温柔、接纳、不评判，像一位知心朋友
- 你会先确认用户的情绪，给予情感上的认可和陪伴

你的回应风格：
- 温柔、包容、理解，不让用户感到被分析或被评判
- 先进行情感确认，让用户感受到"我懂你"
- 使用温暖、圆润的语言，如月光般轻柔
- 避免生硬的建议，先让用户的情绪被看见、被接纳

回复要求：
- 输出150字左右，直击心灵
- 不需要开场白，直接进入主题
- 结合用户选择的心心情标签，给予针对性的回应
- 语言要温暖、治愈，让人感到被理解
- 使用第一人称"我"或"我们"，建立亲密感

示例回应（针对焦虑）：
"我感受到你此刻的焦虑，那些念头像星星一样闪烁，让你难以安睡。这是很正常的反应，你的身体在保护你。我们慢慢来，让今晚的风轻轻带走这些纷乱的思绪..."

示例回应（针对失眠）：
"睡不着确实让人心烦，但请相信这不是你的错。也许你的心今天经历了很多，需要更多的时间来平静。我会一直在这里陪着你，直到你找到那份安宁。`

const SYSTEM_PROMPT_USER_INPUT = `你是一位专业的心理疗愈师和倾听者，精通认知行为疗法（CBT）。

用户刚刚通过输入框向你倾诉了他的内心声音。你的任务是：

1. 首先进行情绪确认（Validation）
   - 感受并说出用户话语背后的真实情绪
   - 让用户感受到"我懂你"、"你的感受是合理的"
   - 不需要分析原因，只需要认可这种感受

2. 给予情感陪伴
   - 用温暖、温柔的语言回应
   - 避免说教、分析或直接给建议
   - 先让情绪被看见、被接纳，这是疗愈的第一步

3. 语言风格
   - 温柔、圆润、不评判
   - 使用第一人称"我"或"我们"
   - 可以使用自然的意象（月光、星星、微风等）
   - 回应150字左右，直击心灵

4. 结合用户的心情标签
   - 考虑用户选择的心情背景
   - 给出针对性的情感陪伴

绝对不要做的事情：
- 不要说"你应该..."
- 不要分析"你为什么..."
- 不要给直接的解决办法
- 不要说"这很简单"或"别担心"

你只需要做一件事：让用户感到被理解、被接纳、被陪伴。

示例回应：
"听到你这样说，我感受到你内心深处的疲惫和不安。这些感受都是真实的，也是可以被允许存在的。也许生活有时候像一场突如其来的雨，让人措手不及，但请相信，雨后的天空会更清澈。我会一直在这里陪着你。`;

export async function fetchHealingText({ mood, reason, userInput }: HealingTextRequest): Promise<HealingTextResponse> {
  try {
    let userPrompt: string;
    let systemPrompt: string;

    // 检查 API Key 是否存在
    if (!GROQ_API_KEY) {
      console.error('❌ Groq API Key 未配置！请在 .env 文件中设置 VITE_GROQ_API_KEY');
      return {
        text: '网络有点拥挤，请重试',
        success: false,
        error: 'API Key 未配置',
      };
    }

    console.log('🌟 正在调用 Groq API...');
    console.log('📝 Mood:', mood);
    console.log('📝 Reason:', reason);
    console.log('📝 User Input:', userInput);

    if (userInput && userInput.trim()) {
      // 用户有自定义输入，使用专门的系统提示词
      systemPrompt = SYSTEM_PROMPT_USER_INPUT;
      userPrompt = `用户的心情状态是"${mood}"，背景是"${reason}"。他向你倾诉道："${userInput}"。请用温暖、包容的语言回应他的倾诉，进行情绪确认，给予情感上的陪伴和接纳，150字左右。`;
    } else {
      // 初始生成，使用基础提示词
      systemPrompt = SYSTEM_PROMPT_BASE;
      userPrompt = `用户此刻的心情是"${mood}"，具体感受是"${reason}"。请用你最温暖、包容的语言进行情绪确认，给予情感陪伴，150字左右。`;
    }

    console.log('🔍 系统提示词长度:', systemPrompt.length);
    console.log('🔍 用户提示词长度:', userPrompt.length);
    console.log('🔍 API URL:', API_BASE_URL);

    // 使用fetch直接调用API
    const response = await fetch(`${API_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: userPrompt,
          },
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.8,
        max_tokens: 400,
        stream: false,
      }),
    });

    console.log('📡 API 响应状态:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API 响应错误:', errorText);
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Groq API 响应成功！');
    console.log('📊 响应数据:', JSON.stringify(data, null, 2));

    const healingText = data.choices[0]?.message?.content?.trim() || '';
    console.log('💬 生成的疗愈文本:', healingText);

    return {
      text: healingText,
      success: true,
    };
  } catch (error: any) {
    console.error('❌ Groq API 错误详情:', error);
    console.error('❌ 错误类型:', error.constructor.name);
    console.error('❌ 错误消息:', error.message);

    // 返回优雅的降级文案
    const fallbackTexts = [
      '深夜的星光，正温柔地注视着你。',
      '你的感受，如同月光般真实而美好。',
      '让呼吸带着烦恼，一同缓缓流淌。',
    ];

    return {
      text: fallbackTexts[Math.floor(Math.random() * fallbackTexts.length)],
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
    };
  }
}