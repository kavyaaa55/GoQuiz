import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { options } from "../api/auth/[...nextauth]/options";

export default async function ProfilePage() {
  const session = await getServerSession(options);

  if (!session) {
    redirect('/api/auth/signin?callbackUrl=/profile');
  }

  return (
    <div>
      <h1>Server-side Protected Page</h1>
      <p>Welcome {session.user?.name}!</p>
      <p>This page is protected on the server.</p>
    </div>
  );
}
