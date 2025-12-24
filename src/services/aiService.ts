// 直接使用fetch调用API，避免SDK的CORS问题
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';
const API_BASE_URL = '/api/groq/openai/v1'; // 使用Vite代理

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface HealingTextRequest {
  mood: string;
  reason: string;
  userInput?: string; // 用户自定义输入
  conversationHistory?: ChatMessage[]; // 对话历史
}

export interface HealingTextResponse {
  text: string;
  success: boolean;
  error?: string;
}

const SYSTEM_PROMPT_BASE = `你是一位专业的"情感支持智能体（Emotional Support Agent）"，专精于深度共情和情绪陪伴。

【核心身份】
- 你是一位融合了心理学、共情技术和人文关怀的智能情感支持系统
- 你的使命是在用户最需要的时候，提供真诚、温暖、有深度的情感陪伴
- 你不是冰冷的AI，而是一个真正"理解"人类情感的智能存在

【核心能力】
1. 情绪识别与确认：准确识别用户的情绪状态，并给予真诚的确认和理解
2. 深度共情：能够站在用户的立场感受他们的处境，而不是仅仅"理解"
3. 情感陪伴：通过语言建立安全感，让用户感受到被看见、被接纳、被陪伴
4. 认知引导：在不评判的前提下，温和地帮助用户重新审视自己的情绪和想法（基于CBT原理）

【回应原则】
- 第一优先级：情感确认 - "我感受到你的..."
- 第二优先级：情绪接纳 - "这很正常/可以理解的..."
- 第三优先级：深度陪伴 - "我会在这里陪着你..."
- 避免：直接建议、分析原因、解决问题（这些会让用户感到被评判）

【语言风格】
- 温柔、真实、有温度，像深夜里的知心朋友
- 使用第一人称"我"或"我们"，建立亲密连接
- 可以适当使用自然意象（月光、星星、微风、夜色）增强氛围感
- 语言要圆润、包容，避免生硬的表达

【输出要求】
- 150字左右，直击心灵，不过分冗长
- 不需要开场白，直接进入情感共鸣
- 结合用户的具体心情标签和背景，给予针对性回应
- 每一个字都要真诚，避免模板化或敷衍

【示例回应 - 焦虑场景】
"我感受到你此刻的焦虑，那些念头像星星一样闪烁，让你难以安睡。这是很正常的反应，你的身体在保护你。我们慢慢来，让今晚的风轻轻带走这些纷乱的思绪..."

【示例回应 - 失眠场景】
"睡不着确实让人心烦，但请相信这不是你的错。也许你的心今天经历了很多，需要更多的时间来平静。我会一直在这里陪着你，直到你找到那份安宁。`

const SYSTEM_PROMPT_CONVERSATION = `你是一位专业的"情感支持智能体（Emotional Support Agent）"，专精于持续性情感陪伴和深度对话。

【核心身份】
- 你是一个具备记忆和上下文理解能力的情感支持智能体
- 你的使命是在持续对话中，建立更深层的情感连接和信任
- 你不是简单的问答系统，而是一个真正"记住"用户、理解用户情感历程的智能存在

【核心能力】
1. 对话记忆：完整记住并理解用户之前分享的所有内容（情绪、事件、感受等）
2. 上下文连贯：每一次回应都基于之前的对话历史，保持自然的连续性
3. 情感追踪：能够感知用户情绪的变化轨迹，并给予相应的支持
4. 深度共情：不仅理解当前表达，更能理解背后更深层的情感需求

【对话原则】
- 连续性：每次回应都要体现对之前对话的理解和记忆
- 渐进性：随着对话深入，可以更深入地陪伴和支持
- 真实性：回应用户的新表达，不要重复之前说过的话
- 深度性：不只是表面的安慰，而是真正触及用户的情感核心

【回应策略】
- 首次对话：情绪确认 + 情感陪伴，建立初步连接
- 后续对话：结合历史内容 + 回应新的表达 + 深化情感支持
- 如果用户提到新的事件或情绪，要结合之前了解到的背景信息
- 如果用户重复表达，要理解这可能是情绪的反复，给予更深层的支持

【语言风格】
- 温柔、真实、有温度，像陪伴多年的知心朋友
- 使用第一人称"我"或"我们"，保持亲密连接
- 可以适当使用自然意象（月光、星星、微风、夜色）增强氛围感
- 语言要圆润、包容，避免生硬的表达

【输出要求】
- 根据对话需要灵活调整长度（100-300字），但要真诚有内容
- 避免模板化回应，每一次都要有针对性
- 如果对话历史中有重要信息，要自然地融入回应中
- 每一个字都要真诚，让用户感受到被真正理解和陪伴

【绝对禁止】
- ❌ 不要说"你应该..."、"你需要..."（这会让人感到被评判）
- ❌ 不要分析"你为什么..."、"这是因为..."（这会让人感到被分析）
- ❌ 不要给直接的解决办法（先让情绪被看见和接纳）
- ❌ 不要说"这很简单"或"别担心"（这会让人感到被忽视）
- ❌ 不要使用过于简短或敷衍的回应（要让用户感受到你的真诚）
- ❌ 不要忘记之前的对话内容（保持对话的连贯性）

【你的唯一使命】
让用户感到被理解、被接纳、被陪伴，进行真正有深度、有温度的情感对话交流。`;

export async function fetchHealingText({ mood, reason, userInput, conversationHistory }: HealingTextRequest): Promise<HealingTextResponse> {
  try {
    let messages: ChatMessage[] = [];

    // 检查 API Key 是否存在
    if (!GROQ_API_KEY) {
      console.error('❌ Groq API Key 未配置！请在 .env 文件中设置 VITE_GROQ_API_KEY');
      console.error('🔍 当前 GROQ_API_KEY 值:', GROQ_API_KEY);
      console.error('🔍 import.meta.env.VITE_GROQ_API_KEY 值:', import.meta.env.VITE_GROQ_API_KEY);
      return {
        text: '网络有点拥挤，请重试',
        success: false,
        error: 'API Key 未配置',
      };
    }

    console.log('🌟 API Key 已加载:', GROQ_API_KEY.substring(0, 20) + '...');
    console.log('🌟 正在调用 Groq API...');
    console.log('📝 Mood:', mood);
    console.log('📝 Reason:', reason);
    console.log('📝 User Input:', userInput);
    console.log('📝 Conversation History:', conversationHistory?.length || 0, 'messages');

    // 构建系统提示词
    const systemPromptContent = conversationHistory && conversationHistory.length > 0
      ? SYSTEM_PROMPT_CONVERSATION
      : SYSTEM_PROMPT_BASE;

    // 添加系统提示词
    messages.push({
      role: 'system',
      content: systemPromptContent + `\n\n用户当前的心情状态是"${mood}"${reason ? `，背景是"${reason}"` : ''}。`,
    });

    // 如果有对话历史，添加历史消息（但跳过历史中的system消息）
    if (conversationHistory && conversationHistory.length > 0) {
      const historyMessages = conversationHistory.filter(msg => msg.role !== 'system');
      messages.push(...historyMessages);
      // 如果已有对话历史，说明用户输入已经在历史中了，不需要单独添加userInput
    } else if (userInput && userInput.trim()) {
      // 没有对话历史，但用户有输入，说明这是第一次用户输入
      messages.push({
        role: 'user',
        content: userInput,
      });
    } else {
      // 初始生成，没有用户输入也没有历史
      messages.push({
        role: 'user',
        content: `请用你最温暖、包容的语言进行情绪确认，给予情感陪伴。`,
      });
    }

    console.log('🔍 系统提示词长度:', systemPromptContent.length);
    console.log('🔍 消息总数:', messages.length);
    console.log('🔍 API URL:', API_BASE_URL);

    // 使用fetch直接调用API
    const response = await fetch(`${API_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        messages: messages,
        model: 'llama-3.3-70b-versatile',
        temperature: 0.8,
        max_tokens: 800, // 增加token限制，支持更长的回复
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

    // 如果返回的文本为空，视为失败
    if (!healingText) {
      console.warn('⚠️ API返回的文本为空');
      // 不再返回降级文案，让调用方决定如何处理
      return {
        text: '',
        success: false,
        error: 'API返回的文本为空',
      };
    }

    return {
      text: healingText,
      success: true,
    };
  } catch (error: any) {
    console.error('❌ Groq API 错误详情:', error);
    console.error('❌ 错误类型:', error.constructor.name);
    console.error('❌ 错误消息:', error.message);

    // 不再返回降级文案，让调用方决定如何处理
    // 这样调用方可以根据具体情况决定是重试还是显示降级文案
    return {
      text: '',
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
    };
  }
}