/**
 * 音频文件配置
 * 
 * 配置说明：
 * 1. 如果音频文件在 public/audio 目录下，使用 '/audio/文件名' 格式
 * 2. 如果音频文件在远程服务器，使用完整的 URL
 * 3. 确保音频文件路径正确且可以访问
 */

export interface AudioConfig {
  id: string;
  title: string;
  description: string;
  duration: string;
  // 音频文件路径或URL
  audioUrl: string;
  // 音频文件类型（用于备用方案）
  audioType?: string;
}

/**
 * 推荐内容的音频配置
 * 
 * 当前配置：使用网络上的音频文件
 * 
 * 配置方式：
 * 1. 直接使用网络音频URL（当前配置）- 推荐用于生产环境
 *    - 将 audioUrl 设置为完整的 HTTPS URL
 *    - 确保URL可以公开访问且支持CORS
 *    - 示例：'https://your-cdn.com/audio/meditation.mp3'
 * 
 * 2. 使用本地音频文件（可选）
 *    - 将音频文件放在 public/audio 目录
 *    - 使用路径：'/audio/文件名.mp3'
 *    - 示例：'/audio/meditation-1.mp3'
 * 
 * 注意事项：
 * - 网络音频URL必须支持跨域访问（CORS）
 * - 推荐使用 HTTPS 协议
 * - 确保音频URL稳定可用
 */
export const audioConfigs: AudioConfig[] = [
  {
    id: '1',
    title: '深度放松冥想',
    description: '通过引导冥想帮助您释放压力，找回内心的平静',
    duration: '5分钟',
    // 舒缓钢琴曲 - 优先使用本地文件，如果不存在则使用在线资源
    // 使用方法：将钢琴曲文件放入 public/audio/ 目录，命名为 piano-meditation-1.mp3
    audioUrl: '/audio/piano-meditation-1.mp3',
    audioType: 'audio/mpeg',
  },
  {
    id: '2',
    title: '星空助眠故事',
    description: '温柔的星空故事，伴您进入甜美的梦乡',
    duration: '10分钟',
    // 舒缓钢琴曲 - 优先使用本地文件，如果不存在则使用在线资源
    // 使用方法：将钢琴曲文件放入 public/audio/ 目录，命名为 piano-sleep-1.mp3
    audioUrl: '/audio/piano-sleep-1.mp3',
    audioType: 'audio/mpeg',
  },
  {
    id: '3',
    title: '森林白噪音',
    description: '纯净的森林声音，为您营造宁静的环境',
    duration: '15分钟',
    // 舒缓钢琴曲 - 优先使用本地文件，如果不存在则使用在线资源
    // 使用方法：将钢琴曲文件放入 public/audio/ 目录，命名为 piano-forest-1.mp3
    audioUrl: '/audio/piano-forest-1.mp3',
    audioType: 'audio/mpeg',
  },
];

/**
 * 备用音频URL（备用方案）
 * 如果主音频URL加载失败，系统会自动尝试使用这些备用URL
 * 
 * 注意：这些是备用URL，用于在主URL失败时的回退方案
 * 
 * 推荐的免费音频资源网站（可获取音频URL）：
 * - Pixabay: https://pixabay.com/music/
 * - Freesound: https://freesound.org/
 * - Free Music Archive: https://freemusicarchive.org/
 * - YouTube Audio Library: https://www.youtube.com/audiolibrary
 */
export const fallbackAudioUrls: { [key: string]: string } = {
  // 深度放松冥想 - 备用音频URL（如果本地文件不存在，使用在线资源）
  '1': 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  // 星空助眠故事 - 备用音频URL（如果本地文件不存在，使用在线资源）
  '2': 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  // 森林白噪音 - 备用音频URL（如果本地文件不存在，使用在线资源）
  '3': 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
};

/**
 * 获取音频URL（带备用方案）
 * 
 * 策略：
 * 1. 优先返回配置的 audioUrl（可能是本地路径或在线URL）
 * 2. 如果配置的URL加载失败，在组件中会自动尝试使用 fallbackAudioUrls
 */
export const getAudioUrl = (id: string): string => {
  const config = audioConfigs.find(c => c.id === id);
  if (!config) {
    // 如果找不到配置，返回备用URL
    return fallbackAudioUrls[id] || '';
  }
  
  // 返回配置的URL（可能是本地路径 '/audio/xxx.mp3' 或在线URL）
  return config.audioUrl;
};

/**
 * 获取备用音频URL
 */
export const getFallbackAudioUrl = (id: string): string => {
  return fallbackAudioUrls[id] || '';
};

