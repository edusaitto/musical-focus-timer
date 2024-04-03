import { AUTH_URL } from "@/services/auth";

export default function Login() {
  return (
    <div className="flex align-center justify-center min-h-screen">
      <a
        href={AUTH_URL}
        className="m-auto text-2xl bg-green-700 px-10 py-3 rounded-full font-bold"
      >
        SPOTIFY LOGIN
      </a>
    </div>
  );
}
