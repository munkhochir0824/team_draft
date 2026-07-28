import { cookies } from "next/headers";
import { ADMIN_COOKIE, isValidSession } from "@/lib/auth";
import AdminPanel from "@/components/AdminPanel";
import LoginForm from "@/components/LoginForm";

export default async function AdminPage() {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;

  let authed = false;
  let configError: string | null = null;
  try {
    authed = isValidSession(token);
  } catch (err) {
    configError = (err as Error).message;
  }

  if (configError) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="clip-corner max-w-md border border-cs-red/50 bg-cs-red/10 px-6 py-5 text-sm text-cs-red">
          {configError}
        </div>
      </div>
    );
  }

  return authed ? <AdminPanel /> : <LoginForm />;
}
