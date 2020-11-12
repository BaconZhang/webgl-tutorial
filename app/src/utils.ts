export const assert = (value: any, mesage: string) => {
  if (value === null) {
    throw new Error(mesage)
  }
}