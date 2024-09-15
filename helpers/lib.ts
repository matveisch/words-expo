export function getMinLevel(level: number) {
  switch (level) {
    case 1:
      return 1;
    case 2:
      return 3;
    case 3:
      return 5;
    case 4:
      return 7;
    default:
      return 1;
  }
}

export function transformLevel(level: number) {
  switch (level) {
    case 1:
      return 1;
    case 2:
      return 1;
    case 3:
      return 2;
    case 4:
      return 2;
    case 5:
      return 3;
    case 6:
      return 3;
    case 7:
      return 4;
    case 8:
      return 4;
    default:
      return 1;
  }
}
