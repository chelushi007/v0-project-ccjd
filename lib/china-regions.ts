// 中国省-市-区（县）三级行政区划数据
// 覆盖 4 直辖市 + 23 省 + 5 自治区 + 2 特别行政区
// 每个省/市/区均含若干代表性下级条目，可用于仓储所在地的三级联动选择

export interface DistrictNode {
  name: string
}

export interface CityNode {
  name: string
  districts: DistrictNode[]
}

export interface ProvinceNode {
  name: string
  /** 行政等级类型，便于在 UI 上区分展示 */
  type: "municipality" | "province" | "autonomous" | "sar"
  cities: CityNode[]
}

const d = (...names: string[]): DistrictNode[] => names.map((name) => ({ name }))

export const CHINA_REGIONS: ProvinceNode[] = [
  // ---------- 直辖市 ----------
  {
    name: "北京市",
    type: "municipality",
    cities: [
      { name: "北京城区", districts: d("东城区", "西城区", "朝阳区", "海淀区", "丰台区", "石景山区") },
      { name: "北京近郊", districts: d("通州区", "顺义区", "大兴区", "昌平区", "房山区") },
      { name: "北京远郊", districts: d("怀柔区", "平谷区", "密云区", "延庆区", "门头沟区") },
    ],
  },
  {
    name: "天津市",
    type: "municipality",
    cities: [
      { name: "中心城区", districts: d("和平区", "河东区", "河西区", "南开区", "河北区", "红桥区") },
      { name: "环城新区", districts: d("东丽区", "西青区", "津南区", "北辰区") },
      { name: "滨海及远郊", districts: d("滨海新区", "宝坻区", "武清区", "宁河区", "静海区", "蓟州区") },
    ],
  },
  {
    name: "上海市",
    type: "municipality",
    cities: [
      { name: "中心城区", districts: d("黄浦区", "徐汇区", "长宁区", "静安区", "普陀区", "虹口区", "杨浦区") },
      { name: "近郊", districts: d("浦东新区", "闵行区", "宝山区", "嘉定区") },
      { name: "远郊", districts: d("金山区", "松江区", "青浦区", "奉贤区", "崇明区") },
    ],
  },
  {
    name: "重庆市",
    type: "municipality",
    cities: [
      { name: "主城都市区", districts: d("渝中区", "江北区", "南岸区", "九龙坡区", "沙坪坝区", "渝北区", "巴南区", "大渡口区") },
      { name: "渝西片区", districts: d("永川区", "江津区", "合川区", "璧山区", "铜梁区", "大足区", "荣昌区") },
      { name: "渝东北 / 渝东南", districts: d("万州区", "黔江区", "涪陵区", "开州区", "云阳县", "奉节县") },
    ],
  },

  // ---------- 华北 ----------
  {
    name: "河北省",
    type: "province",
    cities: [
      { name: "石家庄市", districts: d("长安区", "桥西区", "新华区", "裕华区", "鹿泉区", "藁城区", "正定县") },
      { name: "唐山市", districts: d("路南区", "路北区", "古冶区", "开平区", "丰润区", "曹妃甸区") },
      { name: "保定市", districts: d("竞秀区", "莲池区", "满城区", "清苑区", "徐水区") },
      { name: "廊坊市", districts: d("安次区", "广阳区", "三河市", "霸州市", "固安县") },
      { name: "邯郸市", districts: d("丛台区", "邯山区", "复兴区", "永年区") },
    ],
  },
  {
    name: "山西省",
    type: "province",
    cities: [
      { name: "太原市", districts: d("小店区", "迎泽区", "杏花岭区", "尖草坪区", "万柏林区", "晋源区") },
      { name: "大同市", districts: d("平城区", "云冈区", "新荣区", "云州区") },
      { name: "长治市", districts: d("潞州区", "上党区", "屯留区", "潞城区") },
      { name: "运城市", districts: d("盐湖区", "永济市", "河津市") },
    ],
  },

  // ---------- 东北 ----------
  {
    name: "辽宁省",
    type: "province",
    cities: [
      { name: "沈阳市", districts: d("和平区", "沈河区", "皇姑区", "铁西区", "大东区", "浑南区", "于洪区") },
      { name: "大连市", districts: d("中山区", "西岗区", "沙河口区", "甘井子区", "金州区", "旅顺口区") },
      { name: "鞍山市", districts: d("铁东区", "铁西区", "立山区", "千山区") },
      { name: "营口市", districts: d("站前区", "西市区", "鲅鱼圈区", "老边区") },
    ],
  },
  {
    name: "吉林省",
    type: "province",
    cities: [
      { name: "长春市", districts: d("南关区", "宽城区", "朝阳区", "二道区", "绿园区", "双阳区", "九台区") },
      { name: "吉林市", districts: d("船营区", "昌邑区", "龙潭区", "丰满区") },
      { name: "四平市", districts: d("铁西区", "铁东区", "公主岭市") },
    ],
  },
  {
    name: "黑龙江省",
    type: "province",
    cities: [
      { name: "哈尔滨市", districts: d("道里区", "南岗区", "道外区", "香坊区", "松北区", "平房区", "呼兰区") },
      { name: "齐齐哈尔市", districts: d("龙沙区", "建华区", "铁锋区", "昂昂溪区") },
      { name: "大庆市", districts: d("萨尔图区", "龙凤区", "让胡路区", "红岗区", "大同区") },
    ],
  },

  // ---------- 华东 ----------
  {
    name: "江苏省",
    type: "province",
    cities: [
      { name: "南京市", districts: d("玄武区", "秦淮区", "建邺区", "鼓楼区", "栖霞区", "雨花台区", "江宁区", "浦口区") },
      { name: "苏州市", districts: d("姑苏区", "虎丘区", "吴中区", "相城区", "吴江区", "工业园区", "高新区") },
      { name: "无锡市", districts: d("梁溪区", "锡山区", "惠山区", "滨湖区", "新吴区") },
      { name: "南通市", districts: d("崇川区", "通州区", "海门区", "如皋市") },
      { name: "徐州市", districts: d("云龙区", "鼓楼区", "泉山区", "贾汪区", "铜山区") },
    ],
  },
  {
    name: "浙江省",
    type: "province",
    cities: [
      { name: "杭州市", districts: d("上城区", "拱墅区", "西湖区", "滨江区", "萧山区", "余杭区", "临平区", "钱塘区") },
      { name: "宁波市", districts: d("海曙区", "江北区", "北仑区", "镇海区", "鄞州区", "奉化区") },
      { name: "温州市", districts: d("鹿城区", "龙湾区", "瓯海区", "洞头区", "瑞安市", "乐清市") },
      { name: "嘉兴市", districts: d("南湖区", "秀洲区", "海宁市", "桐乡市") },
      { name: "金华市", districts: d("婺城区", "金东区", "义乌市", "永康市") },
    ],
  },
  {
    name: "安徽省",
    type: "province",
    cities: [
      { name: "合肥市", districts: d("瑶海区", "庐阳区", "蜀山区", "包河区", "肥东县", "肥西县") },
      { name: "芜湖市", districts: d("镜湖区", "弋江区", "鸠江区", "湾沚区") },
      { name: "蚌埠市", districts: d("龙子湖区", "蚌山区", "禹会区", "淮上区") },
    ],
  },
  {
    name: "福建省",
    type: "province",
    cities: [
      { name: "福州市", districts: d("鼓楼区", "台江区", "仓山区", "马尾区", "晋安区", "长乐区") },
      { name: "厦门市", districts: d("思明区", "湖里区", "海沧区", "集美区", "同安区", "翔安区") },
      { name: "泉州市", districts: d("鲤城区", "丰泽区", "洛江区", "晋江市", "石狮市") },
    ],
  },
  {
    name: "江西省",
    type: "province",
    cities: [
      { name: "南昌市", districts: d("东湖区", "西湖区", "青云谱区", "青山湖区", "新建区", "红谷滩区") },
      { name: "九江市", districts: d("浔阳区", "濂溪区", "柴桑区", "瑞昌市") },
      { name: "赣州市", districts: d("章贡区", "南康区", "赣县区", "瑞金市") },
    ],
  },
  {
    name: "山东省",
    type: "province",
    cities: [
      { name: "济南市", districts: d("历下区", "市中区", "槐荫区", "天桥区", "历城区", "长清区", "章丘区") },
      { name: "青岛市", districts: d("市南区", "市北区", "李沧区", "崂山区", "城阳区", "黄岛区", "即墨区") },
      { name: "烟台市", districts: d("芝罘区", "福山区", "牟平区", "莱山区", "蓬莱区") },
      { name: "潍坊市", districts: d("潍城区", "寒亭区", "坊子区", "奎文区", "青州市") },
      { name: "淄博市", districts: d("张店区", "淄川区", "博山区", "临淄区", "周村区") },
    ],
  },

  // ---------- 华中 ----------
  {
    name: "河南省",
    type: "province",
    cities: [
      { name: "郑州市", districts: d("中原区", "二七区", "管城回族区", "金水区", "惠济区", "上街区", "中牟县") },
      { name: "洛阳市", districts: d("老城区", "西工区", "瀍河回族区", "涧西区", "洛龙区") },
      { name: "开封市", districts: d("鼓楼区", "龙亭区", "顺河回族区", "禹王台区") },
      { name: "南阳市", districts: d("宛城区", "卧龙区", "邓州市") },
    ],
  },
  {
    name: "湖北省",
    type: "province",
    cities: [
      { name: "武汉市", districts: d("江岸区", "江汉区", "硚口区", "汉阳区", "武昌区", "青山区", "洪山区", "东西湖区") },
      { name: "宜昌市", districts: d("西陵区", "伍家岗区", "点军区", "猇亭区", "夷陵区") },
      { name: "襄阳市", districts: d("襄城区", "樊城区", "襄州区") },
    ],
  },
  {
    name: "湖南省",
    type: "province",
    cities: [
      { name: "长沙市", districts: d("芙蓉区", "天心区", "岳麓区", "开福区", "雨花区", "望城区", "长沙县") },
      { name: "株洲市", districts: d("天元区", "荷塘区", "芦淞区", "石峰区") },
      { name: "湘潭市", districts: d("雨湖区", "岳塘区", "湘潭县") },
      { name: "衡阳市", districts: d("珠晖区", "雁峰区", "石鼓区", "蒸湘区") },
    ],
  },

  // ---------- 华南 ----------
  {
    name: "广东省",
    type: "province",
    cities: [
      { name: "广州市", districts: d("越秀区", "海珠区", "荔湾区", "天河区", "白云区", "黄埔区", "番禺区", "南沙区", "增城区", "从化区") },
      { name: "深圳市", districts: d("福田区", "罗湖区", "南山区", "盐田区", "宝安区", "龙岗区", "龙华区", "坪山区", "光明区", "大鹏新区") },
      { name: "佛山市", districts: d("禅城区", "南海区", "顺德区", "高明区", "三水区") },
      { name: "东莞市", districts: d("莞城街道", "南城街道", "虎门镇", "长安镇", "厚街镇", "松山湖") },
      { name: "珠海市", districts: d("香洲区", "斗门区", "金湾区", "横琴新区") },
      { name: "中山市", districts: d("石岐街道", "东区街道", "西区街道", "南区街道", "火炬开发区") },
      { name: "惠州市", districts: d("惠城区", "惠阳区", "博罗县", "惠东县") },
      { name: "汕头市", districts: d("金平区", "龙湖区", "濠江区", "潮阳区", "潮南区") },
    ],
  },
  {
    name: "海南省",
    type: "province",
    cities: [
      { name: "海口市", districts: d("龙华区", "秀英区", "琼山区", "美兰区") },
      { name: "三亚市", districts: d("海棠区", "吉阳区", "天涯区", "崖州区") },
      { name: "省直辖县级", districts: d("儋州市", "琼海市", "万宁市", "文昌市") },
    ],
  },

  // ---------- 西南 ----------
  {
    name: "四川省",
    type: "province",
    cities: [
      { name: "成都市", districts: d("锦江区", "青羊区", "金牛区", "武侯区", "成华区", "龙泉驿区", "青白江区", "新都区", "温江区", "双流区") },
      { name: "绵阳市", districts: d("涪城区", "游仙区", "安州区", "江油市") },
      { name: "德阳市", districts: d("旌阳区", "罗江区", "广汉市", "什邡市") },
      { name: "宜宾市", districts: d("翠屏区", "南溪区", "叙州区") },
    ],
  },
  {
    name: "贵州省",
    type: "province",
    cities: [
      { name: "贵阳市", districts: d("南明区", "云岩区", "花溪区", "乌当区", "白云区", "观山湖区") },
      { name: "遵义市", districts: d("红花岗区", "汇川区", "播州区", "仁怀市") },
      { name: "六盘水市", districts: d("钟山区", "六枝特区", "水城区", "盘州市") },
    ],
  },
  {
    name: "云南省",
    type: "province",
    cities: [
      { name: "昆明市", districts: d("五华区", "盘龙区", "官渡区", "西山区", "呈贡区", "晋宁区") },
      { name: "曲靖市", districts: d("麒麟区", "沾益区", "马龙区", "宣威市") },
      { name: "玉溪市", districts: d("红塔区", "江川区", "澄江市") },
    ],
  },

  // ---------- 西北 ----------
  {
    name: "陕西省",
    type: "province",
    cities: [
      { name: "西安市", districts: d("新城区", "碑林区", "莲湖区", "雁塔区", "未央区", "灞桥区", "长安区", "高陵区") },
      { name: "宝鸡市", districts: d("渭滨区", "金台区", "陈仓区", "凤翔区") },
      { name: "咸阳市", districts: d("秦都区", "渭城区", "杨陵区", "兴平市") },
    ],
  },
  {
    name: "甘肃省",
    type: "province",
    cities: [
      { name: "兰州市", districts: d("城关区", "七里河区", "西固区", "安宁区", "红古区", "永登县") },
      { name: "天水市", districts: d("秦州区", "麦积区") },
      { name: "酒泉市", districts: d("肃州区", "玉门市", "敦煌市") },
    ],
  },
  {
    name: "青海省",
    type: "province",
    cities: [
      { name: "西宁市", districts: d("城东区", "城中区", "城西区", "城北区", "湟中区", "湟源县") },
      { name: "海东市", districts: d("乐都区", "平安区", "民和回族土族自治县") },
    ],
  },
  {
    name: "台湾省",
    type: "province",
    cities: [
      { name: "台北市", districts: d("中正区", "大同区", "中山区", "信义区", "大安区") },
      { name: "高雄市", districts: d("盐埕区", "鼓山区", "前金区", "苓雅区") },
      { name: "台中市", districts: d("中区", "东区", "南区", "西区", "北区") },
    ],
  },

  // ---------- 自治区 ----------
  {
    name: "内蒙古自治区",
    type: "autonomous",
    cities: [
      { name: "呼和浩特市", districts: d("新城区", "回民区", "玉泉区", "赛罕区", "土默特左旗") },
      { name: "包头市", districts: d("昆都仑区", "青山区", "东河区", "九原区") },
      { name: "鄂尔多斯市", districts: d("东胜区", "康巴什区", "伊金霍洛旗") },
    ],
  },
  {
    name: "广西壮族自治区",
    type: "autonomous",
    cities: [
      { name: "南宁市", districts: d("青秀区", "兴宁区", "江南区", "西乡塘区", "良庆区", "邕宁区", "武鸣区") },
      { name: "柳州市", districts: d("城中区", "鱼峰区", "柳南区", "柳北区", "柳江区") },
      { name: "桂林市", districts: d("秀峰区", "叠彩区", "象山区", "七星区", "雁山区", "临桂区") },
      { name: "北海市", districts: d("海城区", "银海区", "铁山港区", "合浦县") },
    ],
  },
  {
    name: "西藏自治区",
    type: "autonomous",
    cities: [
      { name: "拉萨市", districts: d("城关区", "堆龙德庆区", "达孜区", "林周县") },
      { name: "日喀则市", districts: d("桑珠孜区", "南木林县", "江孜县") },
      { name: "林芝市", districts: d("巴宜区", "工布江达县", "米林县") },
    ],
  },
  {
    name: "宁夏回族自治区",
    type: "autonomous",
    cities: [
      { name: "银川市", districts: d("兴庆区", "西夏区", "金凤区", "永宁县", "贺兰县") },
      { name: "石嘴山市", districts: d("大武口区", "惠农区", "平罗县") },
      { name: "吴忠市", districts: d("利通区", "红寺堡区", "青铜峡市") },
    ],
  },
  {
    name: "新疆维吾尔自治区",
    type: "autonomous",
    cities: [
      { name: "乌鲁木齐市", districts: d("天山区", "沙依巴克区", "新市区", "水磨沟区", "头屯河区", "达坂城区", "米东区") },
      { name: "克拉玛依市", districts: d("克拉玛依区", "独山子区", "白碱滩区", "乌尔禾区") },
      { name: "喀什地区", districts: d("喀什市", "疏附县", "疏勒县") },
    ],
  },

  // ---------- 特别行政区 ----------
  {
    name: "香港特别行政区",
    type: "sar",
    cities: [
      { name: "香港岛", districts: d("中西区", "湾仔区", "东区", "南区") },
      { name: "九龙", districts: d("油尖旺区", "深水埗区", "九龙城区", "黄大仙区", "观塘区") },
      { name: "新界", districts: d("荃湾区", "屯门区", "元朗区", "北区", "大埔区", "沙田区") },
    ],
  },
  {
    name: "澳门特别行政区",
    type: "sar",
    cities: [
      { name: "澳门半岛", districts: d("花地玛堂区", "圣安多尼堂区", "大堂区", "望德堂区", "风顺堂区") },
      { name: "离岛", districts: d("氹仔", "路环", "路氹城") },
    ],
  },
]

export const REGION_TYPE_LABEL: Record<ProvinceNode["type"], string> = {
  municipality: "直辖市",
  province: "省",
  autonomous: "自治区",
  sar: "特别行政区",
}
