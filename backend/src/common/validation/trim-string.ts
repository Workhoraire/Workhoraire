/** `@Transform` callback of the DTOs: trims strings, leaves other values to the validators. */
export const trimString = ({ value }: { value: unknown }): unknown =>
  typeof value === 'string' ? value.trim() : value;
