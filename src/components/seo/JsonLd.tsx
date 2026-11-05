import React from "react";

interface JsonLdProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: Record<string, any> | Array<Record<string, any>> | null;
}

/**
 * Renders structured JSON-LD data safely into the page head or body
 */
export function JsonLd({ schema }: JsonLdProps) {
  if (!schema) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
  );
}

export default JsonLd;

