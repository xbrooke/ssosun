export interface Wallpaper {
  id: string;
  title: string;
  category: string;
  image: string;
  resolution: string;
  size: string;
  downloads: string;
  downloadUrl: string;
}

export const wallpaperCategories = ['全部', '自然风光', '城市景观', '汽车主题', '抽象艺术', '科技主题', '领克汽车', 'TCR赛事'];

export const wallpapers: Wallpaper[] = [
  {
    id: '1',
    title: '极光山脉',
    category: '自然风光',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Aurora%20over%20mountain%20landscape%2C%20car%20wallpaper%2C%20high%20resolution&sign=2e6f724a803ccdebc9415150107e19d6',
    resolution: '1920x1080',
    size: '3.2 MB',
    downloads: '1.2K',
    downloadUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Aurora%20over%20mountain%20landscape%2C%20car%20wallpaper%2C%20high%20resolution&sign=2e6f724a803ccdebc9415150107e19d6'
  },
  {
    id: '19',
    title: '领克03 TCR',
    category: 'TCR赛事',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Lynk%20%26%20Co%2003%20TCR%20racing%20car%2C%20track%20action%2C%20high%20speed%2C%20official%20wallpaper&sign=6f5fd365f18c9d2487f8ab3c5d2a9566',
    resolution: '1920x1080',
    size: '3.8 MB',
    downloads: '3.5K',
    downloadUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Lynk%20%26%20Co%2003%20TCR%20racing%20car%2C%20track%20action%2C%20high%20speed%2C%20official%20wallpaper&sign=6f5fd365f18c9d2487f8ab3c5d2a9566'
  },
  // 新增领克TCR赛事壁纸
  {
    id: '20',
    title: '领克03 TCR赛道竞速',
    category: 'TCR赛事',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Lynk%20%26%20Co%2003%20TCR%20racing%20on%20track%2C%20high%20speed%2C%20dynamic%20angle%2C%20official%20wallpaper&sign=61f8537aade151042ee4a3cf120708d4',
    resolution: '1920x1080',
    size: '3.9 MB',
    downloads: '2.8K',
    downloadUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Lynk%20%26%20Co%2003%20TCR%20racing%20on%20track%2C%20high%20speed%2C%20dynamic%20angle%2C%20official%20wallpaper&sign=61f8537aade151042ee4a3cf120708d4'
  },
  {
    id: '21',
    title: '领克03 TCR冠军时刻',
    category: 'TCR赛事',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Lynk%20%26%20Co%2003%20TCR%20championship%20moment%2C%20podium%20celebration%2C%20official%20wallpaper&sign=1bdfb9f6889e7708250cdf20f67059e2',
    resolution: '1920x1080',
    size: '4.0 MB',
    downloads: '3.1K',
    downloadUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Lynk%20%26%20Co%2003%20TCR%20championship%20moment%2C%20podium%20celebration%2C%20official%20wallpaper&sign=1bdfb9f6889e7708250cdf20f67059e2'
  },
  {
    id: '22',
    title: '领克03 TCR弯道漂移',
    category: 'TCR赛事',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Lynk%20%26%20Co%2003%20TCR%20drifting%20on%20corner%2C%20smoke%20effect%2C%20dynamic%20shot%2C%20official%20wallpaper&sign=e5d79854b5431caa76d6d8da9b5c6d81',
    resolution: '1920x1080',
    size: '4.1 MB',
    downloads: '2.9K',
    downloadUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Lynk%20%26%20Co%2003%20TCR%20drifting%20on%20corner%2C%20smoke%20effect%2C%20dynamic%20shot%2C%20official%20wallpaper&sign=e5d79854b5431caa76d6d8da9b5c6d81'
  },
  {
    id: '23',
    title: '领克03 TCR车队合影',
    category: 'TCR赛事',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Lynk%20%26%20Co%2003%20TCR%20team%20photo%2C%20multiple%20cars%2C%20pit%20lane%2C%20official%20wallpaper&sign=6d10e9359b5571843031362e522ccfb1',
    resolution: '1920x1080',
    size: '4.2 MB',
    downloads: '2.7K',
    downloadUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Lynk%20%26%20Co%2003%20TCR%20team%20photo%2C%20multiple%20cars%2C%20pit%20lane%2C%20official%20wallpaper&sign=6d10e9359b5571843031362e522ccfb1'
  },
  {
    id: '24',
    title: '领克03 TCR夜间赛事',
    category: 'TCR赛事',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Lynk%20%26%20Co%2003%20TCR%20night%20race%2C%20headlights%20on%2C%20dramatic%20lighting%2C%20official%20wallpaper&sign=74110fbacd35869b53d35913851788bd',
    resolution: '1920x1080',
    size: '4.0 MB',
    downloads: '3.0K',
    downloadUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Lynk%20%26%20Co%2003%20TCR%20night%20race%2C%20headlights%20on%2C%20dramatic%20lighting%2C%20official%20wallpaper&sign=74110fbacd35869b53d35913851788bd'
  },
  {
    id: '25',
    title: '领克03 TCR雨天竞速',
    category: 'TCR赛事',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Lynk%20%26%20Co%2003%20TCR%20wet%20race%2C%20rain%20effect%2C%20spray%20from%20tires%2C%20official%20wallpaper&sign=ccac8f11487b2b54ce5bff615f1e8b94',
    resolution: '1920x1080',
    size: '4.1 MB',
    downloads: '2.8K',
    downloadUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Lynk%20%26%20Co%2003%20TCR%20wet%20race%2C%20rain%20effect%2C%20spray%20from%20tires%2C%20official%20wallpaper&sign=ccac8f11487b2b54ce5bff615f1e8b94'
  },
  {
    id: '26',
    title: '领克03 TCR起跑瞬间',
    category: 'TCR赛事',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Lynk%20%26%20Co%2003%20TCR%20race%20start%2C%20grid%20formation%2C%20dramatic%20moment%2C%20official%20wallpaper&sign=26da017a8cc76e9807be86c15fb93f25',
    resolution: '1920x1080',
    size: '3.9 MB',
    downloads: '3.2K',
    downloadUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Lynk%20%26%20Co%2003%20TCR%20race%20start%2C%20grid%20formation%2C%20dramatic%20moment%2C%20official%20wallpaper&sign=26da017a8cc76e9807be86c15fb93f25'
  },
  {
    id: '27',
    title: '领克03 TCR维修区',
    category: 'TCR赛事',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Lynk%20%26%20Co%2003%20TCR%20pit%20stop%2C%20mechanics%20working%2C%20detailed%20view%2C%20official%20wallpaper&sign=66bf589c8f2da99185daabba28133b5f',
    resolution: '1920x1080',
    size: '4.2 MB',
    downloads: '2.6K',
    downloadUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Lynk%20%26%20Co%2003%20TCR%20pit%20stop%2C%20mechanics%20working%2C%20detailed%20view%2C%20official%20wallpaper&sign=66bf589c8f2da99185daabba28133b5f'
  },
  {
    id: '28',
    title: '领克03 TCR冠军涂装',
    category: 'TCR赛事',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Lynk%20%26%20Co%2003%20TCR%20championship%20livery%2C%20special%20design%2C%20high%20detail%2C%20official%20wallpaper&sign=c99cdd26b431bcc697f88c4b026ceeae',
    resolution: '1920x1080',
    size: '4.0 MB',
    downloads: '3.3K',
    downloadUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Lynk%20%26%20Co%2003%20TCR%20championship%20livery%2C%20special%20design%2C%20high%20detail%2C%20official%20wallpaper&sign=c99cdd26b431bcc697f88c4b026ceeae'
  },
  {
    id: '29',
    title: '领克03 TCR赛道特写',
    category: 'TCR赛事',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Lynk%20%26%20Co%2003%20TCR%20track%20close-up%2C%20detailed%20car%20design%2C%20official%20wallpaper&sign=657ec9c16850f2cc2f80e39b0b3b2e00',
    resolution: '1920x1080',
    size: '3.8 MB',
    downloads: '3.0K',
    downloadUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Lynk%20%26%20Co%2003%20TCR%20track%20close-up%2C%20detailed%20car%20design%2C%20official%20wallpaper&sign=657ec9c16850f2cc2f80e39b0b3b2e00'
  },
  // 新增领克其他车型壁纸
  {
    id: '30',
    title: '领克01都市版',
    category: '领克汽车',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Lynk%20%26%20Co%2001%20urban%20edition%2C%20city%20background%2C%20modern%20design%2C%20official%20wallpaper&sign=b5937751c762f6cc77d8d89960070c44',
    resolution: '1920x1080',
    size: '3.7 MB',
    downloads: '2.5K',
    downloadUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Lynk%20%26%20Co%2001%20urban%20edition%2C%20city%20background%2C%20modern%20design%2C%20official%20wallpaper&sign=b5937751c762f6cc77d8d89960070c44'
  },
  {
    id: '31',
    title: '领克01越野版',
    category: '领克汽车',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Lynk%20%26%20Co%2001%20off-road%20edition%2C%20mountain%20background%2C%20rugged%20design%2C%20official%20wallpaper&sign=0a8ac108460b133683e8bfb7cc1a8ed8',
    resolution: '1920x1080',
    size: '3.8 MB',
    downloads: '2.3K',
    downloadUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Lynk%20%26%20Co%2001%20off-road%20edition%2C%20mountain%20background%2C%20rugged%20design%2C%20official%20wallpaper&sign=0a8ac108460b133683e8bfb7cc1a8ed8'
  },

  // 新增10张风景照
  {
    id: '32',
    title: '雪山日出',
    category: '自然风光',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Snow%20mountain%20sunrise%2C%20golden%20light%2C%20high%20resolution%2C%20car%20wallpaper&sign=0364f37b023a01931df834ee4caecfa1',
    resolution: '1920x1080',
    size: '3.5 MB',
    downloads: '1.8K',
    downloadUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Snow%20mountain%20sunrise%2C%20golden%20light%2C%20high%20resolution%2C%20car%20wallpaper&sign=0364f37b023a01931df834ee4caecfa1'
  },
  {
    id: '33',
    title: '湖畔日落',
    category: '自然风光',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Lake%20sunset%2C%20reflection%20on%20water%2C%20warm%20colors%2C%20car%20wallpaper&sign=37e24596052bffdd7af6f31ef20e8781',
    resolution: '1920x1080',
    size: '3.6 MB',
    downloads: '2.1K',
    downloadUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Lake%20sunset%2C%20reflection%20on%20water%2C%20warm%20colors%2C%20car%20wallpaper&sign=37e24596052bffdd7af6f31ef20e8781'
  },
  {
    id: '34',
    title: '森林晨雾',
    category: '自然风光',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Forest%20morning%20fog%2C%20mystical%20atmosphere%2C%20sun%20rays%2C%20car%20wallpaper&sign=4db8a2b07236a28b3cd7e3d35ee6bb77',
    resolution: '1920x1080',
    size: '3.7 MB',
    downloads: '1.9K',
    downloadUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Forest%20morning%20fog%2C%20mystical%20atmosphere%2C%20sun%20rays%2C%20car%20wallpaper&sign=4db8a2b07236a28b3cd7e3d35ee6bb77'
  },
  {
    id: '35',
    title: '沙漠星空',
    category: '自然风光',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Desert%20night%20sky%2C%20milky%20way%2C%20star%20trails%2C%20car%20wallpaper&sign=0da2f452a2fd7102e838884ff56c0a88',
    resolution: '1920x1080',
    size: '3.8 MB',
    downloads: '2.2K',
    downloadUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Desert%20night%20sky%2C%20milky%20way%2C%20star%20trails%2C%20car%20wallpaper&sign=0da2f452a2fd7102e838884ff56c0a88'
  },
  {
    id: '36',
    title: '瀑布景观',
    category: '自然风光',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Waterfall%20landscape%2C%20lush%20greenery%2C%20long%20exposure%2C%20car%20wallpaper&sign=85a750e008cb6131eb9d933882e9f163',
    resolution: '1920x1080',
    size: '3.6 MB',
    downloads: '2.0K',
    downloadUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Waterfall%20landscape%2C%20lush%20greenery%2C%20long%20exposure%2C%20car%20wallpaper&sign=85a750e008cb6131eb9d933882e9f163'
  },
  {
    id: '37',
    title: '秋日枫叶',
    category: '自然风光',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Autumn%20maple%20leaves%2C%20red%20and%20orange%20tones%2C%20forest%20path%2C%20car%20wallpaper&sign=93475e29f2ea0d0e7066e270b35b8414',
    resolution: '1920x1080',
    size: '3.5 MB',
    downloads: '2.3K',
    downloadUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Autumn%20maple%20leaves%2C%20red%20and%20orange%20tones%2C%20forest%20path%2C%20car%20wallpaper&sign=93475e29f2ea0d0e7066e270b35b8414'
  },
  {
    id: '38',
    title: '海岸线',
    category: '自然风光',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Coastline%20view%2C%20ocean%20waves%2C%20cliffs%2C%20sunny%20day%2C%20car%20wallpaper&sign=51128268d48486cbb4a445ba11e5da42',
    resolution: '1920x1080',
    size: '3.7 MB',
    downloads: '2.1K',
    downloadUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Coastline%20view%2C%20ocean%20waves%2C%20cliffs%2C%20sunny%20day%2C%20car%20wallpaper&sign=51128268d48486cbb4a445ba11e5da42'
  },
  {
    id: '39',
    title: '田园风光',
    category: '自然风光',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Countryside%20landscape%2C%20wheat%20fields%2C%20farmhouse%2C%20golden%20hour%2C%20car%20wallpaper&sign=4bf442a6e362aa6d3b91ebf2a55538c6',
    resolution: '1920x1080',
    size: '3.6 MB',
    downloads: '1.9K',
    downloadUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Countryside%20landscape%2C%20wheat%20fields%2C%20farmhouse%2C%20golden%20hour%2C%20car%20wallpaper&sign=4bf442a6e362aa6d3b91ebf2a55538c6'
  },
  {
    id: '40',
    title: '雪山湖泊',
    category: '自然风光',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Snow%20mountain%20and%20lake%2C%20mirror%20reflection%2C%20blue%20sky%2C%20car%20wallpaper&sign=207ad898c5eed3dd69d1f5dec13cc43a',
    resolution: '1920x1080',
    size: '3.8 MB',
    downloads: '2.2K',
    downloadUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Snow%20mountain%20and%20lake%2C%20mirror%20reflection%2C%20blue%20sky%2C%20car%20wallpaper&sign=207ad898c5eed3dd69d1f5dec13cc43a'
  },
  {
    id: '41',
    title: '樱花大道',
    category: '自然风光',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Cherry%20blossom%20avenue%2C%20pink%20flowers%2C%20spring%20season%2C%20car%20wallpaper&sign=1e200f2424ebeb11e08b4c05a50a6cdb',
    resolution: '1920x1080',
    size: '3.5 MB',
    downloads: '2.4K',
    downloadUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Cherry%20blossom%20avenue%2C%20pink%20flowers%2C%20spring%20season%2C%20car%20wallpaper&sign=1e200f2424ebeb11e08b4c05a50a6cdb'
  },

  // 新增10张23款03车型照片
  {
    id: '42',
    title: '领克03 2023款 前脸',
    category: '领克汽车',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Lynk%20%26%20Co%2003%202023%20front%20view%2C%20modern%20design%2C%20LED%20headlights%2C%20official%20wallpaper&sign=37a2f9aafb5e49cd190cc66e6ec8515e',
    resolution: '1920x1080',
    size: '3.7 MB',
    downloads: '2.5K',
    downloadUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Lynk%20%26%20Co%2003%202023%20front%20view%2C%20modern%20design%2C%20LED%20headlights%2C%20official%20wallpaper&sign=37a2f9aafb5e49cd190cc66e6ec8515e'
  },
  {
    id: '43',
    title: '领克03 2023款 侧面',
    category: '领克汽车',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Lynk%20%26%20Co%2003%202023%20side%20view%2C%20sporty%20profile%2C%20alloy%20wheels%2C%20official%20wallpaper&sign=c7c65ee364f3c9f6102eafce1e5ad69b',
    resolution: '1920x1080',
    size: '3.8 MB',
    downloads: '2.3K',
    downloadUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Lynk%20%26%20Co%2003%202023%20side%20view%2C%20sporty%20profile%2C%20alloy%20wheels%2C%20official%20wallpaper&sign=c7c65ee364f3c9f6102eafce1e5ad69b'
  },
  {
    id: '44',
    title: '领克03 2023款 尾部',
    category: '领克汽车',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Lynk%20%26%20Co%2003%202023%20rear%20view%2C%20LED%20taillights%2C%20dual%20exhaust%2C%20official%20wallpaper&sign=26dd0a102a7aed6633f22f1b8fa22a36',
    resolution: '1920x1080',
    size: '3.6 MB',
    downloads: '2.4K',
    downloadUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Lynk%20%26%20Co%2003%202023%20rear%20view%2C%20LED%20taillights%2C%20dual%20exhaust%2C%20official%20wallpaper&sign=26dd0a102a7aed6633f22f1b8fa22a36'
  },
  {
    id: '45',
    title: '领克03 2023款 内饰',
    category: '领克汽车',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Lynk%20%26%20Co%2003%202023%20interior%2C%20premium%20materials%2C%20digital%20dashboard%2C%20official%20wallpaper&sign=472861df78c4c44864113f541632f58d',
    resolution: '1920x1080',
    size: '3.7 MB',
    downloads: '2.6K',
    downloadUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Lynk%20%26%20Co%2003%202023%20interior%2C%20premium%20materials%2C%20digital%20dashboard%2C%20official%20wallpaper&sign=472861df78c4c44864113f541632f58d'
  },
  {
    id: '46',
    title: '领克03 2023款 驾驶舱',
    category: '领克汽车',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Lynk%20%26%20Co%2003%202023%20cockpit%2C%20steering%20wheel%2C%20infotainment%20system%2C%20official%20wallpaper&sign=ef68ed84fa6d4904d4bd6ab87bf75c75',
    resolution: '1920x1080',
    size: '3.8 MB',
    downloads: '2.5K',
    downloadUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Lynk%20%26%20Co%2003%202023%20cockpit%2C%20steering%20wheel%2C%20infotainment%20system%2C%20official%20wallpaper&sign=ef68ed84fa6d4904d4bd6ab87bf75c75'
  },
  {
    id: '47',
    title: '领克03 2023款 城市道路',
    category: '领克汽车',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Lynk%20%26%20Co%2003%202023%20on%20city%20road%2C%20urban%20background%2C%20dynamic%20shot%2C%20official%20wallpaper&sign=c2c9e4c0e4fae84157c760d681a3c93a',
    resolution: '1920x1080',
    size: '3.7 MB',
    downloads: '2.3K',
    downloadUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Lynk%20%26%20Co%2003%202023%20on%20city%20road%2C%20urban%20background%2C%20dynamic%20shot%2C%20official%20wallpaper&sign=c2c9e4c0e4fae84157c760d681a3c93a'
  },
  {
    id: '48',
    title: '领克03 2023款 山路驾驶',
    category: '领克汽车',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Lynk%20%26%20Co%2003%202023%20on%20mountain%20road%2C%20curves%2C%20scenic%20view%2C%20official%20wallpaper&sign=f2d5b7f9f7cc3a2a58c2a2e9aa10f63a',
    resolution: '1920x1080',
    size: '3.6 MB',
    downloads: '2.4K',
    downloadUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Lynk%20%26%20Co%2003%202023%20on%20mountain%20road%2C%20curves%2C%20scenic%20view%2C%20official%20wallpaper&sign=f2d5b7f9f7cc3a2a58c2a2e9aa10f63a'
  },
  {
    id: '49',
    title: '领克03 2023款 夜间灯光',
    category: '领克汽车',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Lynk%20%26%20Co%2003%202023%20night%20view%2C%20LED%20lighting%2C%20dramatic%20effect%2C%20official%20wallpaper&sign=0d6e04c0d669f8984351af05e557c1cd',
    resolution: '1920x1080',
    size: '3.8 MB',
    downloads: '2.6K',
    downloadUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Lynk%20%26%20Co%2003%202023%20night%20view%2C%20LED%20lighting%2C%20dramatic%20effect%2C%20official%20wallpaper&sign=0d6e04c0d669f8984351af05e557c1cd'
  },
  {
    id: '50',
    title: '领克03 2023款 运动模式',
    category: '领克汽车',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Lynk%20%26%20Co%2003%202023%20sport%20mode%2C%20dynamic%20driving%2C%20performance%20look%2C%20official%20wallpaper&sign=a017505eb1abfb848a7552868b5c66d2',
    resolution: '1920x1080',
    size: '3.7 MB',
    downloads: '2.5K',
    downloadUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Lynk%20%26%20Co%2003%202023%20sport%20mode%2C%20dynamic%20driving%2C%20performance%20look%2C%20official%20wallpaper&sign=a017505eb1abfb848a7552868b5c66d2'
  },
  {
    id: '51',
    title: '领克03 2023款 细节特写',
    category: '领克汽车',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Lynk%20%26%20Co%2003%202023%20close-up%20details%2C%20emblem%2C%20grille%2C%20official%20wallpaper&sign=4d71be41569e7cdd551fd88257c22e42',
    resolution: '1920x1080',
    size: '3.6 MB',
    downloads: '2.3K',
    downloadUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Lynk%20%26%20Co%2003%202023%20close-up%20details%2C%20emblem%2C%20grille%2C%20official%20wallpaper&sign=4d71be41569e7cdd551fd88257c22e42'
  }
];