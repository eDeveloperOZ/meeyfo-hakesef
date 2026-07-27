import Link from "next/link";
import type { Organization, Person } from "../../schemas";

export function ProfileCard({ profile }: { profile: Person | Organization }) {
  const id = "person_id" in profile ? profile.person_id : profile.org_id;
  const name = "full_name_he" in profile ? profile.full_name_he : profile.name_he;
  const meta =
    "full_name_he" in profile ? profile.locality_he || "אדם המופיע בפרסום רשמי" : profile.org_type;
  return (
    <article className="profile-card">
      <Link href={`/who/${id}`}>
        <strong>{name}</strong>
        <span>{meta}</span>
      </Link>
    </article>
  );
}
