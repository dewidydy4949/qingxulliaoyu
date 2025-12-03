/**
 * 治愈系图片配置
 * 
 * 包含多个治愈系图片URL，每次生成时会随机选择一张
 * 所有图片都是治愈系主题：宁静、自然、温暖、放松
 */

export const healingImages: Array<{
  url: string;
  alt: string;
  description: string;
}> = [
  {
    url: 'https://s.coze.cn/image/PqtMLUDbr6U/',
    alt: '宁静的森林风景，阳光透过树叶洒下温暖的光芒',
    description: '宁静的森林风景'
  },
  {
    url: 'https://s.coze.cn/image/nZ4Ah7aGp_I/',
    alt: '神秘的森林小径，薄雾缭绕，充满宁静氛围',
    description: '神秘的森林小径'
  },
  {
    url: 'https://s.coze.cn/image/tyWQGnDwbnU/',
    alt: '璀璨的星空，银河横跨夜空，宁静而美丽',
    description: '璀璨的星空'
  },
  {
    url: 'https://s.coze.cn/image/qutuwdhOz4k/',
    alt: '阳光斑驳的森林小径，绿意盎然，充满生机',
    description: '阳光斑驳的森林小径'
  },
  {
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80',
    alt: '宁静的湖泊，倒映着蓝天白云，平静如镜',
    description: '宁静的湖泊'
  },
  {
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80',
    alt: '茂密的森林，阳光透过树冠洒下，温暖而宁静',
    description: '茂密的森林'
  },
  {
    url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1200&q=80',
    alt: '美丽的花园，鲜花盛开，充满生机与希望',
    description: '美丽的花园'
  },
  {
    url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200&q=80',
    alt: '宁静的山谷，云雾缭绕，如诗如画',
    description: '宁静的山谷'
  },
  {
    url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80',
    alt: '壮观的日出，金色阳光洒向大地，充满希望',
    description: '壮观的日出'
  },
  {
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80',
    alt: '平静的海面，波光粼粼，宁静致远',
    description: '平静的海面'
  },
  {
    url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200&q=80',
    alt: '绿色的草地，微风轻拂，清新自然',
    description: '绿色的草地'
  },
  {
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80',
    alt: '温暖的夕阳，金色光芒洒向大地，温馨而宁静',
    description: '温暖的夕阳'
  },
];

/**
 * 随机获取一张治愈系图片
 */
export const getRandomHealingImage = () => {
  const randomIndex = Math.floor(Math.random() * healingImages.length);
  return healingImages[randomIndex];
};

/**
 * 根据种子值获取治愈系图片（确保相同种子返回相同图片）
 * @param seed 种子值（可以是用户ID、时间戳等）
 */
export const getHealingImageBySeed = (seed: string | number) => {
  // 将种子转换为数字
  let numericSeed = 0;
  if (typeof seed === 'string') {
    for (let i = 0; i < seed.length; i++) {
      numericSeed += seed.charCodeAt(i);
    }
  } else {
    numericSeed = seed;
  }
  
  const index = numericSeed % healingImages.length;
  return healingImages[index];
};

