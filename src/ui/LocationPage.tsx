import Link from "next/link";
import { EXAMPLE_AREAS } from "@/content/site";
import { bookingsOpen } from "@/platform/config";
import { Section } from "./blocks";
import { ArrowRight } from "./icons";

type City = "lagos" | "ibadan";

export function LocationPage({
  city,
  lead,
  uses,
}: {
  city: City;
  lead: string;
  uses: readonly { title: string; body: string }[];
}) {
  const name = city === "lagos" ? "Lagos" : "Ibadan";
  const open = bookingsOpen();
  return (
    <>
      <section className="page-hero page-hero-dark">
        <div className="container page-hero-split">
          <div>
            <nav className="city-switch" aria-label="Cities">
              <Link href="/locations/lagos" aria-current={city === "lagos" ? "page" : undefined}>
                Lagos
              </Link>
              <Link href="/locations/ibadan" aria-current={city === "ibadan" ? "page" : undefined}>
                Ibadan
              </Link>
            </nav>
            <h1>{name}</h1>
            <p className="lead">{lead}</p>
          </div>
          <Link
            href={open ? `/bookings/new?city=${city}` : "/contact"}
            className="button button-yellow button-arrow"
          >
            {open ? `Book in ${name}` : "Talk to us"}
          </Link>
        </div>
      </section>

      <Section
        id="areas"
        title="Where we pick up"
        intro="Example areas. The final service area is confirmed by our operations team, and we check every request by hand."
      >
        <ul className="chips">
          {EXAMPLE_AREAS[city].map((a) => (
            <li key={a}>{a}</li>
          ))}
          <li className="chip-ask">Elsewhere? Ask us</li>
        </ul>
      </Section>

      <Section id="uses" title="How people use Flydrive here">
        <div className="grid-4">
          {uses.map((u) => (
            <div key={u.title} className="card">
              <h3>{u.title}</h3>
              <p>{u.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid-2">
          <Link href="/services" className="route-card">
            <div>
              <strong>Driver for your car</strong>
              <span>Available in {name}</span>
            </div>
            <span className="arrow">
              <ArrowRight />
            </span>
          </Link>
          <Link href="/services/car-and-driver" className="route-card route-card-amber">
            <div>
              <strong>Car + driver</strong>
              <span>Available in {name}</span>
            </div>
            <span className="arrow">
              <ArrowRight />
            </span>
          </Link>
        </div>
      </Section>
    </>
  );
}
