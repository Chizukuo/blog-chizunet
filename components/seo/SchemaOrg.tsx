import Script from 'next/script';

interface SchemaOrgProps {
  schema: Record<string, any>;
}

export default function SchemaOrg({ schema }: SchemaOrgProps) {
  return (
    <Script
      id="schema-org"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
