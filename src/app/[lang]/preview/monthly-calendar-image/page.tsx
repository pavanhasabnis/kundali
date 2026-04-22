import CalendarImageClient from "./calendar-image-client";

export const metadata = {
  title: "Monthly Calendar Image",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <CalendarImageClient />;
}
