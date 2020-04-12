
export const shuffle = function<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const sample = function<T>(array: T[]): T | undefined {
  return shuffle(array)[0];
};

export const zip = function<T>(arr1: T[], arr2: T[]): T[][] {
  return arr1.map((k, i) => [k, arr2[i]]);
}

export const intersection = function<T>(arr1: T[], arr2: T[]): T[] {
  return arr1.filter(value => arr2.includes(value));
}

export const subtract = function<T>(arr1: T[], arr2: T[]): T[] {
  return arr1.filter(value => !arr2.includes(value));
}

export const replace = function<T>(a: T, b: T, array: T[]): T[] {
  const index = array.indexOf(a);
  if (index === -1) return array;
  array[index] = b;
  return array;
}
