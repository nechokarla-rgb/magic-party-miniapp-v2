import { createContext, useContext, useId, useMemo, useState } from "react";
import { BalloonIcon, CameraIcon as ServiceCameraIcon, MicrophoneStageIcon, PersonSimpleRunIcon, FlowerTulipIcon, SparkleIcon } from "@phosphor-icons/react";
import {
  CalendarIcon, CheckCircledIcon, ChevronLeftIcon, ChevronRightIcon,
  GridIcon, HomeIcon, PersonIcon, SewingPinIcon,
} from "@radix-ui/react-icons";
import {
  Carousel, FlowStack, KeyboardInput, KeyboardTextarea, MobileScroll,
  type FlowControls, type FlowScreen,
} from "./mobile";

type SourceKind = "real" | "inspiration" | "ai";
type ServiceName = "派对布置" | "婚礼服务" | "鲜花预订" | "其他服务";
type Audience = "男士" | "女士" | "通用";
type PrivacyMask = { left: number; top: number; width: number; height: number; rotate?: number };
type GalleryImage = { src: string; masks?: PrivacyMask[] };

type PackageItem = {
  id: string;
  title: string;
  category: ServiceName;
  scene: string;
  audience?: Audience;
  stem: string;
  source: SourceKind;
  price: string;
  note: string;
  featured?: boolean;
  gallery?: GalleryImage[];
  catalogMasks?: PrivacyMask[];
  merchant?: boolean;
};

const sourceFileLabels: Record<SourceKind, string> = {
  real: "真实案例",
  inspiration: "灵感参考",
  ai: "AI生成-灵感参考",
};

function imageUrl(item: PackageItem, use: "首页横幅" | "套餐封面" | "详情竖图") {
  return `/assets/catalog/${item.stem}-${use}-${sourceFileLabels[item.source]}.jpg`;
}

function partyGallery(name: string, count: number, masks?: PrivacyMask[]): GalleryImage[] {
  return Array.from({ length: count }, (_, index) => ({
    src: `/assets/party-originals/${name}${index === 0 ? "" : `-${index + 1}`}.jpg`,
    masks: index === 0 ? masks : undefined,
  }));
}

function inspirationGallery(folder: string, count: number, masks: Record<number, PrivacyMask[]> = {}, offset = 0): GalleryImage[] {
  return Array.from({ length: count }, (_, index) => ({
    src: `/assets/new-inspiration/${folder}/${String(index + 1 + offset).padStart(2, "0")}.jpg`,
    masks: masks[index + 1 + offset],
  }));
}

function selectedInspirationGallery(folder: string, indices: number[], masks: Record<number, PrivacyMask[]> = {}, overrides: Record<number, string> = {}): GalleryImage[] {
  return indices.map((index) => ({
    src: overrides[index] ?? `/assets/new-inspiration/${folder}/${String(index).padStart(2, "0")}.jpg`,
    masks: masks[index],
  }));
}

function replacementGallery(folder: string, count: number, masks: Record<number, PrivacyMask[]> = {}): GalleryImage[] {
  return Array.from({ length: count }, (_, index) => ({
    src: `/assets/replacement-2026-09-15/${folder}/${String(index + 1).padStart(2, "0")}.jpg`,
    masks: masks[index + 1],
  }));
}

const blueBirthdayMasks: PrivacyMask[] = [
  { left: 11, top: 39, width: 23, height: 9, rotate: -2 },
  { left: 71, top: 36.5, width: 12, height: 5, rotate: 2 },
];
const purplePartyMasks: PrivacyMask[] = [
  { left: 19, top: 47, width: 18, height: 7, rotate: -2 },
  { left: 72, top: 45, width: 19, height: 8, rotate: 1 },
  { left: 77, top: 58, width: 15, height: 6, rotate: 1 },
];
const catalogSourceLabelMask: PrivacyMask[] = [{ left: 0, top: 91, width: 30, height: 9 }];
const whiteBirthdayMasks: PrivacyMask[] = [{ left: 60, top: 30.5, width: 19, height: 9, rotate: -4 }];
const engagementMasks: PrivacyMask[] = [{ left: 35, top: 27, width: 17, height: 22, rotate: -2 }];
const businessBlackgoldMasks: PrivacyMask[] = [
  { left: 29, top: 23, width: 43, height: 9, rotate: -1 },
  { left: 44, top: 38, width: 18, height: 14, rotate: 1 },
  { left: 43, top: 65, width: 23, height: 8, rotate: -1 },
];
const businessRainbowMasks: Record<number, PrivacyMask[]> = {
  1: [{ left: 60, top: 24, width: 27, height: 18, rotate: -2 }],
  2: [{ left: 78, top: 20, width: 21, height: 18, rotate: -2 }],
};
const whiteSilverMasks: Record<number, PrivacyMask[]> = {
  1: [{ left: 39, top: 29, width: 28, height: 11, rotate: -2 }],
  2: [{ left: 38, top: 18, width: 28, height: 11, rotate: -2 }],
  3: [{ left: 37, top: 29, width: 28, height: 11, rotate: -2 }],
  4: [{ left: 42, top: 32, width: 25, height: 13, rotate: -2 }],
  5: [{ left: 55, top: 31, width: 25, height: 13, rotate: -2 }],
};
const blueCartoonMasks: Record<number, PrivacyMask[]> = {
  1: [{ left: 20, top: 26, width: 31, height: 10, rotate: -2 }],
  2: [{ left: 31, top: 24, width: 30, height: 10, rotate: -2 }],
  4: [{ left: 9, top: 29, width: 35, height: 11, rotate: -2 }],
};
const pinkEngagementMasks: Record<number, PrivacyMask[]> = {
  1: [{ left: 25, top: 30, width: 38, height: 11, rotate: -2 }],
  2: [{ left: 24, top: 29, width: 37, height: 11, rotate: -2 }],
  3: [{ left: 24, top: 29, width: 38, height: 11, rotate: -2 }],
  4: [{ left: 25, top: 29, width: 37, height: 11, rotate: -2 }],
  5: [{ left: 25, top: 30, width: 36, height: 11, rotate: -2 }],
};
const purpleEngagementMasks: Record<number, PrivacyMask[]> = {
  1: [{ left: 25, top: 24, width: 35, height: 10, rotate: -2 }],
  2: [{ left: 25, top: 24, width: 35, height: 10, rotate: -2 }],
  4: [{ left: 61, top: 31, width: 18, height: 9, rotate: 2 }],
  6: [{ left: 61, top: 31, width: 18, height: 14, rotate: -2 }],
  7: [{ left: 21, top: 30, width: 25, height: 8, rotate: -2 }],
  8: [{ left: 48, top: 31, width: 27, height: 11, rotate: 2 }],
  9: [{ left: 28, top: 32, width: 35, height: 10, rotate: -2 }],
  10: [{ left: 56, top: 32, width: 17, height: 14, rotate: -2 }],
};
const purpleGardenMasks: Record<number, PrivacyMask[]> = {
  4: [{ left: 78, top: 42, width: 18, height: 12, rotate: 1 }],
};
const replacementAnniversaryMasks: Record<number, PrivacyMask[]> = {
  1: [
    { left: 55, top: 36, width: 31, height: 6, rotate: -1 },
    { left: 66, top: 42, width: 12, height: 9, rotate: -1 },
  ],
  5: [
    { left: 39, top: 54, width: 47, height: 7, rotate: -1 },
    { left: 56, top: 61, width: 13, height: 10, rotate: -1 },
  ],
};
const replacementLongevityMasks: Record<number, PrivacyMask[]> = {
  2: [{ left: 38, top: 42, width: 10, height: 24, rotate: -1 }],
  4: [{ left: 55, top: 53, width: 13, height: 28, rotate: -1 }],
  6: [{ left: 47, top: 58, width: 18, height: 20, rotate: -1 }],
  11: [{ left: 12, top: 45, width: 13, height: 27, rotate: -1 }],
};

const packages: PackageItem[] = [
  { id: "birthday-garden", title: "清新花园生日派对", category: "派对布置", scene: "生日", stem: "生日-清新花园", source: "real", price: "¥1688 起", note: "清新绿意与轻盈花艺，适合精致小型宴会", featured: true, gallery: [{ src: "/assets/portfolio/blue-birthday.jpg", masks: blueBirthdayMasks }] },
  { id: "birthday-butterfly", title: "粉色蝴蝶花园生日派对", category: "派对布置", scene: "生日", stem: "生日-粉色蝴蝶花园", source: "real", price: "价格面议", note: "柔粉花艺与蝴蝶元素，浪漫又轻盈", featured: true, gallery: [
    { src: "/assets/party-originals/birthday-butterfly-2.jpg" },
    { src: "/assets/party-originals/birthday-butterfly-3.jpg" },
    { src: "/assets/party-originals/birthday-butterfly.jpg" },
  ] },
  { id: "birthday-forest", title: "森系餐桌生日派对", category: "派对布置", scene: "生日", stem: "生日-森系餐桌", source: "real", price: "价格面议", note: "自然绿意融入餐桌设计，营造温馨聚会氛围", gallery: partyGallery("birthday-forest", 2) },
  { id: "birthday-rainbow", title: "彩虹气球餐桌生日派对", category: "派对布置", scene: "生日", stem: "生日-彩虹气球餐桌", source: "real", price: "价格面议", note: "明快彩虹配色与精致餐桌细节，童趣而有质感", gallery: partyGallery("birthday-rainbow", 3) },
  { id: "birthday-25", title: "粉白浪漫二十五岁生日派对", category: "派对布置", scene: "生日", stem: "生日-粉白浪漫二十五岁", source: "real", price: "价格面议", note: "粉白花艺结合数字主题，呈现轻盈浪漫的仪式氛围", gallery: partyGallery("birthday-25", 3) },
  { id: "birthday-white-silver", title: "白银气球生日派对", category: "派对布置", scene: "生日", stem: "生日-白银气球", source: "real", price: "价格面议", note: "白色羽毛与银色气球相互映衬，简洁而富有层次", gallery: inspirationGallery("party-white-silver", 5, whiteSilverMasks) },
  { id: "birthday-blue-cartoon", title: "蓝色卡通生日派对", category: "派对布置", scene: "生日", stem: "生日-蓝色卡通", source: "real", price: "价格面议", note: "蓝色气球、卡通甜品台与餐桌细节一体化设计", gallery: inspirationGallery("party-blue-cartoon", 6, blueCartoonMasks) },
  { id: "birthday-orange-butterfly", title: "暖橙蝴蝶生日派对", category: "派对布置", scene: "生日", stem: "生日-暖橙蝴蝶", source: "real", price: "价格面议", note: "暖橙花艺与发光蝴蝶主景，营造明亮温暖的现场氛围", gallery: inspirationGallery("party-orange-butterfly", 3) },
  { id: "birthday-pink-butterfly-new", title: "粉紫蝴蝶花艺生日派对", category: "派对布置", scene: "生日", stem: "生日-粉紫蝴蝶花艺", source: "inspiration", price: "价格面议", note: "粉紫花艺、发光蝴蝶与宴会餐桌相互呼应，适合室内生日聚会", gallery: inspirationGallery("birthday-pink-butterfly", 5) },
  { id: "adult-white", title: "纯白蝴蝶成人礼", category: "派对布置", scene: "成人礼", stem: "成人礼-纯白蝴蝶", source: "real", price: "¥988 起", note: "纯白层次搭配蝴蝶细节，简约而富有仪式感", featured: true, gallery: [{ src: "/assets/portfolio/white-closeup.jpg", masks: whiteBirthdayMasks }] },
  { id: "adult-purple", title: "紫黑花艺十八岁成人礼", category: "派对布置", scene: "成人礼", stem: "成人礼-紫黑花艺十八岁", source: "real", price: "价格面议", note: "浓郁紫黑花艺塑造鲜明层次，适合个性化成人礼", gallery: partyGallery("adult-purple", 3) },
  { id: "baby-color", title: "彩色童趣百日宴", category: "派对布置", scene: "宝宝宴", stem: "宝宝宴-彩色童趣百日宴", source: "real", price: "价格面议", note: "活泼色彩与童趣造型有序组合，温暖而不繁杂", gallery: partyGallery("baby-color", 1) },
  { id: "baby-pastel", title: "粉彩儿童餐桌宝宝宴", category: "派对布置", scene: "宝宝宴", stem: "宝宝宴-粉彩儿童餐桌", source: "real", price: "价格面议", note: "柔和粉彩与精致餐桌细节，适合温馨家庭宴会", gallery: partyGallery("baby-pastel", 3) },
  { id: "hotel-room-anniversary", title: "粉彩花海纪念日房间", category: "派对布置", scene: "酒店房间", stem: "酒店房间-粉彩花海纪念日", source: "inspiration", price: "价格面议", note: "粉彩花艺、灯光与床边动线一体布置，适合纪念日与浪漫惊喜", gallery: inspirationGallery("hotel-room-anniversary", 5) },
  { id: "hotel-room-cartoon", title: "粉色卡通生日房间", category: "派对布置", scene: "酒店房间", stem: "酒店房间-粉色卡通生日", source: "inspiration", price: "价格面议", note: "粉色花艺、卡通造型与发光装置组合，营造轻松甜美的生日氛围", gallery: inspirationGallery("hotel-room-cartoon", 5) },
  { id: "anniversary-table", title: "紫粉花艺纪念日晚餐", category: "派对布置", scene: "纪念日", stem: "纪念日-紫粉花艺餐桌", source: "inspiration", price: "价格面议", note: "紫粉花艺融入餐桌与席位细节，营造浪漫私享氛围", gallery: replacementGallery("anniversary", 10, replacementAnniversaryMasks) },
  { id: "proposal-violet", title: "紫罗兰花园求婚", category: "婚礼服务", scene: "求婚", stem: "求婚-紫罗兰花园", source: "real", price: "价格面议", note: "紫色花园与花艺拱门相互呼应，呈现浪漫仪式场景", featured: true, gallery: inspirationGallery("party-purple-garden", 5, purpleGardenMasks) },
  { id: "engagement-lilac-inspiration", title: "奶油香芋紫订婚布置", category: "婚礼服务", scene: "订婚", stem: "订婚-香芋紫灵感", source: "inspiration", price: "价格面议", note: "香芋紫花艺与柔和帷幔层叠搭配，呈现温柔雅致氛围", gallery: selectedInspirationGallery("purple-engagement", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], purpleEngagementMasks, { 5: "/assets/new-inspiration/purple-engagement/05-cropped.png", 8: "/assets/new-inspiration/purple-engagement/08-cropped.png", 10: "/assets/new-inspiration/purple-engagement/10-cropped.png" }) },
  { id: "engagement-red", title: "中式红金花艺订婚宴", category: "婚礼服务", scene: "订婚", stem: "订婚-中式红金花艺", source: "real", price: "价格面议", note: "红金花艺结合中式礼序，喜庆而不失雅致", gallery: partyGallery("engagement-red", 2, engagementMasks) },
  { id: "engagement-rose-inspiration", title: "红粉花艺订婚布置", category: "婚礼服务", scene: "订婚", stem: "订婚-红粉花艺灵感", source: "inspiration", price: "价格面议", note: "红粉花艺结合立体背景设计，营造层次丰富的仪式空间", gallery: inspirationGallery("pink-engagement", 4, pinkEngagementMasks, 1) },
  { id: "wedding-blackgold", title: "黑金烛光西式婚礼", category: "婚礼服务", scene: "西式婚礼", stem: "婚礼-黑金烛光仪式", source: "inspiration", price: "价格面议", note: "黑金质感与温润烛光交织，塑造沉浸式西式仪式空间", catalogMasks: catalogSourceLabelMask },
  { id: "wedding-bluegold", title: "蓝金户外草坪婚礼", category: "婚礼服务", scene: "草坪婚礼", stem: "婚礼-蓝金户外花园", source: "inspiration", price: "价格面议", note: "蓝金花艺融入户外绿意，呈现轻盈开阔的草坪仪式氛围", catalogMasks: catalogSourceLabelMask },
  { id: "wedding-courtyard-red", title: "红金花艺庭院布置", category: "婚礼服务", scene: "庭院布置", stem: "婚礼-中式庭院门头", source: "inspiration", price: "价格面议", note: "红色帷幔、喜字与花艺装点庭院入口，营造层次丰富的庭院迎宾氛围", gallery: inspirationGallery("wedding-courtyard-red", 4) },
  { id: "wedding-chinese-pink", title: "粉金新中式婚礼花艺", category: "婚礼服务", scene: "中式婚礼", stem: "婚礼-粉金新中式花艺", source: "inspiration", price: "价格面议", note: "粉金花艺、传统喜字与中式器物相互映衬，呈现柔雅精致的仪式氛围", gallery: inspirationGallery("wedding-chinese-pink", 4) },
  { id: "opening-redgold", title: "红金气球花篮开业布置", category: "派对布置", scene: "开业", stem: "开业-红金气球花篮", source: "ai", price: "价格面议", note: "红金门头、气球与花篮组合，呈现醒目而喜庆的开业氛围", catalogMasks: catalogSourceLabelMask },
  { id: "longevity-redgold", title: "红金中式寿宴", category: "派对布置", scene: "寿宴", stem: "寿宴-红金中式", source: "inspiration", price: "价格面议", note: "红金主景融入传统中式细节，营造庄重喜庆的寿宴氛围", gallery: replacementGallery("longevity", 11, replacementLongevityMasks) },
  { id: "business-blackgold", title: "黑金年会活动布置", category: "派对布置", scene: "商业活动", stem: "商业活动-黑金年会", source: "real", price: "价格面议", note: "黑金舞台与主题视觉统一设计，彰显企业活动质感", gallery: [{ src: "/assets/party-originals/business-blackgold.jpg", masks: businessBlackgoldMasks }] },
  { id: "business-rainbow", title: "彩虹周年店庆", category: "派对布置", scene: "商业活动", stem: "商业活动-彩虹周年店庆", source: "real", price: "价格面议", note: "明快彩虹装置营造活力氛围，适合周年庆与品牌店庆", gallery: [
    { src: "/assets/party-originals/business-rainbow.jpg", masks: businessRainbowMasks[1] },
    { src: "/assets/party-originals/business-rainbow-2.jpg", masks: businessRainbowMasks[2] },
  ] },
  { id: "business-newyear", title: "新春启动会", category: "派对布置", scene: "商业活动", stem: "商业活动-新春启动会", source: "real", price: "价格面议", note: "新春主题视觉与启动仪式场景一体化呈现", gallery: partyGallery("business-newyear", 3) },
  { id: "makeup-bride", title: "新娘跟妆与妆造", category: "婚礼服务", scene: "婚纱妆造", stem: "摄影妆造-新娘跟妆背影", source: "ai", price: "价格面议", note: "统筹妆面、发型及婚礼当日跟妆，支持个性化沟通", catalogMasks: catalogSourceLabelMask },
  { id: "makeup-white-inspiration", title: "白纱新娘鲜花盘发", category: "婚礼服务", scene: "婚纱妆造", stem: "摄影妆造-白纱盘发灵感", source: "inspiration", price: "价格面议", note: "精选鲜花盘发与花饰造型，可根据礼服风格进行搭配", gallery: selectedInspirationGallery("makeup-white", [2, 5, 7, 9, 10, 11, 13, 14, 18, 19, 21, 22, 23, 26, 27]) },
  { id: "makeup-red-inspiration", title: "中式新娘红妆盘发", category: "婚礼服务", scene: "婚纱妆造", stem: "摄影妆造-中式盘发灵感", source: "inspiration", price: "价格面议", note: "中式盘发搭配红金花饰，兼顾传统韵味与精致细节", gallery: selectedInspirationGallery("makeup-red", [1, 2, 3, 5, 6, 10, 11, 13, 14, 15, 19, 21, 22, 23, 26, 27, 29, 30, 31, 34]) },
  { id: "bridal-veil-styles", title: "新娘头纱与礼服搭配", category: "婚礼服务", scene: "婚纱妆造", stem: "摄影妆造-头纱礼服搭配", source: "inspiration", price: "价格面议", note: "提供头纱长度、花饰与礼服背面效果的整体搭配参考", gallery: selectedInspirationGallery("bridal-veils", [1, 2, 3, 5, 6, 7, 9, 10, 11, 14, 15, 18]) },
  { id: "host-ballroom", title: "宴会主持服务", category: "其他服务", scene: "主持服务", stem: "主持服务-宴会厅舞台", source: "ai", price: "价格面议", note: "结合活动场地、流程及宾客规模匹配合适主持人", catalogMasks: catalogSourceLabelMask },
  { id: "show-ballroom", title: "宴会现场表演", category: "其他服务", scene: "表演服务", stem: "表演服务-宴会厅舞台演出", source: "ai", price: "价格面议", note: "舞蹈、互动表演、舞狮等节目可根据活动需求组合", catalogMasks: catalogSourceLabelMask },
  { id: "flower-oil", title: "复古油画色花盒", category: "鲜花预订", scene: "鲜花预订", stem: "鲜花-复古油画色花盒", source: "real", price: "价格面议", note: "浓郁复古色系与层次花材搭配，适合生日及纪念日赠礼", featured: true },
  { id: "flower-peony", title: "粉彩花篮与桌花", category: "鲜花预订", scene: "鲜花预订", stem: "鲜花-粉色芍药花篮", source: "real", price: "价格面议", note: "柔粉、浅紫与粉彩花材组合，可按场景与偏好定制色系", gallery: selectedInspirationGallery("flowers-pastel-baskets", [1, 2, 3, 4, 8, 10, 11, 12]) },
  { id: "flower-orchid", title: "香芋紫花束", category: "鲜花预订", scene: "鲜花预订", stem: "鲜花-香芋紫蝴蝶兰花束", source: "real", price: "价格面议", note: "香芋紫花材搭配蝴蝶兰，呈现轻盈柔和的层次感", gallery: inspirationGallery("flowers-purple", 1) },
  { id: "flower-grape", title: "阳光青提花果篮", category: "鲜花预订", scene: "鲜花预订", stem: "鲜花-阳光青提花果篮", source: "real", price: "价格面议", note: "鲜花与时令水果精致搭配，适合探望、祝福及日常赠礼" },
  { id: "flower-modern-table", title: "现代桌花与伴手花", category: "鲜花预订", scene: "鲜花预订", stem: "鲜花-现代桌花伴手花", source: "real", price: "价格面议", note: "现代桌花与精致花礼灵活组合，可根据场景定制配色", gallery: selectedInspirationGallery("flowers-modern-table", [1, 2, 3, 5, 11, 12, 13], {}, { 1: "/assets/new-inspiration/flowers-modern-table/01-cropped.png" }) },
  { id: "flower-christmas", title: "圣诞红花束与花盒", category: "鲜花预订", scene: "鲜花预订", stem: "鲜花-圣诞红松果花束", source: "real", price: "价格面议", note: "红色花材结合松果与节日元素，营造浓郁冬日氛围", gallery: selectedInspirationGallery("flowers-christmas-red", [5, 6, 9, 10, 12]) },
];

const services: Array<{ name: ServiceName; sub: string; image: string }> = [
  { name: "派对布置", sub: "生日·宴会·房间", image: "party" },
  { name: "婚礼服务", sub: "求婚·婚礼·妆造", image: "camera" },
  { name: "鲜花预订", sub: "花束·花篮·桌花", image: "flower" },
  { name: "其他服务", sub: "主持·现场表演", image: "host" },
];

const partyScenes = ["全部", "生日", "宝宝宴", "成人礼", "纪念日", "酒店房间", "寿宴", "开业", "商业活动"];
const weddingScenes = ["全部", "草坪婚礼", "中式婚礼", "西式婚礼", "求婚", "订婚", "婚纱妆造", "庭院布置"];
const partyPackagePriority: Record<string, number> = {
  "birthday-pink-butterfly-new": 1,
  "birthday-butterfly": 2,
  "birthday-garden": 3,
  "birthday-white-silver": 4,
  "birthday-25": 5,
  "birthday-orange-butterfly": 6,
  "birthday-forest": 7,
  "birthday-blue-cartoon": 8,
  "birthday-rainbow": 9,
  "adult-purple": 1,
  "adult-white": 2,
  "baby-pastel": 1,
  "baby-color": 2,
  "hotel-room-anniversary": 1,
  "hotel-room-cartoon": 2,
  "business-newyear": 1,
  "business-blackgold": 2,
  "business-rainbow": 3,
};
const audienceScenes = new Set(["生日", "成人礼", "宝宝宴"]);
const audienceOptions: Array<"全部" | Audience> = ["全部", "男士", "女士"];
const otherScenes = ["全部", "主持服务", "表演服务"];
const audienceByPackageId: Record<string, Audience> = {
  "birthday-garden": "女士", "birthday-butterfly": "女士", "birthday-forest": "男士",
  "birthday-rainbow": "通用", "birthday-25": "女士", "birthday-white-silver": "女士",
  "birthday-blue-cartoon": "女士", "birthday-orange-butterfly": "女士", "birthday-pink-butterfly-new": "女士",
  "adult-white": "女士", "adult-purple": "通用", "baby-color": "男士",
  "baby-pastel": "通用",
};
const packageAudience = (item: PackageItem) => item.audience ?? audienceByPackageId[item.id];
const audienceLabel = (scene: string, audience?: "全部" | Audience) => {
  if (!audience) return "";
  if (scene === "宝宝宴") {
    if (audience === "男士") return "男宝宝";
    if (audience === "女士") return "女宝宝";
  }
  return audience;
};
const displayPrice = (price: string) => price === "价格面议" ? "定制报价" : price;
type TabName = "home" | "services" | "booking" | "mine";
type BookingRequest = { id: number; service: ServiceName; title?: string; date: string; location: string; name: string; phone: string; scale: string; budget: string; note: string };
type BookingContextValue = {
  requests: BookingRequest[];
  addRequest: (request: BookingRequest) => void;
  acknowledgedRequestIds: number[];
  acknowledgeRequest: (id: number) => void;
};
type CatalogueContextValue = {
  merchantPackages: PackageItem[];
  addMerchantPackage: (item: PackageItem) => void;
  removeMerchantPackage: (id: string) => void;
  hiddenPackageIds: string[];
  togglePackageVisibility: (id: string) => void;
};
const BookingContext = createContext<BookingContextValue>({
  requests: [],
  addRequest: () => {},
  acknowledgedRequestIds: [],
  acknowledgeRequest: () => {},
});
const CatalogueContext = createContext<CatalogueContextValue>({
  merchantPackages: [],
  addMerchantPackage: () => {},
  removeMerchantPackage: () => {},
  hiddenPackageIds: [],
  togglePackageVisibility: () => {},
});

function AppFooter({ active, flow }: { active: TabName; flow: FlowControls }) {
  const items: Array<{ id: TabName; label: string; icon: typeof HomeIcon }> = [
    { id: "home", label: "首页", icon: HomeIcon }, { id: "services", label: "服务", icon: GridIcon },
    { id: "booking", label: "预约", icon: CalendarIcon }, { id: "mine", label: "我的", icon: PersonIcon },
  ];
  const navigate = (id: TabName) => {
    if (id === active) return;
    if (id === "home") flow.replace(homeScreen());
    if (id === "services") flow.replace(servicesScreen());
    if (id === "booking") flow.replace(bookingScreen());
    if (id === "mine") flow.replace(mineScreen());
  };
  return <nav className="bottom-nav" aria-label="主要导航">{items.map(({ id, label, icon: Icon }) => <button key={id} className={active === id ? "nav-item is-active" : "nav-item"} onClick={() => navigate(id)}><Icon /><span>{label}</span></button>)}</nav>;
}

function AppHeader({ title, flow }: { title: string; flow: FlowControls }) {
  return <div className="app-header"><button className="icon-button" aria-label="返回" onClick={flow.pop}><ChevronLeftIcon /></button><strong>{title}</strong><span /></div>;
}

function Home({ flow }: { flow: FlowControls }) {
  const { hiddenPackageIds } = useContext(CatalogueContext);
  const featured = ["proposal-violet", "birthday-garden"]
    .map((id) => packages.find((item) => item.id === id))
    .filter((item): item is PackageItem => Boolean(item && !hiddenPackageIds.includes(item.id)));
  return <MobileScroll className="app-screen ivory-screen"><main className="home-content page-with-tabs" data-testid="home-screen">
    <header className="brand-header"><div><div className="brand-line"><h1>魔法佳派对</h1><SparkleIcon weight="fill" /></div><p>PARTY FOR A BETTER LIFE</p></div><div className="brand-side"><img className="brand-note" src="/assets/reference/brand-note.png" alt="用心布置，每一个重要的时刻" /><button className="location-pill" onClick={() => flow.push(serviceAreaScreen())}>昆山及周边 · 苏州上海可约</button></div></header>
    <section className="hero"><div className="hero-photo"><img src="/assets/portfolio/pink-birthday.jpg" alt="粉色生日派对现场布置" /></div><div className="hero-shade" aria-hidden="true" /><div className="hero-copy"><h2>把美好的<br />仪式感<br />交给专业的人</h2><div className="hero-rule" /><p>生日 · 求婚 · 宝宝宴<br />派对布置 · 活动策划<br />让每个重要的日子<br />都值得被珍藏</p><button className="gold-button" onClick={() => flow.push(bookingScreen(true))}>预约服务 <ChevronRightIcon /></button></div><div className="hero-signature"><span>MAGIC PARTY</span><p>魔法佳派对 · 让幸福更有仪式感</p></div><img className="hero-moments" src="/assets/reference/hero-moments.png" alt="Beautiful Moments" /><div className="hero-dots" aria-hidden="true"><i /><i /><i /></div></section>
    <section className="service-grid" aria-label="核心服务">{services.map(({ name, sub, image }) => <button key={name} className="service-item" onClick={() => flow.push(servicesScreen(true, name))}><img className="service-icon" src={`/assets/reference/service-${image}.png`} alt="" /><strong>{name}</strong><small>{sub}</small></button>)}</section>
    <section className="section-block"><div className="section-heading"><div><h3>精选人气方案</h3><p>真实案例与主题灵感精选</p></div><button onClick={() => flow.push(servicesScreen(true))}>查看全部 <ChevronRightIcon /></button></div><div aria-label="精选方案" className="package-grid home-packages">{featured.map((item) => <PackageCard key={item.id} item={item} imageSrc={item.id === "birthday-garden" ? "/assets/portfolio/blue-birthday.jpg" : undefined} imageMasks={item.id === "birthday-garden" ? blueBirthdayMasks : undefined} badge={item.id === "proposal-violet" ? "浪漫求婚" : "清新生日派对"} onClick={() => flow.push(detailScreen(item))} />)}</div></section>
    <button className="service-area-card" onClick={() => flow.push(serviceAreaScreen())}><SewingPinIcon /><span><strong>昆山及周边 · 苏州、上海可预约</strong><small>上门布置 · 专属方案 · 透明报价</small></span><img className="area-note" src="/assets/reference/area-note.png" alt="让每一个重要时刻被认真呈现" /></button>
  </main></MobileScroll>;
}

function PrivacyMasks({ masks }: { masks?: PrivacyMask[] }) {
  return <>{masks?.map((mask, index) => <i key={index} className="privacy-mask" aria-hidden="true" style={{ left: `${mask.left}%`, top: `${mask.top}%`, width: `${mask.width}%`, height: `${mask.height}%`, transform: `rotate(${mask.rotate ?? 0}deg)` }} />)}</>;
}

function PackageCard({ item, imageSrc, imageMasks, badge, onClick }: { item: PackageItem; imageSrc?: string; imageMasks?: PrivacyMask[]; badge?: string; onClick: () => void }) {
  const primary = item.gallery?.[0];
  const usesCatalogImage = !imageSrc && !primary;
  const masks = imageSrc ? imageMasks : primary?.masks;
  return <button className="package-card" onClick={onClick}><div className="package-image"><img className={usesCatalogImage && item.catalogMasks ? "source-label-crop" : undefined} src={imageSrc ?? primary?.src ?? imageUrl(item, "套餐封面")} alt={item.title} /><PrivacyMasks masks={masks} />{badge && <span>{badge}</span>}</div><div className="package-body"><small>{item.category} · {item.scene}{packageAudience(item) ? ` · ${audienceLabel(item.scene, packageAudience(item))}` : ""}</small><strong>{item.title}</strong><p>{item.note}</p><div><b className={item.price === "价格面议" ? "is-negotiable" : ""}>{displayPrice(item.price)}</b><ChevronRightIcon /></div></div></button>;
}

function Services({ flow, initialCategory = "派对布置" }: { flow: FlowControls; initialCategory?: ServiceName }) {
  const { merchantPackages, hiddenPackageIds } = useContext(CatalogueContext);
  const [active, setActive] = useState<ServiceName>(initialCategory); const [scene, setScene] = useState("全部"); const [audience, setAudience] = useState<"全部" | Audience>("全部");
  const visible = [...merchantPackages, ...packages].filter((item) => {
    if (hiddenPackageIds.includes(item.id)) return false;
    if (item.category !== active) return false;
    if (scene !== "全部" && item.scene !== scene) return false;
    if (active === "派对布置" && audienceScenes.has(scene) && audience !== "全部") {
      const itemAudience = packageAudience(item) ?? "通用";
      return itemAudience === audience || itemAudience === "通用";
    }
    return true;
  }).sort((left, right) => {
    if (active === "婚礼服务") return weddingScenes.indexOf(left.scene) - weddingScenes.indexOf(right.scene);
    if (active === "派对布置") {
      const sceneOrder = partyScenes.indexOf(left.scene) - partyScenes.indexOf(right.scene);
      if (sceneOrder) return sceneOrder;
      if (left.merchant !== right.merchant) return left.merchant ? -1 : 1;
      return (partyPackagePriority[left.id] ?? 99) - (partyPackagePriority[right.id] ?? 99);
    }
    return 0;
  });
  const changeCategory = (name: ServiceName) => { setActive(name); setScene("全部"); setAudience("全部"); };
  const changeScene = (name: string) => { setScene(name); setAudience("全部"); };
  return <MobileScroll className="app-screen ivory-screen"><main className="standard-page page-with-tabs" data-testid="services-screen">
    <header className="simple-title"><p>STYLE CATALOGUE</p><h1>按场景选择方案</h1><span>浏览参考价格与服务内容，具体方案以沟通确认为准</span></header>
    <div className="carousel-hint-shell category-hint-shell"><Carousel ariaLabel="服务分类" className="category-carousel" contentClassName="category-track">{services.map(({ name }) => <button key={name} className={active === name ? "category-chip is-active" : "category-chip"} onClick={() => changeCategory(name)}>{name}</button>)}</Carousel><span className="carousel-swipe-hint" aria-hidden="true">›</span></div>
    {active === "派对布置" && <div className="carousel-hint-shell scene-hint-shell"><Carousel ariaLabel="派对场景" className="scene-carousel" contentClassName="scene-track">{partyScenes.map((item) => <button key={item} className={scene === item ? "scene-chip is-active" : "scene-chip"} onClick={() => changeScene(item)}>{item}</button>)}</Carousel><span className="carousel-swipe-hint" aria-hidden="true">›</span></div>}
    {active === "婚礼服务" && <div className="carousel-hint-shell scene-hint-shell"><Carousel ariaLabel="婚礼服务细分类" className="scene-carousel" contentClassName="scene-track">{weddingScenes.map((item) => <button key={item} className={scene === item ? "scene-chip is-active" : "scene-chip"} onClick={() => changeScene(item)}>{item}</button>)}</Carousel><span className="carousel-swipe-hint" aria-hidden="true">›</span></div>}
    {active === "其他服务" && <div className="carousel-hint-shell scene-hint-shell"><Carousel ariaLabel="其他服务细分类" className="scene-carousel" contentClassName="scene-track">{otherScenes.map((item) => <button key={item} className={scene === item ? "scene-chip is-active" : "scene-chip"} onClick={() => changeScene(item)}>{item}</button>)}</Carousel><span className="carousel-swipe-hint" aria-hidden="true">›</span></div>}
    {active === "派对布置" && audienceScenes.has(scene) && <div className="audience-filter" role="group" aria-label={`${scene}风格筛选`}><span>适用对象</span>{audienceOptions.map((item) => <button key={item} className={audience === item ? "audience-chip is-active" : "audience-chip"} onClick={() => setAudience(item)}>{audienceLabel(scene, item)}</button>)}</div>}
    <div className="catalog-heading"><div><h2>{scene === "全部" ? active : `${scene}${audience === "全部" ? "" : ` · ${audienceLabel(scene, audience)}`}`}</h2><span>共 {visible.length} 套参考方案</span></div><i>{String(visible.length).padStart(2, "0")}</i></div>
    <div className="package-list">{visible.map((item) => <PackageCard key={item.id} item={item} onClick={() => flow.push(detailScreen(item))} />)}</div>
  </main></MobileScroll>;
}

function Detail({ item }: { item: PackageItem }) {
  const serviceCopy = item.scene === "婚纱妆造" ? {
    includes: ["结合礼服、个人偏好与活动流程沟通妆面和发型", "试妆安排、造型数量及是否全程跟妆需提前确认", "饰品、头纱及其他搭配物品的提供方式需单独沟通", "服务日期、到场时间与跟妆时长以沟通确认为准"],
    quote: "报价将结合造型数量、服务时长及人员安排确认。试妆、饰品使用和加时服务是否包含，需在确认方案时逐项说明。图片用于造型参考，具体服务内容以最终确认方案为准。",
    factors: "服务日期、交通距离、造型数量、跟妆时长及新增服务需求均可能影响最终费用。",
  } : item.scene === "主持服务" ? {
    includes: ["结合活动类型、宾客规模与风格需求沟通主持安排", "仪式流程、串场内容及互动环节需提前对接", "彩排、到场时间与主持时长以沟通确认为准", "音响、话筒等设备由哪方提供需提前确认"],
    quote: "报价将结合主持人员、活动流程和服务时长确认。彩排、流程策划、设备及加时服务是否包含，需在确认方案时逐项说明。图片用于场景参考，不代表图中舞台与设备包含在主持报价内。",
    factors: "服务日期、交通距离、主持人员、彩排安排、服务时长及新增环节均可能影响最终费用。",
  } : item.scene === "表演服务" ? {
    includes: ["结合活动主题与现场条件沟通节目类型", "节目数量、演出人数及单场时长需提前确认", "舞台空间、音响灯光与道具需求需双方对接", "彩排、到场时间与演出顺序以沟通确认为准"],
    quote: "报价将结合节目类型、演出人数、场次和时长确认。服装、道具、音响灯光及彩排费用是否包含，需在确认方案时逐项说明。图片用于场景参考，实际节目与设备配置以最终确认方案为准。",
    factors: "服务日期、交通距离、节目类型、演出人数、场次、时长及设备需求均可能影响最终费用。",
  } : {
    includes: item.category === "鲜花预订" ? ["根据用途、预算与期望色系确定花材", "支持包装风格、祝福卡及细节定制", "节日及特殊花材价格可能有所调整", "自取或配送方式以沟通确认为准"] : ["结合场地条件与主题方向定制主视觉", "统筹气球、花艺及主题道具的整体搭配", "支持姓名、日期、色系及主题文字定制", "上门布置时间与撤场安排以沟通确认为准"],
    quote: "服务内容、布置尺寸、花材及道具数量将结合场地与需求确认。展示图片用于风格参考，具体交付内容以最终确认方案为准。",
    factors: "场地规模、服务日期、交通距离、花材用量及新增需求均可能影响最终费用。",
  };
  const gallery = item.gallery ?? [{ src: imageUrl(item, "首页横幅") }];
  const primary = item.gallery?.[0];
  const primaryMasks = primary?.masks;
  const galleryTitle = item.scene === "婚纱妆造" ? "造型参考" : "方案图集";
  const galleryNote = item.scene === "婚纱妆造" ? "逐款浏览发型、花饰与整体搭配" : "多角度呈现方案效果与现场细节";
  return <MobileScroll className="app-screen ivory-screen"><main className="detail-page" data-testid="detail-screen">
    <div className="detail-visual"><img className={`${primary ? "detail-hero detail-hero-original" : "detail-hero"}${!primary && item.catalogMasks ? " source-label-crop" : ""}`} src={primary?.src ?? imageUrl(item, "详情竖图")} alt={`${item.title}完整方案图`} /><PrivacyMasks masks={primaryMasks} /></div>
    <section className="detail-body"><p className="eyebrow">{item.category} · {item.scene}</p><h1>{item.title}</h1><p className="detail-note">{item.note}</p><div className="detail-price"><b>{displayPrice(item.price)}</b>{item.price !== "价格面议" && <span>参考起价</span>}</div>
      <div className="detail-panel"><h2>方案定制说明</h2>{serviceCopy.includes.map((text) => <p key={text}><CheckCircledIcon />{text}</p>)}</div>
      <div className="notice"><strong>{item.price === "价格面议" ? "报价说明" : "参考起价说明"}</strong><p>{serviceCopy.quote}</p></div>
      <DetailGallery item={item} gallery={gallery} title={galleryTitle} note={galleryNote} />
      <div className="notice"><strong>价格与档期说明</strong><p>{serviceCopy.factors}提交预约无需付款，档期以工作室最终确认为准。</p></div>
    </section>
  </main></MobileScroll>;
}

function DetailGallery({ item, gallery, title, note }: { item: PackageItem; gallery: GalleryImage[]; title: string; note: string }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = gallery[selectedIndex];
  const previous = () => setSelectedIndex((index) => (index - 1 + gallery.length) % gallery.length);
  const next = () => setSelectedIndex((index) => (index + 1) % gallery.length);
  return <section className="detail-gallery" aria-label={`${item.title}${title}`}>
    <div className="detail-gallery-heading"><div><h2>{title}</h2><p>{note}</p></div><strong>{selectedIndex + 1} / {gallery.length}</strong></div>
    <figure className="detail-gallery-featured"><div className="gallery-image-frame"><img className={!item.gallery && item.catalogMasks ? "source-label-crop" : undefined} src={selected.src} alt={`${item.title}参考图 ${selectedIndex + 1}`} /><PrivacyMasks masks={selected.masks} />
      {gallery.length > 1 && <><button className="gallery-arrow gallery-arrow-left" type="button" aria-label="上一张图片" onClick={previous}><ChevronLeftIcon /></button><button className="gallery-arrow gallery-arrow-right" type="button" aria-label="下一张图片" onClick={next}><ChevronRightIcon /></button></>}
    </div></figure>
    {gallery.length > 1 && <Carousel ariaLabel={`${item.title}缩略图`} className="gallery-thumbnails" contentClassName="gallery-thumbnail-track">{gallery.map((image, index) => <button key={image.src} type="button" className={index === selectedIndex ? "gallery-thumbnail is-active" : "gallery-thumbnail"} aria-label={`查看第 ${index + 1} 张图片`} aria-pressed={index === selectedIndex} onClick={() => setSelectedIndex(index)}><img src={image.src} alt="" loading="lazy" /></button>)}</Carousel>}
  </section>;
}

function BookingForm({ flow, item, standalone = false }: { flow: FlowControls; item?: PackageItem; standalone?: boolean }) {
  const { addRequest } = useContext(BookingContext);
  const formId = useId();
  const [selected, setSelected] = useState<ServiceName>(item?.category ?? "派对布置"); const [eventDate, setEventDate] = useState(""); const [eventTime, setEventTime] = useState(""); const [location, setLocation] = useState(""); const [name, setName] = useState(""); const [phone, setPhone] = useState(""); const [scale, setScale] = useState(""); const [budget, setBudget] = useState(""); const [note, setNote] = useState("");
  const [dateUnknown, setDateUnknown] = useState(false); const [showMore, setShowMore] = useState(false);
  const today = useMemo(() => { const now = new Date(); const offset = now.getTimezoneOffset() * 60_000; return new Date(now.getTime() - offset).toISOString().slice(0, 10); }, []);
  const validPhone = /^1\d{10}$/.test(phone.trim());
  const validDate = Boolean(eventDate && eventDate >= today && eventTime);
  const selectedDate = validDate ? `${Number(eventDate.slice(5, 7))}月${Number(eventDate.slice(8, 10))}日 ${eventTime}` : "";
  const canSubmit = Boolean(name.trim() && validPhone && (dateUnknown || validDate));
  const submit = () => { if (!canSubmit) return; addRequest({ id: Date.now(), service: selected, title: item?.category === selected ? item.title : undefined, date: dateUnknown ? "日期待定" : selectedDate, location: location.trim(), name: name.trim(), phone: phone.trim(), scale, budget, note }); flow.push(successScreen()); };
  return <MobileScroll className="app-screen ivory-screen"><main className={standalone ? "form-page booking-tab-page" : "form-page"} data-testid="booking-screen">
    <div className="form-intro"><p>预约服务 · 无需在线付款</p><h1>提出预约需求</h1><span>工作室将与您联系，进一步确认档期、方案及报价</span></div>
    {item && selected === item.category && <div className="selected-package"><div className="selected-package-image"><img className={!item.gallery && item.catalogMasks ? "source-label-crop" : undefined} src={item.gallery?.[0]?.src ?? imageUrl(item, "套餐封面")} alt={item.title} /><PrivacyMasks masks={item.gallery?.[0]?.masks} /></div><span><small>已选择方案</small><strong>{item.title}</strong><em>{displayPrice(item.price)}</em></span></div>}
    <label>预约服务 *</label><div className="select-row">{services.map(({ name: service }) => <button key={service} className={selected === service ? "select-chip is-active" : "select-chip"} onClick={() => setSelected(service)}>{service}</button>)}</div>
    <div className="date-label"><label htmlFor={`${formId}-booking-date`}>活动日期与时间 *</label><button type="button" className={dateUnknown ? "date-toggle is-active" : "date-toggle"} aria-pressed={dateUnknown} onClick={() => setDateUnknown(!dateUnknown)}>{dateUnknown ? "日期待定" : "暂未确定日期"}</button></div>
    <div className="date-time-fields"><div><label htmlFor={`${formId}-booking-date`}>日期</label><input id={`${formId}-booking-date`} type="date" min={today} disabled={dateUnknown} value={eventDate} onChange={(event) => setEventDate(event.target.value)} /></div><div><label htmlFor={`${formId}-booking-time`}>时间</label><input id={`${formId}-booking-time`} type="time" disabled={dateUnknown} value={eventTime} onChange={(event) => setEventTime(event.target.value)} /></div></div>
    {dateUnknown && <p className="date-unknown-note">可先提交需求，工作室联系时再确认日期与时间。</p>}
    <label htmlFor={`${formId}-booking-location`}>活动城市与地点（选填）</label><KeyboardInput id={`${formId}-booking-location`} value={location} onChange={(e) => setLocation(e.target.value)} placeholder="例如：昆山开发区，场地待定" />
    <div className="two-fields"><div><label htmlFor={`${formId}-booking-name`}>联系人 *</label><KeyboardInput id={`${formId}-booking-name`} value={name} onChange={(e) => setName(e.target.value)} placeholder="请输入您的称呼" /></div><div><label htmlFor={`${formId}-booking-phone`}>联系电话 *</label><KeyboardInput id={`${formId}-booking-phone`} inputMode="tel" aria-invalid={Boolean(phone && !validPhone)} aria-describedby={`${formId}-phone-hint`} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="请输入11位手机号" /></div></div>
    {phone && !validPhone && <p id={`${formId}-phone-hint`} className="field-error" role="status">请输入有效的11位手机号码。</p>}
    <button className="optional-toggle" aria-expanded={showMore} aria-controls={`${formId}-extra-needs`} onClick={() => setShowMore(!showMore)}><span>补充需求 <small>选填 · 规模、预算与风格偏好</small></span><ChevronRightIcon className={showMore ? "is-open" : ""} /></button>
    <div id={`${formId}-extra-needs`} hidden={!showMore}><div className="two-fields"><div><label htmlFor={`${formId}-booking-scale`}>人数或规模</label><KeyboardInput id={`${formId}-booking-scale`} value={scale} onChange={(e) => setScale(e.target.value)} placeholder="约 20 人" /></div><div><label htmlFor={`${formId}-booking-budget`}>预算范围</label><KeyboardInput id={`${formId}-booking-budget`} value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="例如 2000 元" /></div></div>
    <label htmlFor={`${formId}-booking-note`}>风格偏好与其他需求</label><KeyboardTextarea id={`${formId}-booking-note`} value={note} onChange={(e) => setNote(e.target.value)} placeholder="请填写偏好的色系、主题或需避开的元素" /></div><p className="form-hint">提交后将进入需求沟通阶段，不代表档期已确认。当前为演示原型，所填信息仅在本次页面中展示，刷新后自动清除，不会发送至工作室。</p><button className="gold-button full-button" disabled={!canSubmit} onClick={submit}>提交预约需求 <ChevronRightIcon /></button>
  </main></MobileScroll>;
}

function Success({ flow }: { flow: FlowControls }) { return <div className="success-screen" data-testid="success-screen"><span className="success-icon"><CheckCircledIcon /></span><p>预约需求已记录</p><h1>预约信息提交成功</h1><span>当前为演示原型，信息仅保存在本次页面中，不会发送至工作室，也不会产生任何费用。</span><button className="gold-button" onClick={() => flow.replace(mineScreen())}>查看预约记录 <ChevronRightIcon /></button><button className="text-button" onClick={() => flow.replace(homeScreen())}>返回首页</button></div>; }
function Mine({ flow }: { flow: FlowControls }) {
  const { requests } = useContext(BookingContext);
  return <MobileScroll className="app-screen ivory-screen"><main className="standard-page page-with-tabs mine-page" data-testid="mine-screen"><div className="profile-mark">M</div><p>魔法佳派对</p><h1>我的预约</h1>
    {requests.length ? <section className="request-list"><p className="form-hint">原型体验记录 · 刷新后自动清除，未发送至工作室</p>{requests.map((request) => <article className="request-card" key={request.id}><div><span>待沟通 · 演示</span><small>{request.service}</small></div><h2>{request.title || request.service}</h2><p>{request.date}</p><p>{request.location || "场地待确认"}</p><p>{request.name} · {request.phone.slice(0,3)}****{request.phone.slice(-4)}</p><small>正式提交后，工作室将与您确认方案、档期及报价。</small></article>)}</section> : <section className="empty-booking"><CalendarIcon /><strong>暂无预约记录</strong><span>选择心仪方案并提出预约需求，工作室将为您提供进一步的定制建议。</span><button className="gold-button" onClick={() => flow.push(bookingScreen(true))}>提出预约需求</button></section>}
    <button className="owner-entry" onClick={() => flow.push(ownerScreen())}>商家管理入口 <ChevronRightIcon /></button></main></MobileScroll>;
}
function Owner({ flow }: { flow: FlowControls }) {
  const { requests, acknowledgedRequestIds, acknowledgeRequest } = useContext(BookingContext);
  const { merchantPackages, addMerchantPackage, removeMerchantPackage, hiddenPackageIds, togglePackageVisibility } = useContext(CatalogueContext);
  const [expandedRequestId, setExpandedRequestId] = useState<number | null>(null);
  const [showUploader, setShowUploader] = useState(false);
  const [showPackageManager, setShowPackageManager] = useState(false);
  const [manageCategory, setManageCategory] = useState<ServiceName>("派对布置");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [uploadCategory, setUploadCategory] = useState<ServiceName>("派对布置");
  const [uploadScene, setUploadScene] = useState("生日");
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadNote, setUploadNote] = useState("");
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [publishMessage, setPublishMessage] = useState("");
  const detailsId = useId();
  const uploadId = useId();
  const sceneOptions: Record<ServiceName, string[]> = {
    "派对布置": partyScenes.slice(1),
    "婚礼服务": weddingScenes.slice(1),
    "鲜花预订": ["鲜花预订"],
    "其他服务": otherScenes.slice(1),
  };
  const changeUploadCategory = (category: ServiceName) => {
    setUploadCategory(category);
    setUploadScene(sceneOptions[category][0]);
  };
  const publishPackage = () => {
    if (!uploadTitle.trim() || !uploadFiles.length) return;
    const title = uploadTitle.trim();
    addMerchantPackage({
      id: `merchant-${Date.now()}`,
      title,
      category: uploadCategory,
      scene: uploadScene,
      stem: title,
      source: "real",
      price: "价格面议",
      note: uploadNote.trim() || `${title}实景套图，可根据场地与需求进一步定制`,
      gallery: uploadFiles.map((file) => ({ src: URL.createObjectURL(file) })),
      merchant: true,
    });
    setPublishMessage(`“${title}”已发布到${uploadCategory} · ${uploadScene}`);
    setUploadTitle("");
    setUploadNote("");
    setUploadFiles([]);
    setShowUploader(false);
  };
  type OwnerBookingRow = { id: number; title: string; location: string; contacted?: boolean; request?: BookingRequest };
  const pendingRows: OwnerBookingRow[] = [
    ...requests.map((request) => ({ id: request.id, title: `${request.name} · ${request.title || request.service} · ${request.date}`, location: request.location || "场地待确认", request })),
    { id: -1, title: "周女士 · 生日派对 · 10月18日", location: "昆山开发区" },
  ];
  const unacknowledgedCount = pendingRows.filter((row) => !acknowledgedRequestIds.includes(row.id)).length;
  const rows: OwnerBookingRow[] = [...pendingRows, { id: -2, title: "陈先生 · 求婚布置 · 10月22日", location: "苏州工业园区", contacted: true }, { id: -3, title: "刘女士 · 鲜花预订 · 10月12日", location: "昆山玉山镇", contacted: true }];
  const managedPackages = [...merchantPackages, ...packages].filter((item) => item.category === manageCategory);
  const deleteMerchantPackage = (item: PackageItem) => {
    item.gallery?.forEach((image) => { if (image.src.startsWith("blob:")) URL.revokeObjectURL(image.src); });
    removeMerchantPackage(item.id);
    setDeleteConfirmId(null);
    setPublishMessage(`“${item.title}”已删除`);
  };
  return <MobileScroll className="app-screen ivory-screen"><main className="standard-page owner-page" data-testid="owner-screen">
    <p className="eyebrow">商家专属 · 原型演示</p><h1>业务工作台</h1>
    <div className="owner-stats"><div><b>{pendingRows.length}</b><span>待联系</span></div><div><b>5</b><span>已确认</span></div><div><b>12</b><span>本月咨询</span></div></div>
    <section className="reminder-panel" aria-label="咨询提醒规则"><div><span className={unacknowledgedCount ? "reminder-dot" : "reminder-dot is-clear"} /><span><strong>{unacknowledgedCount ? `${unacknowledgedCount} 条咨询等待确认` : "新咨询已全部确认"}</strong><small>{unacknowledgedCount ? "新咨询将即时提醒；6 小时内未确认，系统将再次提醒" : "提醒已停止，咨询仍保留为待联系状态"}</small></span></div></section>
    <section className="owner-gallery-panel">
      <div className="owner-section-heading"><span><small>内容管理</small><h2>套图管理</h2></span><div><button onClick={() => { setShowPackageManager(!showPackageManager); setShowUploader(false); setPublishMessage(""); }}>{showPackageManager ? "收起管理" : "管理套图"}</button><button onClick={() => { setShowUploader(!showUploader); setShowPackageManager(false); setPublishMessage(""); }}>{showUploader ? "取消" : "+ 新增套图"}</button></div></div>
      <p>上传一组同主题照片，发布后会显示在对应服务分类中。</p>
      {showPackageManager && <div className="owner-package-manager">
        <p>下架后顾客端不再显示，资料仍会保留，之后可以随时恢复。</p>
        <div className="owner-manage-categories">{services.map(({ name }) => <button key={name} className={manageCategory === name ? "is-active" : ""} onClick={() => setManageCategory(name)}>{name}</button>)}</div>
        <div className="owner-manage-list">{managedPackages.map((item) => {
          const hidden = hiddenPackageIds.includes(item.id);
          const primary = item.gallery?.[0];
          return <article key={item.id} className={hidden ? "is-hidden" : ""}>
            <img src={primary?.src ?? imageUrl(item, "套餐封面")} alt="" />
            <span><strong>{item.title}</strong><small>{item.scene} · {item.gallery?.length ?? 1} 张</small></span>
            <div><em>{hidden ? "已下架" : "展示中"}</em><button onClick={() => togglePackageVisibility(item.id)}>{hidden ? "恢复" : "下架"}</button>{item.merchant && <button className="is-delete" onClick={() => deleteConfirmId === item.id ? deleteMerchantPackage(item) : setDeleteConfirmId(item.id)}>{deleteConfirmId === item.id ? "确认删除" : "删除"}</button>}</div>
          </article>;
        })}</div>
      </div>}
      {showUploader && <div className="owner-upload-form">
        <label htmlFor={`${uploadId}-title`}>套图名称 *</label>
        <input id={`${uploadId}-title`} value={uploadTitle} onChange={(event) => setUploadTitle(event.target.value)} placeholder="例如：奶油白花园生日派对" />
        <label>所属服务 *</label>
        <div className="owner-service-options">{services.map(({ name }) => <button key={name} className={uploadCategory === name ? "is-active" : ""} onClick={() => changeUploadCategory(name)}>{name}</button>)}</div>
        <label htmlFor={`${uploadId}-scene`}>细分类 *</label>
        <select id={`${uploadId}-scene`} value={uploadScene} onChange={(event) => setUploadScene(event.target.value)}>{sceneOptions[uploadCategory].map((option) => <option key={option}>{option}</option>)}</select>
        <label htmlFor={`${uploadId}-note`}>方案说明（选填）</label>
        <textarea id={`${uploadId}-note`} value={uploadNote} onChange={(event) => setUploadNote(event.target.value)} placeholder="介绍配色、布置元素和适用场景" />
        <input className="owner-file-input" id={`${uploadId}-files`} type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={(event) => setUploadFiles(Array.from(event.target.files ?? []).slice(0, 20))} />
        <label className="owner-upload-picker" htmlFor={`${uploadId}-files`}><ServiceCameraIcon /><strong>{uploadFiles.length ? `已选择 ${uploadFiles.length} 张照片` : "选择套图照片"}</strong><small>支持 JPG、PNG、WebP，一次最多 20 张</small></label>
        {uploadFiles.length > 0 && <div className="owner-file-list">{uploadFiles.map((file) => <span key={`${file.name}-${file.lastModified}`}>{file.name}</span>)}</div>}
        <button className="gold-button full-button" disabled={!uploadTitle.trim() || !uploadFiles.length} onClick={publishPackage}>发布新套图</button>
        <p className="owner-upload-note">原型演示中，新增套图仅保留在当前页面，刷新后自动清除。</p>
      </div>}
      {publishMessage && <p className="owner-publish-success"><CheckCircledIcon />{publishMessage}</p>}
      {merchantPackages.length > 0 && <div className="owner-published-list">{merchantPackages.map((item) => <article key={item.id}><img src={item.gallery?.[0]?.src} alt={item.title} /><span><strong>{item.title}</strong><small>{item.category} · {item.scene} · {item.gallery?.length ?? 0} 张</small></span><em>已发布</em></article>)}</div>}
    </section>
    <h2>咨询记录</h2>{rows.map((row) => {
      const acknowledged = acknowledgedRequestIds.includes(row.id);
      const expanded = expandedRequestId === row.id;
      const request = row.request;
      return <article className="booking-row" key={row.id}><div className="booking-main"><span>{row.title}<small>{row.location}</small></span><em className={row.contacted ? "is-contacted" : acknowledged ? "is-acknowledged" : ""}>{row.contacted ? "已联系" : acknowledged ? "已确认" : "待联系"}</em></div>
        {request && <>
          <button className="booking-details-toggle" aria-expanded={expanded} aria-controls={`${detailsId}-${row.id}`} onClick={() => setExpandedRequestId(expanded ? null : row.id)}>{expanded ? "收起详情" : "查看咨询详情"}<ChevronRightIcon /></button>
          <dl className="booking-details" id={`${detailsId}-${row.id}`} hidden={!expanded}>
            {[
              ["咨询服务", request.service], ["意向方案", request.title || "未指定方案"],
              ["联系人", request.name], ["联系电话", request.phone],
              ["活动日期与时间", request.date], ["活动城市与地点", request.location.trim() || "场地待确认"],
              ["人数或规模", request.scale.trim() || "未填写"], ["预算范围", request.budget.trim() || "未填写"],
              ["风格偏好与其他需求", request.note.trim() || "未填写"],
            ].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
          </dl>
        </>}
        {!row.contacted && <div className="booking-actions"><small>{acknowledged ? "提醒已停止 · 请及时联系客户" : "首次提醒已发送 · 6 小时未确认将再次提醒"}</small>{acknowledged ? <span className="acknowledged-copy"><CheckCircledIcon /> 已确认接收</span> : <button onClick={() => acknowledgeRequest(row.id)}>确认接收</button>}</div>}</article>;
    })}<button className="text-button back-home" onClick={flow.pop}>返回个人中心</button>
  </main></MobileScroll>;
}
function ServiceArea({ flow }: { flow: FlowControls }) { return <MobileScroll className="app-screen ivory-screen"><main className="standard-page area-page"><SewingPinIcon /><p className="eyebrow">上门服务范围</p><h1>昆山及周边地区</h1><p>昆山各区域优先承接，苏州、上海及合理距离内的周边地区均可预约。跨区域服务将结合交通、运输及人员配置确认相关费用。</p><div><strong>场地选择灵活</strong><span>支持客户自选场地，也可咨询工作室合作场地</span></div><button className="gold-button" onClick={() => flow.push(bookingScreen(true))}>预约定制服务</button><button className="text-button" onClick={flow.pop}>返回上一页</button></main></MobileScroll>; }

function homeScreen(): FlowScreen { return { id: "home", footerHeight: 58, footer: (flow) => <AppFooter active="home" flow={flow} />, render: (flow) => <Home flow={flow} /> }; }
function servicesScreen(withBack = false, category: ServiceName = "派对布置"): FlowScreen { return { id: `services-${category}`, header: withBack ? (flow) => <AppHeader title="服务方案" flow={flow} /> : undefined, headerHeight: withBack ? 48 : undefined, footerHeight: withBack ? undefined : 58, footer: withBack ? undefined : (flow) => <AppFooter active="services" flow={flow} />, render: (flow) => <Services flow={flow} initialCategory={category} /> }; }
function detailScreen(item: PackageItem): FlowScreen { return { id: `detail-${item.id}`, header: (flow) => <AppHeader title="方案详情" flow={flow} />, headerHeight: 48, footerHeight: 76, footer: (flow) => <div className="detail-footer"><div><small>{item.price === "价格面议" ? "根据需求定制" : "参考起价"}</small><b>{displayPrice(item.price)}</b></div><button className="gold-button" onClick={() => flow.push(bookingScreen(true, item))}>预约此方案</button></div>, render: () => <Detail item={item} /> }; }
function bookingScreen(withBack = false, item?: PackageItem): FlowScreen { return { id: item ? `booking-${item.id}` : "booking", header: withBack ? (flow) => <AppHeader title="预约服务" flow={flow} /> : undefined, headerHeight: withBack ? 48 : undefined, footerHeight: withBack ? undefined : 58, footer: withBack ? undefined : (flow) => <AppFooter active="booking" flow={flow} />, render: (flow) => <BookingForm flow={flow} item={item} standalone={!withBack} /> }; }
function successScreen(): FlowScreen { return { id: "success", render: (flow) => <Success flow={flow} /> }; }
function mineScreen(): FlowScreen { return { id: "mine", footerHeight: 58, footer: (flow) => <AppFooter active="mine" flow={flow} />, render: (flow) => <Mine flow={flow} /> }; }
function ownerScreen(): FlowScreen { return { id: "owner", header: (flow) => <AppHeader title="商家工作台" flow={flow} />, headerHeight: 48, render: (flow) => <Owner flow={flow} /> }; }
function serviceAreaScreen(): FlowScreen { return { id: "service-area", header: (flow) => <AppHeader title="服务范围" flow={flow} />, headerHeight: 48, render: (flow) => <ServiceArea flow={flow} /> }; }

export default function Prototype() {
  const initial = useMemo(() => homeScreen(), []);
  const [requests, setRequests] = useState<BookingRequest[]>([]);
  const [acknowledgedRequestIds, setAcknowledgedRequestIds] = useState<number[]>([]);
  const [merchantPackages, setMerchantPackages] = useState<PackageItem[]>([]);
  const [hiddenPackageIds, setHiddenPackageIds] = useState<string[]>([]);
  const value = useMemo<BookingContextValue>(() => ({
    requests,
    addRequest: (request: BookingRequest) => setRequests((previous) => [request, ...previous]),
    acknowledgedRequestIds,
    acknowledgeRequest: (id: number) => setAcknowledgedRequestIds((previous) => previous.includes(id) ? previous : [...previous, id]),
  }), [requests, acknowledgedRequestIds]);
  const catalogueValue = useMemo<CatalogueContextValue>(() => ({
    merchantPackages,
    addMerchantPackage: (item: PackageItem) => setMerchantPackages((previous) => [item, ...previous]),
    removeMerchantPackage: (id: string) => {
      setMerchantPackages((previous) => previous.filter((item) => item.id !== id));
      setHiddenPackageIds((previous) => previous.filter((itemId) => itemId !== id));
    },
    hiddenPackageIds,
    togglePackageVisibility: (id: string) => setHiddenPackageIds((previous) => previous.includes(id) ? previous.filter((itemId) => itemId !== id) : [...previous, id]),
  }), [merchantPackages, hiddenPackageIds]);
  return <CatalogueContext.Provider value={catalogueValue}><BookingContext.Provider value={value}><FlowStack initial={initial} /></BookingContext.Provider></CatalogueContext.Provider>;
}

