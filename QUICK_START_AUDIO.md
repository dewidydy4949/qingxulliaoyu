# 🎵 音频配置快速开始指南

## 快速配置（3步）

### 步骤 1：准备音频文件

将您的音频文件放在 `public/audio` 目录下，文件名为：
- `meditation-1.mp3` - 深度放松冥想
- `sleep-story-1.mp3` - 星空助眠故事  
- `forest-white-noise.mp3` - 森林白噪音

### 步骤 2：确认配置

打开 `src/config/audioConfig.ts`，确认音频路径配置：

```typescript
audioUrl: '/audio/meditation-1.mp3',  // ✅ 正确
```

### 步骤 3：测试播放

运行项目并测试播放功能：
```bash
npm run dev
```

访问 http://localhost:5173/home，点击播放按钮测试。

---

## 📋 配置选项

### 选项 A：使用本地文件（推荐）

1. 将音频文件放入 `public/audio/` 目录
2. 配置文件中使用路径：`'/audio/文件名.mp3'`
3. 无需修改代码，直接可用

**示例：**
```
public/
  audio/
    meditation-1.mp3    ← 将音频文件放在这里
    sleep-story-1.mp3
    forest-white-noise.mp3
```

### 选项 B：使用在线URL

编辑 `src/config/audioConfig.ts`，将 `audioUrl` 改为您的URL：

```typescript
{
  id: '1',
  audioUrl: 'https://your-server.com/audio/meditation.mp3',  // 改为您的URL
}
```

### 选项 C：使用测试音频（临时）

如果暂时没有音频文件，系统会自动使用备用的在线测试音频。

---

## 🔧 修改配置文件

文件位置：`src/config/audioConfig.ts`

**当前配置：**
```typescript
{
  id: '1',
  title: '深度放松冥想',
  audioUrl: '/audio/meditation-1.mp3',  // ← 修改这里的路径
}
```

**修改示例：**

1. **使用本地文件：**
   ```typescript
   audioUrl: '/audio/my-meditation.mp3',
   ```

2. **使用在线URL：**
   ```typescript
   audioUrl: 'https://cdn.example.com/audio/meditation.mp3',
   ```

3. **使用云存储：**
   ```typescript
   audioUrl: 'https://oss.aliyun.com/bucket/audio/meditation.mp3',
   ```

---

## ⚡ 常见问题

### Q: 音频文件放在哪里？
A: 放在 `public/audio/` 目录下

### Q: 如何知道音频是否加载成功？
A: 打开浏览器控制台（F12），查看日志信息

### Q: 本地文件不存在怎么办？
A: 系统会自动尝试使用备用的在线音频URL

### Q: 可以添加更多音频吗？
A: 可以！在 `audioConfigs` 数组中添加新配置即可

---

## 📚 更多帮助

详细配置说明请查看：`AUDIO_SETUP.md`










