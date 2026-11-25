import { Prisma, PrismaClient } from "./generated/prisma/client.js";

type PricingType = "FIXED" | "PER_UNIT" | "MARKET_PRICE" | "UNSET";

type MenuSeedCategory = {
  code: string;
  name: string;
  dishes: Array<{ name: string; price: number | null; pricingType: PricingType; priceUnit?: string }>;
};

const fixed = (name: string, price: number, priceUnit?: string) => ({
  name, price, pricingType: "FIXED" as const, ...(priceUnit ? { priceUnit } : {}),
});
const perUnit = (name: string, price: number, priceUnit = "lạng") => ({
  name, price, pricingType: "PER_UNIT" as const, priceUnit,
});
const market = (name: string) => ({ name, price: null, pricingType: "MARKET_PRICE" as const });
const unset = (name: string) => ({ name, price: null, pricingType: "UNSET" as const });

const categories: MenuSeedCategory[] = [
  { code: "MAT_CA_CA_CHINH", name: "Mắt cá ngừ & Cá chình", dishes: [
    perUnit("Mắt cá ngừ um dưa cải", 25000), perUnit("Mắt cá ngừ nấu thơm cà", 25000),
    fixed("Cá chình nướng nghệ", 139000), fixed("Cá chình um chuối", 139000),
  ]},
  { code: "CA_BOP", name: "Cá bớp", dishes: [
    perUnit("Cá bớp um dưa cải", 54000), perUnit("Cá bớp nướng nghệ", 54000),
    fixed("Cá bớp nấu cháo", 170000, "nồi"), fixed("Cá bớp nấu chua", 189000, "nồi"),
  ]},
  { code: "CA_CHIM", name: "Cá chim", dishes: [
    ...["Hấp xì dầu", "Nấu chua", "Chiên giòn", "Nướng"].map((n) => perUnit(`Cá chim ${n.toLowerCase()}`, 35000)),
  ]},
  { code: "CA_DIA", name: "Cá dìa", dishes: [
    ...["Hấp xì dầu", "Nấu chua", "Nấu thơm cà", "Kho tiêu xanh"].map((n) => perUnit(`Cá dìa ${n.toLowerCase()}`, 38000)),
  ]},
  { code: "BO_BE", name: "Bò - Bê", dishes: [
    fixed("Bò tái chanh",89000),fixed("Bò bóp thấu",85000),fixed("Bắp bò nướng ớt",89000),
    fixed("Bò xào hành cần",89000),fixed("Bò nhúng giấm",95000),fixed("Bò lúc lắc khoai tây",99000),
    fixed("Bắp bò cay Thái Lan",89000),fixed("Bò tắm tắc cá",95000),fixed("Bắp bò nhúng ớt",95000),
    fixed("Bê non trộn rau má",89000),fixed("Bê non xào lá lốt",89000),fixed("Bê non um nén",89000),
    fixed("Bê non xào mướp",95000),fixed("Bê non hấp mướp",95000),fixed("Bắp bò um tiêu xanh",99000),
    fixed("Gân bò um",99000),fixed("Lưỡi bò sốt pate",89000),fixed("Tủy bò hấp trứng",99000),
    fixed("Tàu hủ khói lửa",120000),
  ]},
  { code: "CA_LOC_DIEU_HONG", name: "Cá lóc - Diêu hồng", dishes: [
    fixed("Cá lóc chiên mắm xoài",99000),fixed("Cá lóc nướng sả ớt",99000),fixed("Cá lóc um chuối",119000),
    fixed("Cá lóc nấu chua",139000),fixed("Cá diêu hồng chiên mắm xoài",109000),fixed("Cá diêu hồng hấp",119000),
  ]},
  { code: "MANG_TRUC", name: "Măng trúc", dishes: [
    fixed("Măng trúc xào tỏi",65000),fixed("Măng trúc xào bò",85000),fixed("Măng trúc xào ba chỉ",79000),
  ]},
  { code: "DO_UONG_KHAC", name: "Đồ uống & Khác", dishes: [
    ...["Huda gold","Huda lon","Huda chai","Huda ice","Tuborg ice","Carlsberg","Larue smooth",
    "Tiger bạc lon","Tiger bạc chai","Tiger nâu lon","Tiger nâu chai","Heineken bạc lon",
    "Larue vàng lon","Larue vàng chai","Pepsi","Sprite","Xá xị","Sting","Nước khoáng",
    "Bò húc","Rượu táo mèo","Voka men","Rượu soju","Thuốc lá các loại"].map(unset),
  ]},
  { code: "ECH_LUON", name: "Ếch - Lươn", dishes: [
    fixed("Ếch xào sả ớt",85000),fixed("Ếch rang muối",85000),fixed("Ếch bóp rau răm",85000),
    fixed("Ếch chiên bơ",85000),fixed("Ếch nướng muối ớt",89000),fixed("Ếch um chuối đậu",95000),
    fixed("Lươn xào sả ớt",85000),fixed("Lươn um chuối đậu",95000),fixed("Lươn um măng",95000),
  ]},
  { code: "CHA_CUA_CHA_CA", name: "Chả cua - Chả cá", dishes: [
    fixed("Chả cua hấp + kim chi",95000),fixed("Chả cua chiên + kim chi",95000),
    fixed("Chả cua nấu khổ qua",95000),fixed("Chả cua xào nấm",95000),fixed("Chả cua um măng",95000),
    fixed("Chả cá chiên",89000),fixed("Chả cá nấu chua / khổ qua",99000),fixed("Chả cá um măng",99000),
  ]},
  { code: "GHE", name: "Ghẹ đỏ - Ghẹ xanh", dishes: [
    market("Ghẹ đỏ hấp sả"),market("Ghẹ đỏ rang me"),market("Ghẹ đỏ rang muối"),
    market("Ghẹ xanh hấp sả"),market("Ghẹ xanh rang me"),market("Ghẹ xanh rang muối"),
  ]},
  { code: "TOM_HUM", name: "Tôm hùm", dishes: [
    market("Tôm hùm hấp"),market("Tôm hùm nướng"),market("Tôm hùm sốt me"),market("Tôm hùm rang muối"),
  ]},
  { code: "CUA_GACH", name: "Cua gạch", dishes: [market("Cua gạch hấp sả"),market("Cua gạch rang me")]},
  { code: "SUON_HEO", name: "Sườn heo", dishes: [
    ...["Sườn sốt chua ngọt","Sườn chiên mắm","Sườn nướng kim chi","Sườn um măng","Sườn nấu lagu"].map(n=>fixed(n,95000)),
    fixed("Sườn non tắm ớt hiểm",120000),
  ]},
  { code: "HEO_TOC", name: "Heo tộc", dishes: [
    fixed("Ba chỉ nướng riềng sả",89000),fixed("Ba chỉ xào dưa cải",89000),fixed("Ba chỉ cháy cạnh",89000),
    fixed("Ba chỉ giòn da",89000),fixed("Giò heo quay tiêu",89000),fixed("Móng heo chiên mắm",85000),
    fixed("Đuôi heo chiên mắm",85000),fixed("Diềm heo nướng",95000),fixed("Heo lên mẹt",185000),
  ]},
  { code: "NUONG_BO_TAI_BAN", name: "Nướng bơ tại bàn", dishes: [
    fixed("Combo 1: Bò + ba chỉ + tôm",129000),fixed("Combo 2: Bạch tuộc + ba chỉ + tôm",129000),
    fixed("Combo 3: Ba chỉ + bạch tuộc + bò",129000),
  ]},
  { code: "GA_QUE", name: "Gà quê (1 con)", dishes: [
    ...["Hấp hành + lòng","Rôti + lòng","Xào sả ớt + lòng","Chiên mắm + lòng","Rang lá chanh + lòng",
    "Rang muối ngũ hành + lòng","Nướng ớt + lòng"].map(n=>fixed(`Gà quê ${n.toLowerCase()}`,269000,"con")),
    ...["Nấu lá giang + lòng","Nấu nấm + lòng","Nấu cháo + lòng"].map(n=>fixed(`Gà quê ${n.toLowerCase()}`,279000,"con")),
    fixed("Gà quê chế biến 2 món",289000,"con"),
  ]},
  { code: "OC", name: "Ốc", dishes: [
    fixed("Ốc đá xào sả",85000),fixed("Ốc bươu hấp sả",99000),fixed("Ốc bươu um gừng",99000),
    fixed("Ốc bươu nướng tiêu xanh",99000),fixed("Ốc hương hấp",99000),fixed("Ốc hương xào sả",99000),
    fixed("Ốc hương rang muối",99000),fixed("Ốc hương rang me",99000),fixed("Ốc hương cháy tỏi",99000),
    fixed("Ốc hương sốt bơ tỏi",99000),
  ]},
  { code: "NGHEU_CHIP_HAU", name: "Nghêu - Chíp - Hàu", dishes: [
    fixed("Nghêu hấp sả",75000),fixed("Nghêu hấp Thái",75000),fixed("Nghêu nướng mỡ hành",79000),
    fixed("Chíp chíp hấp sả",89000),fixed("Chíp chíp hấp Thái",89000),fixed("Chíp chíp xào sả",89000),
    fixed("Hàu nướng mỡ hành",89000),fixed("Hàu nướng phô mai",89000),fixed("Hàu wasabi",95000),
  ]},
  { code: "MUC", name: "Mực", dishes: [
    fixed("Mực chiên mắm",115000),fixed("Mực cơm hấp",135000),fixed("Mực ống hấp",145000),
    fixed("Mực ống xào thơm cà",145000),fixed("Mực lá nướng sate",145000),fixed("Mực lá sốt Thái cay",145000),
    fixed("Mực lá hấp",145000),fixed("Mực ống chiên bơ",145000),
  ]},
  { code: "TOM", name: "Tôm", dishes: [
    fixed("Tôm đất rang muối",85000),fixed("Tôm chiên bơ",85000),fixed("Gỏi tôm Thái Lan sống",89000),
    fixed("Tôm cháy tỏi",99000),fixed("Tôm nướng",99000),fixed("Tôm hấp",99000),fixed("Tôm rang me",99000),
    fixed("Tôm sốt bơ tỏi",99000),fixed("Tôm wasabi",99000),
  ]},
  { code: "CANH", name: "Canh", dishes: [
    ...["Canh cải nấu tôm","Canh mồng tơi nấu tôm","Canh nghêu rau muống","Canh cải nấu tép",
    "Canh rong biển nấu tôm","Canh rong biển nấu nghêu","Canh chua cá"].map(n=>fixed(n,79000)),
  ]},
  { code: "COM_MY", name: "Cơm - Mỳ", dishes: [
    fixed("Cơm chiên trứng",55000),fixed("Cơm chiên hải sản",85000),fixed("Cơm chiên dương châu",79000),
    fixed("Cơm chiên dưa cải thịt bò",79000),fixed("Cơm chiên cá bống rim",79000),
    fixed("Mỳ xào hải sản",89000),fixed("Mỳ xào nấm",70000),fixed("Mỳ xào bò",89000),
  ]},
  { code: "MON_LAU", name: "Món lẩu", dishes: [
    fixed("Lẩu ếch",125000),fixed("Lẩu cá lóc",139000),fixed("Lẩu hải sản",175000),
    fixed("Lẩu Thái Lan",185000),fixed("Lẩu thập cẩm",185000),fixed("Lẩu cá bớp",189000),
    fixed("Lẩu cua đồng (50')",199000),fixed("Lẩu gà lá giang",279000),unset("Lẩu cá dìa"),
  ]},
  { code: "CHAO_SUP", name: "Cháo - Súp", dishes: [
    fixed("Cháo bò",79000),fixed("Cháo tôm",79000),fixed("Cháo nghêu",79000),fixed("Cháo hải sản",85000),
    fixed("Cháo cá bớp",179000),fixed("Súp tôm",79000),fixed("Súp hải sản",85000),fixed("Tàu hủ bò khói lửa",120000),
  ]},
  { code: "KHAI_VI", name: "Món khai vị", dishes: [
    fixed("Khoai tây chiên",49000),fixed("Khoai lang kén",49000),fixed("Đậu khuôn chiên",45000),
    fixed("Đậu khuôn mỡ hành",55000),fixed("Đậu khuôn chà bông",59000),fixed("Dồi sụn chiên",79000),
    fixed("Tàu hủ basa chiên",69000),fixed("Dồi dê chiên",79000),fixed("Nấm biển xào hành",79000),
    fixed("Nấm biển xào bò",89000),
  ]},
  { code: "THO", name: "Món Thỏ", dishes: [
    fixed("Thỏ um giả cầy",129000),fixed("Thỏ nướng",129000),fixed("Thỏ rô ti",129000),
  ]},
  { code: "KHOAI_KHAU", name: "Món Khoái Khẩu", dishes: [
    fixed("Cánh gà chiên mắm",79000),fixed("Bắp non xào hành",49000),fixed("Bầu luộc chấm trứng (3 trứng)",69000),
    fixed("Vịt lộn um bầu (3 trứng)",79000),fixed("Vịt lộn rang me (3 trứng)",79000),fixed("Trứng lộn thêm",12000),
    fixed("Khổ qua nấu thịt hấp",85000),fixed("Lòng cá bớp xào nghệ",85000),fixed("Tủy bò hấp trứng",99000),
  ]},
  { code: "KHO_NHAM_NHI", name: "Món Khô Nhắm Nhí", dishes: [
    fixed("Trứng gà non xào hành",89000),fixed("Trứng gà non xào nấm",95000),fixed("Trứng gà non cháy tỏi",95000),
    fixed("Sụn gà chiên mắm",85000),fixed("Sụn gà rang muối",85000),fixed("Bò dun kim chi",89000),
    fixed("Cá đét chiên mắm",65000),fixed("Cá đét nướng",65000),market("Mực khô nướng"),
  ]},
  { code: "GOI", name: "Món gỏi", dishes: [
    fixed("Gỏi măng trúc hải sản",89000),fixed("Gỏi hải sản chua cay",85000),fixed("Sứa trộn",75000),
    fixed("Gân bò bóp chua",85000),fixed("Sứa mắm nhĩ",85000),fixed("Bắp bò cay Thái Lan",89000),
    fixed("Bê trộn rau má",85000),fixed("Bò bóp thấu",85000),fixed("Gỏi lươn trộn chuối cây",99000),
    fixed("Lưỡi heo bóp chua",85000),
  ]},
  { code: "DAC_SAN", name: "Đặc sản", dishes: [
    fixed("Ram ngũ hành",85000),fixed("Bò tắm tắc cá",89000),fixed("Giò heo quay tiêu",89000),
    fixed("Gỏi cá trích",75000),fixed("Gỏi cá lạc",89000),fixed("Bò một nắng ngũ hành",89000),
    fixed("Bắp bò dầm tỏi",89000),fixed("Lẩu cua đồng (50')",199000),
  ]},
  { code: "DAC_BIET", name: "Món đặc biệt", dishes: [
    fixed("Bò tắm tắc cà",89000),fixed("Bò một nắng ngũ hành",89000),fixed("Chả cua chiên kim chi",95000),
    fixed("Bò dun kim chi",89000),fixed("Khoai môn trộn mực khô chiên",105000),fixed("Giò heo quay tiêu",89000),
    fixed("Sứa nước lèo",99000),fixed("Bắp bò cay Thái Lan",89000),fixed("Bao tử cá chẽm xào nghệ",90000),
  ]},
  { code: "RAU_CU_QUA", name: "Rau - Củ - Quả", dishes: [
    fixed("Salad cá ngừ",85000),fixed("Salad bò trứng",85000),fixed("Rau càng cua trộn bò",85000),
    fixed("Rau càng cua trộn thịt",85000),fixed("Rau muống xào tỏi",39000),fixed("Mồng tơi xào tỏi",39000),
    fixed("Ngó quả kho quẹt",59000),fixed("Đậu bắp luộc",49000),fixed("Đậu bắp xào tỏi",49000),
    fixed("Khổ qua xào trứng",55000),fixed("Khổ qua dầm bông",55000),
  ]},
];

export async function seedMenu(prisma: PrismaClient): Promise<{ categories: number; items: number }> {
  let itemCount = 0;

  for (const categorySeed of categories) {
    const category = await prisma.menuCategory.upsert({
      where: { code: categorySeed.code },
      update: {},
      create: { code: categorySeed.code, name: categorySeed.name },
    });

    for (const [index, dish] of categorySeed.dishes.entries()) {
      const code = `MENU_${categorySeed.code}_${String(index + 1).padStart(3, "0")}`;
      await prisma.menuItem.upsert({
        where: { code },
        update: {},
        create: {
          code,
          categoryId: category.id,
          name: dish.name,
          price: dish.price === null ? null : new Prisma.Decimal(dish.price),
          pricingType: dish.pricingType,
          priceUnit: dish.priceUnit ?? null,
          availabilityStatus: "AVAILABLE",
          isActive: true,
        },
      });
      itemCount += 1;
    }
  }

  return { categories: categories.length, items: itemCount };
}
