export const CORRELATION_HEADER = "x-correlation-id";
const VALID = /^[A-Za-z0-9-]{8,64}$/;

/** Accept a well-formed inbound id (e.g. from a load balancer); otherwise mint a new one. */
export function resolveCorrelationId(inbound: string | null | undefined): string {
  return inbound && VALID.test(inbound) ? inbound : crypto.randomUUID();
}
