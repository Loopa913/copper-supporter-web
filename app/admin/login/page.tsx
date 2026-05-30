import { Suspense } from "react";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export const runtime = "edge";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <Suspense fallback={<div className="text-text-muted">로딩...</div>}>
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}
