// The setup page intentionally opts out of the shared profile shell layout.
// It uses its own full-screen wizard layout defined directly in the page component.
// This file resets the layout for the /profile/setup route to null (raw children only).
export default function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
