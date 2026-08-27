export interface WHO5ItemDef {
  orderIndex: number;
  itemCode: string;
  questionText: string;
  questionTextId: string;
}

export interface WHO5OptionDef {
  orderIndex: number;
  label: string;
  labelId: string;
  scoreValue: number;
}

export const WHO5_ITEMS: WHO5ItemDef[] = [
  {
    orderIndex: 1,
    itemCode: "WHO5_Q1",
    questionText: "I have felt cheerful and in good spirits",
    questionTextId: "Saya merasa ceria dan bersemangat",
  },
  {
    orderIndex: 2,
    itemCode: "WHO5_Q2",
    questionText: "I have felt calm and relaxed",
    questionTextId: "Saya merasa tenang dan rileks/santai",
  },
  {
    orderIndex: 3,
    itemCode: "WHO5_Q3",
    questionText: "I have felt active and vigorous",
    questionTextId: "Saya merasa aktif dan berenergi/bertenaga",
  },
  {
    orderIndex: 4,
    itemCode: "WHO5_Q4",
    questionText: "I woke up feeling fresh and rested",
    questionTextId: "Saya bangun tidur dengan perasaan segar dan cukup istirahat",
  },
  {
    orderIndex: 5,
    itemCode: "WHO5_Q5",
    questionText: "My daily life has been filled with things that interest me",
    questionTextId: "Kehidupan sehari-hari saya dipenuhi hal-hal yang menarik minat saya",
  },
];

export const WHO5_OPTIONS: WHO5OptionDef[] = [
  {
    orderIndex: 1,
    label: "All of the time",
    labelId: "Sepanjang waktu",
    scoreValue: 5,
  },
  {
    orderIndex: 2,
    label: "Most of the time",
    labelId: "Hampir sepanjang waktu",
    scoreValue: 4,
  },
  {
    orderIndex: 3,
    label: "More than half of the time",
    labelId: "Lebih dari separuh waktu",
    scoreValue: 3,
  },
  {
    orderIndex: 4,
    label: "Less than half of the time",
    labelId: "Kurang dari separuh waktu",
    scoreValue: 2,
  },
  {
    orderIndex: 5,
    label: "Some of the time",
    labelId: "Sebagian kecil waktu",
    scoreValue: 1,
  },
  {
    orderIndex: 6,
    label: "At no time",
    labelId: "Tidak pernah sama sekali",
    scoreValue: 0,
  },
];

export const APPLICATION_PLATFORMS = [
  "LinkedIn",
  "JobStreet",
  "Glints",
  "Pintarnya",
  "Kalibrr",
  "KitaLulus",
  "Company Website",
  "Lainnya",
] as const;
