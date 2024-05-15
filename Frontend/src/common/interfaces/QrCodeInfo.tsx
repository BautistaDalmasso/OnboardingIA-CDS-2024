export interface IQrCodeInfo {
  lastUpdate: Date;
  userEmail: string;
  // HACK: if qr uri isn't somehow changed the image is read from cache,
  // this causes the displayed image to not be updated even when it should (since is reading from outdated cache).
  toggle: QrToggle;
}

export enum QrToggle {
  A = "",
  B = "B",
}
