import BgPreviewClient from "./bg-preview-client";

export const metadata = {
  title: "Reel Backgrounds Preview",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <BgPreviewClient />;
}
