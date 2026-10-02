/**
 * Site-wide constants for metadata. On Vercel the production URL is provided
 * automatically; locally we fall back to localhost.
 */
const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const site = {
  name: "monis.rent Workspace Designer",
  shortName: "Workspace Designer",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (vercelUrl ? `https://${vercelUrl}` : "http://localhost:3000"),
  title: "Design your Bali workspace and rent it | monis.rent",
  description:
    "Build your desk setup in Bali visually: pick a desk, a chair, monitors and a lamp, see it come together, then rent it by the week. Delivery and assembly included.",
  locale: "en_US",
} as const;
