import type { MenuCategory, MenuItem } from '@/src/features/menu/types/menu.types';

const nowIso = new Date().toISOString();

export const DISH_IMAGE_PRESETS = {
  PHO_BO: '/src/assets/images/dish_pho_bo_1795401373437.jpg',
  COM_TAM: '/src/assets/images/dish_com_tam_1795401373155.jpg',
  GOI_CUON: '/src/assets/images/dish_goi_cuon_1795401373935.jpg',
  WAGYU_STEAK: '/src/assets/images/dish_wagyu_steak_1795401373276.jpg',
  TRA_DAO: '/src/assets/images/dish_tra_dao_1795401373107.jpg',
} as const;

export const mockCategoriesData: MenuCategory[] = [
  {
    id: 'cat-appetizer',
    name: 'Khai vị',
    description: 'Các món khai vị nhẹ, gỏi cuốn và súp mở đầu bữa ăn',
    sortOrder: 1,
    isActive: true,
  },
  {
    id: 'cat-main',
    name: 'Món chính',
    description: 'Món truyền thống Việt Nam và món nướng đặc sản bếp trưởng',
    sortOrder: 2,
    isActive: true,
  },
  {
    id: 'cat-beverage',
    name: 'Đồ uống',
    description: 'Trà trái cây tươi, nước ép và đồ uống pha chế quầy Bar',
    sortOrder: 3,
    isActive: true,
  },
  {
    id: 'cat-dessert',
    name: 'Tráng miệng',
    description: 'Chè thanh mát và tráng miệng theo mùa',
    sortOrder: 4,
    isActive: true,
  },
];

export const mockMenuItemsData: MenuItem[] = [
  {
    id: 'menu-001',
    sku: 'MN-001',
    name: 'Phở Bò Đặc Biệt',
    description:
      'Phở bò truyền thống hầm xương ống 12 tiếng cùng quế, hồi, thảo quả. Phục vụ kèm bánh phở tươi, thịt nạm giòn, tái lăn và bò viên.',
    price: 85000,
    categoryId: 'cat-main',
    station: 'HOT_KITCHEN',
    imageUrl: DISH_IMAGE_PRESETS.PHO_BO,
    status: 'AVAILABLE',
    prepTimeMinutes: 10,
    isBestseller: true,
    linkedIngredientIds: ['ing-003', 'ing-004', 'ing-005'],
    modifiers: [
      { id: 'mod-1', label: 'Không hành lá', extraPrice: 0 },
      { id: 'mod-2', label: 'Nước dùng ít béo', extraPrice: 0 },
      { id: 'mod-3', label: 'Thêm trứng chần', extraPrice: 10000 },
      { id: 'mod-4', label: 'Thêm bánh quẩy', extraPrice: 5000 },
    ],
    updatedAt: nowIso,
  },
  {
    id: 'menu-002',
    sku: 'MN-002',
    name: 'Cơm Tấm Sườn Bì Chả',
    description:
      'Hạt tấm thơm dẻo, sườn cốt lết ướp mật ong nướng than hồng, chả trứng hấp mềm và bì heo trộn thính.',
    price: 75000,
    categoryId: 'cat-main',
    station: 'HOT_KITCHEN',
    imageUrl: DISH_IMAGE_PRESETS.COM_TAM,
    status: 'AVAILABLE',
    prepTimeMinutes: 12,
    isBestseller: true,
    linkedIngredientIds: ['ing-006'],
    modifiers: [
      { id: 'mod-5', label: 'Thêm trứng ốp la', extraPrice: 10000 },
      { id: 'mod-6', label: 'Ít mỡ hành', extraPrice: 0 },
    ],
    updatedAt: nowIso,
  },
  {
    id: 'menu-003',
    sku: 'MN-003',
    name: 'Gỏi Cuốn Tôm Thịt',
    description:
      'Set 3 cuốn bánh tráng gạo mỏng kèm tôm sú tươi, thịt ba chỉ, bún tươi và rau thơm, chấm tương đen đậu phộng.',
    price: 55000,
    categoryId: 'cat-appetizer',
    station: 'COLD_KITCHEN',
    imageUrl: DISH_IMAGE_PRESETS.GOI_CUON,
    status: 'AVAILABLE',
    prepTimeMinutes: 6,
    isBestseller: true,
    linkedIngredientIds: ['ing-002', 'ing-005'],
    modifiers: [
      { id: 'mod-7', label: 'Không hẹ', extraPrice: 0 },
      { id: 'mod-8', label: 'Thêm chén tương chấm', extraPrice: 5000 },
    ],
    updatedAt: nowIso,
  },
  {
    id: 'menu-004',
    sku: 'MN-004',
    name: 'Bò Wagyu Ribeye A5',
    description:
      'Thăn ngoại bò Wagyu vân mỡ cẩm thạch nướng đá nóng, dùng kèm muối hồng Himalaya và lá hương thảo tươi.',
    price: 520000,
    categoryId: 'cat-main',
    station: 'HOT_KITCHEN',
    imageUrl: DISH_IMAGE_PRESETS.WAGYU_STEAK,
    status: 'OUT_OF_STOCK',
    prepTimeMinutes: 15,
    isBestseller: true,
    linkedIngredientIds: ['ing-001'],
    modifiers: [
      { id: 'mod-9', label: 'Độ chín: Medium Rare', extraPrice: 0 },
      { id: 'mod-10', label: 'Độ chín: Well Done', extraPrice: 0 },
      { id: 'mod-11', label: 'Sốt nấm Truffle', extraPrice: 45000 },
    ],
    updatedAt: nowIso,
  },
  {
    id: 'menu-005',
    sku: 'MN-005',
    name: 'Trà Đào Cam Sả',
    description:
      'Trà đen ủ lạnh chiết xuất thanh mát hòa quyện nước cốt cam vàng, sả đập dập và lát đào ngâm giòn ngọt.',
    price: 45000,
    categoryId: 'cat-beverage',
    station: 'BAR',
    imageUrl: DISH_IMAGE_PRESETS.TRA_DAO,
    status: 'AVAILABLE',
    prepTimeMinutes: 4,
    isBestseller: false,
    linkedIngredientIds: ['ing-007'],
    modifiers: [
      { id: 'mod-12', label: 'Ít đường (50%)', extraPrice: 0 },
      { id: 'mod-13', label: 'Ít đá', extraPrice: 0 },
      { id: 'mod-14', label: 'Thêm miếng đào', extraPrice: 12000 },
    ],
    updatedAt: nowIso,
  },
  {
    id: 'menu-006',
    sku: 'MN-006',
    name: 'Chè Khúc Bạch Hạnh Nhân',
    description:
      'Khúc bạch phô mai sữa béo ngậy, nhãn tươi cùi dày thanh mát, hạnh nhân lát rang giòn trong nước đường phèn.',
    price: 38000,
    categoryId: 'cat-dessert',
    station: 'COLD_KITCHEN',
    imageUrl: DISH_IMAGE_PRESETS.TRA_DAO,
    status: 'INACTIVE',
    prepTimeMinutes: 5,
    isBestseller: false,
    linkedIngredientIds: [],
    modifiers: [
      { id: 'mod-15', label: 'Thêm hạnh nhân rang', extraPrice: 8000 },
    ],
    updatedAt: nowIso,
  },
  {
    id: 'menu-007',
    sku: 'MN-007',
    name: 'Gỏi Ngó Sen Tôm Thịt',
    description:
      'Ngó sen giòn mát trộn tôm sú bóc vỏ, thịt ba rọi, cà rốt sợi, đậu phộng rang và nước mắm chua ngọt.',
    price: 79000,
    categoryId: 'cat-appetizer',
    station: 'COLD_KITCHEN',
    imageUrl: DISH_IMAGE_PRESETS.GOI_CUON,
    status: 'AVAILABLE',
    prepTimeMinutes: 8,
    isBestseller: false,
    linkedIngredientIds: ['ing-002', 'ing-005'],
    modifiers: [
      { id: 'mod-16', label: 'Không rau răm', extraPrice: 0 },
      { id: 'mod-17', label: 'Ít cay', extraPrice: 0 },
    ],
    updatedAt: nowIso,
  },
];
