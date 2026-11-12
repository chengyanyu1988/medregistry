export type KBCategory = '采集知识库' | '检验指标临床知识库' | '标本不合格拒收标准' | '危急值处置指南';

export interface CollectionKBItem {
  id: string;
  category: '采集知识库';
  title: string; // 采集方式
  specimenType: string; // 标本类型
  tubeType: string; // 试管/容器
  storageCondition: string; // 保存条件
  steps: string[]; // 采集步骤
  precautions: string[]; // 注意事项
  author: string;
  updatedAt: string;
}

export interface IndicatorKBItem {
  id: string;
  category: '检验指标临床知识库';
  title: string; // 项目/指标名称
  englishName: string; // 英文名
  refRange: string; // 参考区间
  unit: string; // 单位
  clinicalSignificance: string[]; // 临床诊断意义
  interferingFactors: string[]; // 影响/干扰因素
  author: string;
  updatedAt: string;
}

export interface RejectionKBItem {
  id: string;
  category: '标本不合格拒收标准';
  title: string; // 不合格类型
  specimenType: string; // 适用标本
  rejectionReason: string; // 拒收原因分析
  handlingProcedure: string[]; // 处理流程与沟通要求
  preventionAdvice: string; // 预防改善建议
  author: string;
  updatedAt: string;
}

export interface CrisisGuidelineKBItem {
  id: string;
  category: '危急值处置指南';
  title: string; // 指标/危急值名称
  crisisThreshold: string; // 危急值界限
  clinicalRisk: string; // 临床风险与危害
  actionProtocol: string[]; // 紧急处置标准流程(SOP)
  notifiedRole: string; // 通知角色与闭环要求
  author: string;
  updatedAt: string;
}

export type KBItem = CollectionKBItem | IndicatorKBItem | RejectionKBItem | CrisisGuidelineKBItem;

export const INITIAL_COLLECTION_KB: CollectionKBItem[] = [
  {
    id: 'COL-01',
    category: '采集知识库',
    title: '肘正中静脉真空采血',
    specimenType: '全血/血清/血浆',
    tubeType: '黄头管(促凝) / 紫头管(EDTA) / 蓝头管(枸橼酸钠)',
    storageCondition: '2-8℃ 4小时内送检',
    steps: [
      '1. 查对检验申请单、受检者姓名及是否已按医嘱准备，向受检者解释操作目的取得配合。在采血管上贴好二维码条码标签。',
      '2. 选择血管，常用肘窝静脉、肘正中静脉、前臂内侧静脉，小儿可采用颈外静脉。',
      '3. 在穿刺部位肢体下放一次性垫巾、扎止血带（肘关节上方4-7厘米）。',
      '4. 用复合碘棉签由内向外环形消毒穿刺部位，直径大于5cm。',
      '5. 嘱受检者握紧拳头，使静脉充盈显露。',
      '6. 穿刺：推持使用真空采血技术。持针斜面向上20-30度刺入静脉，见回血后将采血管压入双头采血针另一端，见血流入管后松开止血带，嘱受检者松拳。',
      '7. 采血完毕拔出针头，用无菌棉签压迫止血3-5分钟，严禁揉搓。',
      '8. 产生医疗垃圾按规定分类处置。'
    ],
    precautions: [
      '1. 采血前应核对姓名和检验项目，明确标本要求。',
      '2. 静脉采血时止血带扎结不可超过1分钟，超时可导致血液浓缩与乳酸升高。',
      '3. 严禁在输液同侧手臂采血，防止药物稀释。',
      '4. 严格遵守采血顺序：血培养 -> 凝血管(蓝) -> 促凝管(黄/红) -> 肝素管(绿) -> EDTA管(紫) -> 血糖管(灰)。',
      '5. 含有抗凝剂的采血管采血后须立即缓和颠倒混匀5-8次，防止凝块产生。'
    ],
    author: '张珊',
    updatedAt: '2026-10-30 08:30'
  },
  {
    id: 'COL-02',
    category: '采集知识库',
    title: '桡动脉血气分析穿刺采集',
    specimenType: '动脉血',
    tubeType: '专指肝素锂预喷涂血气针 (2ml)',
    storageCondition: '冰水混合物中0-4℃保存，30分钟内完成检测',
    steps: [
      '1. 检查患者体温与吸氧浓度(FiO2)，穿刺前须进行Allen试验评估手部侧支循环。',
      '2. 确定桡动脉搏动最强点，消毒皮肤与操作者左手食指、中指。',
      '3. 采血针呈45-60度角斜刺入动脉，见鲜红色动脉血自动充盈采血管。',
      '4. 采血1.5ml后拔针，立即将针头刺入橡胶塞封堵绝氧，并无菌干棉球加压止血10分钟。',
      '5. 搓动血气针使其充分抗凝，贴条码并记录患者吸氧状态与体温后送检。'
    ],
    precautions: [
      '1. Allen试验阴性者严禁行桡动脉穿刺，改选股动脉或肱动脉。',
      '2. 绝不能有任何气泡混入血气针内，若有须立即排出。',
      '3. 采血后须严格隔绝空气并立即颠倒混匀。'
    ],
    author: '蔡文斌',
    updatedAt: '2026-10-29 14:15'
  },
  {
    id: 'COL-03',
    category: '采集知识库',
    title: '晨起中段尿液留取',
    specimenType: '随机/晨尿',
    tubeType: '无菌洁净尿杯+10ml尿沉渣管',
    storageCondition: '常温2小时内送检，避光',
    steps: [
      '1. 告知患者留取清晨第一次尿液（在膀胱内储留6-8小时）。',
      '2. 清洁外阴部，弃去前段尿10-20ml。',
      '3. 直接留取中段尿30-50ml于无菌尿杯中。',
      '4. 盖紧杯盖，将尿液倒入专用尿管并贴条码送检。'
    ],
    precautions: [
      '1. 女性应避开月经期，防止红细胞污染。',
      '2. 留样后超过2小时未检测，尿液细菌繁殖及管型溶解破坏。'
    ],
    author: '徐晓丽',
    updatedAt: '2026-10-28 11:00'
  },
  {
    id: 'COL-04',
    category: '采集知识库',
    title: '24小时尿液定量留取',
    specimenType: '24h尿',
    tubeType: '3000ml加盖防腐带刻度集尿桶',
    storageCondition: '冷暗处保存，加防腐剂(甲苯/浓盐酸)',
    steps: [
      '1. 晨7:00排空膀胱弃去尿液，开始计时。',
      '2. 随后24小时内（包括次日晨7:00）的所有尿液全部收集于大桶内。',
      '3. 每次尿后盖紧桶盖，加入对应防腐剂混匀。',
      '4. 24小时留毕，准确量取并记录总尿量(ml)，充分混匀后倒出10ml送检。'
    ],
    precautions: [
      '1. 切勿遗漏任何一次尿液。',
      '2. 根据检测项目选择防腐剂：微量白蛋白选甲苯，17-羟选浓盐酸。'
    ],
    author: '陈志远',
    updatedAt: '2026-10-27 16:20'
  },
  {
    id: 'COL-05',
    category: '采集知识库',
    title: '咽拭子呼吸道病毒核酸采集',
    specimenType: '咽拭子',
    tubeType: '病毒采样管 (含3ml VTM保存液)',
    storageCondition: '2-8℃ 24小时内送检',
    steps: [
      '1. 患者清口，头微仰，发"啊"音暴露咽喉。',
      '2. 采样拭子越过舌根，擦拭两侧扁桃体及咽后壁3-5次。',
      '3. 将拭子放入采样管保存液中，折断手持柄，盖紧管盖。'
    ],
    precautions: [
      '1. 采样前30分钟切勿饮食、漱口或吸烟。',
      '2. 拭子切勿触及牙齿、舌头与唇部。'
    ],
    author: '林德胜',
    updatedAt: '2026-10-26 09:30'
  },
  {
    id: 'COL-06',
    category: '采集知识库',
    title: '双套血培养无菌采血',
    specimenType: '全血',
    tubeType: '需氧血培养瓶 + 厌氧血培养瓶',
    storageCondition: '室温保存，严禁冷藏',
    steps: [
      '1. 严格无菌操作，消毒穿刺点及培养瓶橡胶塞。',
      '2. 建议寒战或发热初起时采血，每瓶采血8-10ml。',
      '3. 先注入需氧瓶，再注入厌氧瓶。'
    ],
    precautions: [
      '1. 必须在抗菌药物使用前采集。',
      '2. 两套血培养须在不同解剖部位（如双侧肘静脉）采集。'
    ],
    author: '赵海琴',
    updatedAt: '2026-10-25 15:10'
  },
  {
    id: 'COL-07',
    category: '采集知识库',
    title: '脑脊液(CSF)三管法穿刺采集',
    specimenType: '脑脊液',
    tubeType: '无菌带盖干燥试管 (1/2/3号)',
    storageCondition: '立即送检，涂片与培养常温，生化可冷藏',
    steps: [
      '1. 配合临床医师腰椎穿刺，依次留取3管，每管1-2ml。',
      '2. 第1管做细菌培养，第2管做生化免疫，第3管做细胞计数。'
    ],
    precautions: [
      '1. 穿刺损伤出血时第1管可显红，第3管澄清；若三管均红为蛛网膜下腔出血。',
      '2. 脑脊液标本极其珍贵，不可冷冻。'
    ],
    author: '黄雅芳',
    updatedAt: '2026-10-24 10:45'
  },
  {
    id: 'COL-08',
    category: '采集知识库',
    title: '粪便隐血及寄生虫卵留取',
    specimenType: '粪便',
    tubeType: '带采集勺专用便盒',
    storageCondition: '常温1小时内送检',
    steps: [
      '1. 用便盒小勺挑取含脓血、黏液或异常外观的粪便3-5g。',
      '2. 盖紧便盒，贴条码送检。'
    ],
    precautions: [
      '1. 切勿混入尿液、水或消毒剂。',
      '2. 化学法隐血试验前3天禁食动物血、红肉及大量维生素C。'
    ],
    author: '刘洋',
    updatedAt: '2026-10-23 13:20'
  },
  {
    id: 'COL-09',
    category: '采集知识库',
    title: '指尖毛细血管微量采血',
    specimenType: '末梢血',
    tubeType: '微量EDTA抗凝管 (200μl)',
    storageCondition: '室温1小时内检测',
    steps: [
      '1. 选无名指指端内侧，消毒干燥。',
      '2. 一次性采血针快速刺入2mm，拭去第一滴血。',
      '3. 自然流出血液吸入微量管，轻轻挤压不可用力过度。'
    ],
    precautions: [
      '1. 第一滴血含组织液须弃去。',
      '2. 过度挤压会导致组织液混入造成稀释误差。'
    ],
    author: '徐晓丽',
    updatedAt: '2026-10-22 17:00'
  },
  {
    id: 'COL-10',
    category: '采集知识库',
    title: '胸腹水/心包积液穿刺留取',
    specimenType: '浆膜腔积液',
    tubeType: '肝素抗凝管 + 无菌干燥管',
    storageCondition: '2-8℃ 2小时内送检',
    steps: [
      '1. 协助临床医师行浆膜腔穿刺。',
      '2. 留取抗凝管做细胞学与积液常规，干燥管做生化与肿瘤标志物。'
    ],
    precautions: [
      '1. 必须加入抗凝剂防止积液凝固影响细胞计数。'
    ],
    author: '张珊',
    updatedAt: '2026-10-21 11:30'
  },
  {
    id: 'COL-11',
    category: '采集知识库',
    title: '精液常规与动力学分析采集',
    specimenType: '精液',
    tubeType: '无菌聚乙烯宽口采集杯',
    storageCondition: '37℃保温，1小时内送达实验室',
    steps: [
      '1. 禁欲2-7天后，手淫法将全部精液排入无菌杯中。',
      '2. 记录完整排精时间并贴条码送检。'
    ],
    precautions: [
      '1. 切勿遗漏前段高浓度精液。',
      '2. 送检过程中必须保存在20-37℃环境，切勿冷冻。'
    ],
    author: '蔡文斌',
    updatedAt: '2026-10-20 09:10'
  },
  {
    id: 'COL-12',
    category: '采集知识库',
    title: '痰涂片与结核菌培养采集',
    specimenType: '晨痰',
    tubeType: '无菌广口旋盖痰盒',
    storageCondition: '2-8℃ 2小时内送检',
    steps: [
      '1. 清晨留取，清水反复漱口。',
      '2. 深呼吸后用力咳出气管深部的脓粘痰于痰盒中。'
    ],
    precautions: [
      '1. 切勿留取唾液或鼻咽分泌物。'
    ],
    author: '赵海琴',
    updatedAt: '2026-10-19 14:40'
  }
];

export const INITIAL_INDICATOR_KB: IndicatorKBItem[] = [
  {
    id: 'IND-01',
    category: '检验指标临床知识库',
    title: '丙氨酸氨基转移酶 (ALT)',
    englishName: 'ALT / GPT',
    refRange: '9.0 - 50.0 U/L',
    unit: 'U/L',
    clinicalSignificance: [
      '1. 肝脏疾病灵敏指标：ALT主要存在于肝细胞浆中，肝细胞损伤（如急性病毒性肝炎、药物性肝损伤、脂肪肝、肝硬化）时显著升高。',
      '2. 胆道疾病：胆管炎、胆石症伴胆道梗阻时轻中度升高。',
      '3. 其他：心肌梗死、骨骼肌损伤、剧烈运动后可一过性轻度升高。'
    ],
    interferingFactors: [
      '1. 溶血标本导致结果偏高（红细胞内ALT浓度高于血清）。',
      '2. 服用对乙酰氨基酚、他汀类、抗结核药可致药源性升高。',
      '3. 重度脂血对比色法存在光度干扰。'
    ],
    author: '张珊',
    updatedAt: '2026-10-30 09:00'
  },
  {
    id: 'IND-02',
    category: '检验指标临床知识库',
    title: '促甲状腺素 (TSH)',
    englishName: 'TSH',
    refRange: '0.27 - 4.20 mIU/L',
    unit: 'mIU/L',
    clinicalSignificance: [
      '1. 甲状腺功能异常筛查第一线指标：TSH对游离甲状腺素(FT4)微小变化高度敏感。',
      '2. 升高：原发性甲状腺功能减退症(原发甲减)、亚临床甲减、TSH分泌瘤。',
      '3. 降低：原发性甲状腺功能亢进症(原发甲亢)、亚临床甲亢、Graves病、垂体性甲减。'
    ],
    interferingFactors: [
      '1. 嗜异性抗体(HAMA)或生物素(Biotin > 5mg/d)干扰电化学发光测定。',
      '2. 妊娠早期HCG高浓度可轻度抑制TSH。'
    ],
    author: '陈志远',
    updatedAt: '2026-10-29 11:30'
  },
  {
    id: 'IND-03',
    category: '检验指标临床知识库',
    title: '高敏肌钙蛋白I (hs-cTnI)',
    englishName: 'hs-cTnI',
    refRange: '0.00 - 26.20 pg/mL',
    unit: 'pg/mL',
    clinicalSignificance: [
      '1. 急性心肌梗死(AMI)诊断金标准：心肌损伤后2-4小时升高，12-24小时达高峰，持续5-10天。',
      '2. 动态监测：0/1h或0/3h算法用于急诊胸痛快速分流与排除。',
      '3. 非心梗升高：重症心衰、心肌炎、肺栓塞、严重肾功能衰竭。'
    ],
    interferingFactors: [
      '1. 类风湿因子(RF)阳性或高浓度异嗜性抗体。',
      '2. 严重纤维蛋白未完全凝固产生的微凝块干扰。'
    ],
    author: '蔡文斌',
    updatedAt: '2026-10-28 15:00'
  },
  {
    id: 'IND-04',
    category: '检验指标临床知识库',
    title: '血红蛋白浓度 (HGB)',
    englishName: 'HGB',
    refRange: '男 130-175 g/L / 女 115-150 g/L',
    unit: 'g/L',
    clinicalSignificance: [
      '1. 贫血分级标准：< 120g/L(男)或 < 110g/L(女)为贫血；<60g/L为重度贫血，<30g/L为极重度。',
      '2. 增高：真性红细胞增多症、严重脱水导致血液浓缩、高山慢性缺氧。'
    ],
    interferingFactors: [
      '1. 重度脂血(乳糜血)导致吸光度异常升高，HGB假性偏高。',
      '2. WBC极高(>100x10^9/L)可致浑浊度增加。'
    ],
    author: '徐晓丽',
    updatedAt: '2026-10-27 10:20'
  },
  {
    id: 'IND-05',
    category: '检验指标临床知识库',
    title: 'D-二聚体 (D-Dimer)',
    englishName: 'D-Dimer',
    refRange: '0.00 - 0.50 mg/L FEU',
    unit: 'mg/L FEU',
    clinicalSignificance: [
      '1. 深静脉血栓(DVT)与肺栓塞(PE)阴性排除关键指标（阴性预测值>95%）。',
      '2. 继发性纤溶亢进标志：DIC、急性心梗、外科术后、恶性肿瘤均可升高。'
    ],
    interferingFactors: [
      '1. 标本微凝块致假性降低；抗凝剂比例不当(小于1:9)导致偏高。',
      '2. 高黄疸或高脂血干扰浊度测定。'
    ],
    author: '林德胜',
    updatedAt: '2026-10-26 14:00'
  }
];

export const INITIAL_REJECTION_KB: RejectionKBItem[] = [
  {
    id: 'REJ-01',
    category: '标本不合格拒收标准',
    title: '标本体外严重溶血 (Hemolysis)',
    specimenType: '血清 / 血浆',
    rejectionReason: '红细胞破裂释放大量K+、LDH、AST、ALT、Mg2+及游离血红蛋白，严重干扰比色法与发光免疫分析。',
    handlingProcedure: [
      '1. 标本签收工位及时拍照留存并录入LIS系统标记“体外溶血退单”。',
      '2. 电话通知采血科室/病区责任护士，告知溶血原因。',
      '3. 重新开单并免费重新采血送检。'
    ],
    preventionAdvice: '采血时选用合适针头、避免用力抽吸、注入试管时去针头顺管壁缓缓注入，颠倒混匀切勿剧烈摇晃。',
    author: '黄雅芳',
    updatedAt: '2026-10-30 08:00'
  },
  {
    id: 'REJ-02',
    category: '标本不合格拒收标准',
    title: '抗凝管内微小凝块形成 (Clot)',
    specimenType: 'EDTA全血 (血常规) / 枸橼酸血浆 (凝血)',
    rejectionReason: '微凝块消耗血小板与纤维蛋白原，导致WBC/PLT计数严重假性降低及凝血时间异常延长，且易堵塞流水线加样针。',
    handlingProcedure: [
      '1. 使用竹签或微量倾斜观察发现凝块后立即拒收。',
      '2. LIS标记“标本凝固拒收”，通知重采。'
    ],
    preventionAdvice: '采血后必须立即颠倒混匀5-8次，确保抗凝剂与血液充分接触。',
    author: '徐晓丽',
    updatedAt: '2026-10-29 16:10'
  },
  {
    id: 'REJ-03',
    category: '标本不合格拒收标准',
    title: '采血量不足或抗凝比例失调',
    specimenType: '蓝头凝血管 / 灰头血糖管',
    rejectionReason: '蓝头管要求抗凝剂与血液比例严格为1:9。采血量不足导致抗凝剂过量，钙离子过度螯合，PT/APTT极度延长。',
    handlingProcedure: [
      '1. 核对试管刻度线（误差须在±10%以内）。',
      '2. 欠量标本拒收退单，通知重新按标准刻度采血。'
    ],
    preventionAdvice: '使用真空采血针采血，等待负压自然吸尽至刻度线后再拔管。',
    author: '刘洋',
    updatedAt: '2026-10-28 09:30'
  }
];

export const INITIAL_CRISIS_KB: CrisisGuidelineKBItem[] = [
  {
    id: 'CRI-01',
    category: '危急值处置指南',
    title: '血清钾 (K+) 极限危急值',
    crisisThreshold: '低钾危急值 < 2.8 mmol/L 或 高钾危急值 > 6.2 mmol/L',
    clinicalRisk: '高钾血症可致室颤、心室停搏与心脏骤停；低钾血症可致严重心律失常、呼吸肌麻痹。',
    actionProtocol: [
      '1. 检验人员发现后立即核对标本有无溶血、输液污染，并原管复查。',
      '2. 复查无误后5分钟内通过LIS危急值系统向临床科室发出声光报警。',
      '3. 必须电话直连临床责任医师/值班护士，口述“患者姓名、住院号、项目、结果值”。',
      '4. 督促临床医师在30分钟内完成电话确认与临床处置，并在系统内完成闭环追溯记录。'
    ],
    notifiedRole: '临床主管医师、值班护士、科室质控员',
    author: '张珊',
    updatedAt: '2026-10-30 08:15'
  },
  {
    id: 'CRI-02',
    category: '危急值处置指南',
    title: '血小板计数 (PLT) 极限危急值',
    crisisThreshold: '低值 < 20 × 10^9/L 或 高值 > 1000 × 10^9/L',
    clinicalRisk: 'PLT < 20x10^9/L 随时可能发生自发性颅内出血与内脏大出血，生命体征极度危险。',
    actionProtocol: [
      '1. 立即推片进行人工显微镜复核，排除EDTA依赖性假性血小板减少(PTCP)。',
      '2. 确认无误后上报危急值，通知临床做好血小板输注准备。'
    ],
    notifiedRole: '主治医师、血液科会诊医师',
    author: '徐晓丽',
    updatedAt: '2026-10-29 10:00'
  }
];
