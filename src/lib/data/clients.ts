/**
 * Placeholder data layer for client logos shown in the home ticker.
 *
 * Replace `name` entries with real client names, and optionally add a `logo`
 * URL pointing to an SVG in /public when the agency has logos cleared for
 * public display.
 */

export type Client = {
  id: string;
  name: string;
  /** Optional path to an SVG logo (e.g. "/clients/nexus.svg"). Falls back to text. */
  logo?: string;
};

export const clients: Client[] = [
  { id: "c-01", name: "Cliente 01" },
  { id: "c-02", name: "Cliente 02" },
  { id: "c-03", name: "Cliente 03" },
  { id: "c-04", name: "Cliente 04" },
  { id: "c-05", name: "Cliente 05" },
  { id: "c-06", name: "Cliente 06" },
  { id: "c-07", name: "Cliente 07" },
  { id: "c-08", name: "Cliente 08" },
];
