'use client';

import { Suspense } from "react";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic"; // ⬅️ це ключове!

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Suspense fallback={<div className="bg-white p-8 rounded shadow-md w-full max-w-sm">Завантаження...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}