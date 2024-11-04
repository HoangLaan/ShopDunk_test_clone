export const Typetimepair = {
  MINUTE: 1,
  CLOCK: 2,
  DAY: 3,
  WEEKS: 4,
  MONTHS: 5,
};

export const TypetimepairOpts = [
  { value: Typetimepair.MINUTE, label: 'Phút' },
  { value: Typetimepair.CLOCK, label: 'Giờ' },
  { value: Typetimepair.DAY, label: 'Ngày' },
  { value: Typetimepair.WEEKS, label: 'Tuần' },
  { value: Typetimepair.MONTHS, label: 'Tháng' },
];

export const Typepair = {
  BATTERY: 12,
  DAMAGED_SCREEN: 2,
  DAMAGED_FACE: 3,
  SPEAKER: 4,
  CAMERA: 5,
  OTHER: 6,
};

export const TypepairOpts = [
  { value: Typepair.BATTERY, label: 'Hư pin' },
  { value: Typepair.DAMAGED_SCREEN, label: 'Hư màn hình' },
  { value: Typepair.DAMAGED_FACE, label: 'Hư Face ID' },
  { value: Typepair.SPEAKER, label: 'Hư loa' },
  { value: Typepair.CAMERA, label: ' Hư camera' },
  { value: Typepair.OTHER, label: 'Khác' },
];
