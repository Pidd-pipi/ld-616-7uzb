export const CertificateResult = ["PASS", "LIMITED_PASS", "FAIL", "NEED_REPAIR"] as const;
export type CertificateResult = (typeof CertificateResult)[number];

export const PASSING_RESULTS: readonly CertificateResult[] = ["PASS", "LIMITED_PASS"];
export const isPassingResult = (result: string): result is CertificateResult =>
  (PASSING_RESULTS as readonly string[]).includes(result);
