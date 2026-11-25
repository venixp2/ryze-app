// Run once: node gen-vapid.mjs
// Prints your PUBLIC key (paste into src/index.js PUBLIC_VAPID and src/page.html applicationServerKey)
// and writes vapid-private.jwk (upload as the VAPID_JWK secret, then keep it OUT of git).
import { generateKeyPairSync } from "node:crypto";
import { writeFileSync, chmodSync } from "node:fs";
const { publicKey, privateKey } = generateKeyPairSync("ec", { namedCurve: "P-256" });
const j = privateKey.export({ format: "jwk" }), pub = publicKey.export({ format: "jwk" });
const raw = Buffer.concat([Buffer.from([4]), Buffer.from(pub.x, "base64url"), Buffer.from(pub.y, "base64url")]);
writeFileSync("vapid-private.jwk", JSON.stringify({ d: j.d, x: j.x, y: j.y, kty: "EC", crv: "P-256" }));
chmodSync("vapid-private.jwk", 0o600);
console.log("PUBLIC KEY:", raw.toString("base64url"));
