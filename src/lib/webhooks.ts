import { createHmac, timingSafeEqual } from "node:crypto";

export function signWebhook(payload: string, secret: string, timestamp: string) {
  return createHmac("sha256", secret)
    .update(`${timestamp}.${payload}`)
    .digest("hex");
}

export function verifyWebhook(
  payload: string,
  secret: string,
  timestamp: string,
  signature: string,
) {
  const expected = Buffer.from(signWebhook(payload, secret, timestamp));
  const received = Buffer.from(signature);

  return (
    expected.length === received.length && timingSafeEqual(expected, received)
  );
}
