import Navbar from "@/components/navigation-bar";
import Image from "next/image";

export default function Home() {
  return (
    <section>
      <Navbar isLandingPage={true} />
    </section>
  );
}
