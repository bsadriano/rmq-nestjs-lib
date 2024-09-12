export const capitalizeFirstLetter = (string: string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

export const getFullName = (firstName: string, lastName: string) =>
  `${capitalizeFirstLetter(firstName)} ${capitalizeFirstLetter(lastName)}`;
