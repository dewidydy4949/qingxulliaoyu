import React, { useState } from 'react';
import styles from './EmotionSubTags.module.css';

interface EmotionSubTagsProps {
  emotion: string;
  onSubTagSelect?: (subTag: string) => void;
}

interface EmotionTag {
  id: string;
  label: string;
  color: string;
}

const emotionTags: Record<string, EmotionTag[]> = {
  happy: [
    { id: 'joyful', label: '快乐', color: '#FFD700' },
    { id: 'excited', label: '兴奋', color: '#FF6B6B' },
    { id: 'cheerful', label: '愉悦', color: '#4ECDC4' },
    { id: 'optimistic', label: '乐观', color: '#45B7D1' },
    { id: 'satisfied', label: '满足', color: '#96CEB4' }
  ],
  sad: [
    { id: 'lonely', label: '孤独', color: '#4834d4' },
    { id: 'disappointed', label: '失望', color: '#686de0' },
    { id: 'homesick', label: '思乡', color: '#30336b' },
    { id: 'missing', label: '想念', color: '#130f40' },
    { id: 'grieved', label: '悲伤', color: '#535c68' }
  ],
  calm: [
    { id: 'peaceful', label: '宁静', color: '#55EFC4' },
    { id: 'relaxed', label: '放松', color: '#81ECEC' },
    { id: 'meditative', label: '冥想', color: '#74B9FF' },
    { id: 'serene', label: '安详', color: '#A29BFE' },
    { id: 'tranquil', label: '安详', color: '#FD79A8' }
  ],
  energetic: [
    { id: 'motivated', label: '有动力', color: '#FF6348' },
    { id: 'vibrant', label: '活力', color: '#FF9F43' },
    { id: 'powerful', label: '强大', color: '#EE5A6F' },
    { id: 'enthusiastic', label: '热情', color: '#F368E0' },
    { id: 'dynamic', label: '动感', color: '#00D2D3' }
  ],
  anxious: [
    { id: 'nervous', label: '紧张', color: '#FF7675' },
    { id: 'worried', label: '担心', color: '#FAB1A0' },
    { id: 'overwhelmed', label: '压抑', color: '#E17055' },
    { id: 'restless', label: '不安', color: '#FDCB6E' },
    { id: 'stressed', label: '压力', color: '#E84393' }
  ]
};

const EmotionSubTags: React.FC<EmotionSubTagsProps> = ({ 
  emotion, 
  onSubTagSelect 
}) => {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
  const tags = emotionTags[emotion] || [];

  const handleTagClick = (tag: EmotionTag) => {
    setSelectedTag(tag.id);
    onSubTagSelect?.(tag.id);
  };

  if (!tags.length) {
    return null;
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>选择更具体的心情</h3>
      <div className={styles.tagsGrid}>
        {tags.map((tag) => (
          <button
            key={tag.id}
            className={`${styles.tag} ${selectedTag === tag.id ? styles.selected : ''}`}
            onClick={() => handleTagClick(tag)}
            style={{ borderColor: tag.color }}
          >
            <span 
              className={styles.tagDot}
              style={{ backgroundColor: tag.color }}
            />
            {tag.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmotionSubTags;