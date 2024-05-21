export enum LicenceLevel {
  NONE = 0,
  REGULAR = 1,
  TRUSTED = 2,
  RESEARCHER = 3,
}

export enum LicenceName {
  NONE = "Ninguno",
  REGULAR = "Regular",
  TRUSTED = "Confiado",
  RESEARCHER = "Investigador",
}

export const licenceLevelToStr = (licenceLevel: number) => {
  switch (licenceLevel) {
    case LicenceLevel.NONE:
      return LicenceName.NONE;
    case LicenceLevel.REGULAR:
      return LicenceName.REGULAR;
    case LicenceLevel.TRUSTED:
      return LicenceName.TRUSTED;
    case LicenceLevel.RESEARCHER:
      return LicenceName.RESEARCHER;
    default:
      return LicenceName.REGULAR;
  }
};
