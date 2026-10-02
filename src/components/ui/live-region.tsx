/** Polite announcements for screen readers. Visually hidden, always mounted. */
export function LiveRegion({ message }: { message: string }) {
  return (
    <p role="status" className="sr-only">
      {message}
    </p>
  );
}
