const forge = require("node-forge");

function toForgeBuffer(buffer) {
  return forge.util.createBuffer(Buffer.from(buffer).toString("binary"));
}

function decodeLocalKeyId(attributes = {}) {
  const value = attributes?.localKeyId?.[0];
  if (typeof value === "string") {
    return value;
  }
  if (value && typeof value === "object" && typeof value.bytes === "function") {
    return forge.util.bytesToHex(value.bytes());
  }
  return "";
}

function parsePkcs12Asn1(p12Buffer, password) {
  const der = toForgeBuffer(p12Buffer);
  const asn1 = forge.asn1.fromDer(der);
  return forge.pkcs12.pkcs12FromAsn1(asn1, false, password || "");
}

function getSafeBags(p12) {
  return Array.isArray(p12?.safeContents)
    ? p12.safeContents.flatMap((safeContent) => Array.isArray(safeContent?.safeBags) ? safeContent.safeBags : [])
    : [];
}

function parsePkcs12(p12Buffer, password) {
  try {
    const p12 = parsePkcs12Asn1(p12Buffer, password);
    const safeBags = getSafeBags(p12);
    const certBags = safeBags.filter((bag) => bag?.type === forge.pki.oids.certBag && bag.cert);
    const keyBags = safeBags.filter((bag) => (
      bag?.type === forge.pki.oids.pkcs8ShroudedKeyBag
      || bag?.type === forge.pki.oids.keyBag
    ) && bag.key);

    if (!certBags.length) {
      throw new Error("No certificate found in PKCS12 bundle");
    }
    if (!keyBags.length) {
      throw new Error("No private key found in PKCS12 bundle");
    }

    const firstKeyBag = keyBags[0];
    const targetLocalKeyId = decodeLocalKeyId(firstKeyBag.attributes);
    const orderedCertBags = targetLocalKeyId
      ? [
          ...certBags.filter((bag) => decodeLocalKeyId(bag.attributes) === targetLocalKeyId),
          ...certBags.filter((bag) => decodeLocalKeyId(bag.attributes) !== targetLocalKeyId),
        ]
      : certBags;

    const certPem = orderedCertBags
      .map((bag) => forge.pki.certificateToPem(bag.cert))
      .join("\n");
    const keyPem = forge.pki.privateKeyToPem(firstKeyBag.key);

    return { certPem, keyPem };
  } catch (error) {
    const message = String(error?.message || error || "");
    if (message.toLowerCase().includes("mac")) {
      throw new Error("Certificate MAC verification failed — check your password");
    }
    throw new Error(`Failed to parse client certificate: ${message}`);
  }
}

function parseTruststore(p12Buffer, password) {
  try {
    const p12 = parsePkcs12Asn1(p12Buffer, password);
    const certs = getSafeBags(p12)
      .filter((bag) => bag?.type === forge.pki.oids.certBag && bag.cert)
      .map((bag) => forge.pki.certificateToPem(bag.cert));

    if (!certs.length) {
      throw new Error("No certificates found in truststore");
    }

    return { caPem: certs.join("\n") };
  } catch (error) {
    const message = String(error?.message || error || "");
    if (message.toLowerCase().includes("mac")) {
      throw new Error("Truststore MAC verification failed — check your password");
    }
    throw new Error(`Failed to parse truststore: ${message}`);
  }
}

module.exports = {
  parsePkcs12,
  parseTruststore,
};
