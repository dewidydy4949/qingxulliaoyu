# 音频文件配置指南

本指南将帮助您配置推荐内容的音频文件。

## 📁 目录结构

音频文件应放置在以下位置：

```
项目根目录/
├── public/
│   └── audio/
│       ├── meditation-1.mp3      (深度放松冥想)
│       ├── sleep-story-1.mp3     (星空助眠故事)
│       └── forest-white-noise.mp3 (森林白噪音)
└── src/
    └── config/
        └── audioConfig.ts        (音频配置文件)
```

## 🎵 配置步骤

### 方法1：使用本地音频文件（推荐用于开发）

1. **创建音频目录**
   ```bash
   mkdir -p public/audio
   ```

2. **准备音频文件**
   将您的音频文件重命名并放入 `public/audio` 目录：
   - `meditation-1.mp3` - 深度放松冥想（5分钟）
   - `sleep-story-1.mp3` - 星空助眠故事（10分钟）
   - `forest-white-noise.mp3` - 森林白噪音（15分钟）

3. **配置已完成**
   代码已经配置为使用这些文件路径，无需修改代码。

### 方法2：使用在线音频URL（推荐用于生产环境）

编辑 `src/config/audioConfig.ts` 文件，将 `audioUrl` 改为您的在线音频URL：

```typescript
{
  id: '1',
  title: '深度放松冥想',
  audioUrl: 'https://your-domain.com/audio/meditation-1.mp3', // 改为您的URL
  // ...
}
```

### 方法3：使用备用在线资源（测试用）

如果本地文件不存在，系统会自动尝试使用备用的在线音频资源。

## 🎬 获取音频资源

### 免费音频资源网站：

1. **Pixabay Music**
   - 网址：https://pixabay.com/music/
   - 提供免费的音乐和音效，可商用

2. **Freesound**
   - 网址：https://freesound.org/
   - 提供免费音效库

3. **Free Music Archive**
   - 网址：https://freemusicarchive.org/
   - 提供免费音乐资源

4. **YouTube Audio Library**
   - 网址：https://www.youtube.com/audiolibrary
   - 可下载免费音乐和音效

### 冥想和放松音频：

1. **Calm** - 有免费试用版
2. **Headspace** - 有免费内容
3. **Insight Timer** - 免费冥想应用

### 白噪音资源：

1. **Noisli** - 免费自然声音
2. **MyNoise** - 免费环境音
3. **Rainy Mood** - 免费雨声

## ⚙️ 音频文件要求

- **格式**：MP3（推荐）或 WAV
- **采样率**：44.1kHz 或 48kHz
- **比特率**：128kbps 或更高（推荐 192kbps）
- **文件大小**：建议每个文件不超过 10MB
- **时长**：根据配置（5分钟、10分钟、15分钟）

## 🔧 测试音频

1. **启动开发服务器**
   ```bash
   npm run dev
   ```

2. **访问首页**
   打开浏览器访问：http://localhost:5173/home

3. **测试播放**
   - 点击推荐卡片上的播放按钮
   - 检查浏览器控制台是否有错误
   - 确认音频可以正常播放

## 📝 配置示例

### 示例1：使用本地文件

```typescript
// src/config/audioConfig.ts
{
  id: '1',
  audioUrl: '/audio/meditation-1.mp3', // public目录下的文件
}
```

### 示例2：使用CDN URL

```typescript
{
  id: '1',
  audioUrl: 'https://cdn.example.com/audio/meditation-1.mp3',
}
```

### 示例3：使用云存储URL

```typescript
{
  id: '1',
  audioUrl: 'https://oss.example.com/bucket/audio/meditation-1.mp3',
}
```

## ⚠️ 注意事项

1. **版权问题**：确保使用的音频文件有适当的版权许可
2. **跨域问题**：如果使用外部URL，确保服务器允许跨域访问（CORS）
3. **文件路径**：`public` 目录下的文件会自动复制到构建输出目录
4. **缓存问题**：修改音频文件后，可能需要清除浏览器缓存

## 🐛 故障排除

### 问题1：音频无法播放

**解决方案：**
- 检查音频文件是否存在
- 检查文件路径是否正确
- 查看浏览器控制台的错误信息
- 确认音频文件格式是否支持

### 问题2：控制台显示404错误

**解决方案：**
- 确认文件是否在 `public/audio` 目录下
- 检查文件名是否与配置一致
- 重启开发服务器

### 问题3：音频播放但无声音

**解决方案：**
- 检查系统音量
- 检查浏览器标签页是否静音
- 检查音频文件本身是否有问题

## 📞 获取帮助

如果遇到问题：
1. 查看浏览器控制台的错误信息
2. 检查 `src/config/audioConfig.ts` 配置
3. 确认音频文件路径和格式

---

配置完成后，您的音频播放功能就可以正常工作了！🎉











