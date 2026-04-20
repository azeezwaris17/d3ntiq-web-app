export type RegionType = 'tooth' | 'gum';

export type JawPosition = 'upper' | 'lower';

export type Quadrant = 1 | 2 | 3 | 4;

export type FDINumber =
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 21
  | 22
  | 23
  | 24
  | 25
  | 26
  | 27
  | 28
  | 31
  | 32
  | 33
  | 34
  | 35
  | 36
  | 37
  | 38
  | 41
  | 42
  | 43
  | 44
  | 45
  | 46
  | 47
  | 48;

export type ToothType = 'incisor' | 'canine' | 'premolar' | 'molar';

export type ComplaintType = 'pain' | 'bleeding' | 'sensitivity' | 'swelling' | 'cosmetic' | 'other';

export interface MouthModelSelection {
  regionType: RegionType;
  regionId: string;
  jaw: JawPosition;
  quadrant?: Quadrant;
  fdiNumber?: FDINumber;
  toothType?: ToothType;
  userComplaint?: string;
  complaintType?: ComplaintType;
  timestamp?: Date;
}

export interface ToothInfo {
  fdiNumber: FDINumber;
  quadrant: Quadrant;
  jaw: JawPosition;
  position: 'left' | 'right' | 'center';
  type: ToothType;
  name: string;
  description: string;
}

export function getToothInfo(fdiNumber: FDINumber): ToothInfo {
  const quadrant = Math.floor(fdiNumber / 10) as Quadrant;
  const toothPosition = fdiNumber % 10;
  const jaw: JawPosition = quadrant <= 2 ? 'upper' : 'lower';

  let type: ToothType;
  let name: string;
  let description: string;
  let position: 'left' | 'right' | 'center' = 'center';

  if (toothPosition === 1 || toothPosition === 2) {
    type = 'incisor';
    name = toothPosition === 1 ? 'Central Incisor' : 'Lateral Incisor';
    description = `${jaw === 'upper' ? 'Upper' : 'Lower'} ${name}`;
  } else if (toothPosition === 3) {
    type = 'canine';
    name = 'Canine';
    description = `${jaw === 'upper' ? 'Upper' : 'Lower'} Canine`;
  } else if (toothPosition === 4 || toothPosition === 5) {
    type = 'premolar';
    name = toothPosition === 4 ? 'First Premolar' : 'Second Premolar';
    description = `${jaw === 'upper' ? 'Upper' : 'Lower'} ${name}`;
  } else {
    type = 'molar';
    if (toothPosition === 6) name = 'First Molar';
    else if (toothPosition === 7) name = 'Second Molar';
    else name = 'Third Molar (Wisdom Tooth)';
    description = `${jaw === 'upper' ? 'Upper' : 'Lower'} ${name}`;
  }

  if (quadrant === 1 || quadrant === 4) position = 'right';
  else if (quadrant === 2 || quadrant === 3) position = 'left';

  return {
    fdiNumber,
    quadrant,
    jaw,
    position,
    type,
    name,
    description,
  };
}

export function getAccessibleLabel(selection: MouthModelSelection): string {
  if (selection.regionType === 'tooth' && selection.fdiNumber) {
    const toothInfo = getToothInfo(selection.fdiNumber);
    return `${toothInfo.description}, FDI number ${selection.fdiNumber}`;
  } else if (selection.regionType === 'gum') {
    return `${selection.jaw === 'upper' ? 'Upper' : 'Lower'} gum region`;
  }
  return 'Selected area';
}

export function getUpperFDIFromIndex(index: number, side: 'right' | 'left' = 'right'): FDINumber {
  const baseFDI = side === 'right' ? 11 : 21;
  return (baseFDI + index) as FDINumber;
}

export function getLowerFDIFromIndex(index: number, side: 'left' | 'right' = 'left'): FDINumber {
  const baseFDI = side === 'left' ? 31 : 41;
  return (baseFDI + index) as FDINumber;
}

