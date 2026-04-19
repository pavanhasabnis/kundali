import PrintPreviewClient from "./print-preview-client";

export const metadata = { robots: { index: false, follow: false } };

export default function Page() {
  return <PrintPreviewClient />;
}
