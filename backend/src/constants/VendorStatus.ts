export const VendorStatus = ["ACTIVE", "DISABLED"] as const;
export type VendorStatus = (typeof VendorStatus)[number];
