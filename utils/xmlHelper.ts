/**
 * Parses raw XML string from Tally into a DOM Document
 */
export const parseXml = (xmlString: string): Document | null => {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");
    return xmlDoc;
  } catch (e) {
    console.error("XML Parse Error", e);
    return null;
  }
};

/**
 * Extracts text content from a specific tag in XML
 */
export const getTagValue = (parent: Element | Document, tagName: string): string => {
  const node = parent.getElementsByTagName(tagName)[0];
  return node ? node.textContent || "" : "";
};

/**
 * Helper to build Tally XML Request Envelope
 */
export const buildTallyRequest = (requestType: string, bodyContent: string): string => {
  return `
    <ENVELOPE>
      <HEADER>
        <TALLYREQUEST>${requestType}</TALLYREQUEST>
      </HEADER>
      <BODY>
        ${bodyContent}
      </BODY>
    </ENVELOPE>
  `.trim();
};