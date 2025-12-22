import { GongguForm } from "./gonggu-form";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-md px-4 py-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">공구 등록</h1>
          <p className="text-sm text-muted-foreground">
            새로운 공구를 추가합니다
          </p>
        </header>

        <GongguForm />
      </main>
    </div>
  );
}
