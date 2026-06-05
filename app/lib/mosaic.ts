export type PackCell<T> = { ar: number; data: T };

export function packRows<T>(
  cells: PackCell<T>[],
  width: number,
  gap: number,
  maxH: number,
  minN = 1
): { ar: number; cells: T[] }[] {
  const rows: { cells: PackCell<T>[] }[] = [];
  let i = 0;
  while (i < cells.length) {
    let n = 1;
    let chosen: number | null = null;
    while (i + n <= cells.length) {
      const subset = cells.slice(i, i + n);
      const sumAr = subset.reduce((s, c) => s + c.ar, 0);
      const h = (width - gap * (n - 1)) / sumAr;
      if ((h <= maxH && n >= minN) || i + n === cells.length) {
        chosen = n;
        break;
      }
      n++;
    }
    if (chosen === null) chosen = Math.max(1, minN);
    rows.push({ cells: cells.slice(i, i + chosen) });
    i += chosen;
  }

  if (rows.length >= 2) {
    const last = rows[rows.length - 1];
    const lastSumAr = last.cells.reduce((s, c) => s + c.ar, 0);
    if (width / lastSumAr > maxH) {
      rows[rows.length - 2].cells.push(...last.cells);
      rows.pop();
    }
  }

  return rows.map((r) => ({
    ar: r.cells.reduce((s, c) => s + c.ar, 0),
    cells: r.cells.map((c) => c.data),
  }));
}
