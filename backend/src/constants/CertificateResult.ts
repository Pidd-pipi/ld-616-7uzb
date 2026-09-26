export const CertificateResult = ["PASS","LIMITED_PASS","FAIL","NEED_REPAIR"] as const;
export type CertificateResult = (typeof CertificateResult)[number];
export const CERTIFICATE_PASS_RESULTS: readonly CertificateResult[] = ["PASS", "LIMITED_PASS"];
export const isCertificatePass = (result: string): boolean => (CERTIFICATE_PASS_RESULTS as readonly string[]).includes(result);
