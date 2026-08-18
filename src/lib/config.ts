/**
 * Centralised, configurable business rules for Captionlift.
 *
 * Change these by setting the environment variable — never hardcode
 * the free video limit, the price, or the cost-control limits
 * anywhere else in the app. Everything else should import from here.
 */

export const FREE_VIDEO_LIMIT = Number(
  process.env.NEXT_PUBLIC_FREE_VIDEO_LIMIT ?? 1
);

export const LIFETIME_PRICE_GBP = Number(
  process.env.NEXT_PUBLIC_LIFETIME_PRICE_GBP ?? 5
);

// Cost-control limits (see COST CONTROL in the product spec).
// Keeping videos short keeps AI transcription + rendering costs
// predictable relative to the one-time £5 price.
export const MAX_VIDEO_DURATION_SECONDS = Number(
  process.env.NEXT_PUBLIC_MAX_VIDEO_DURATION_SECONDS ?? 180 // 3 minutes
);

export const MAX_UPLOAD_SIZE_MB = Number(
  process.env.NEXT_PUBLIC_MAX_UPLOAD_SIZE_MB ?? 500
);

export const SUPPORTED_VIDEO_MIME_TYPES = [
  "video/mp4",
  "video/quicktime", // .mov
  "video/webm",
];

export function formatPrice(gbp: number): string {
  return `£${gbp}`;
}
