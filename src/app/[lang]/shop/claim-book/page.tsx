import ClaimBookClient from "./claim-book-client";

export const metadata = { robots: { index: false, follow: false } };

export default function Page() {
  return <ClaimBookClient />;
}
