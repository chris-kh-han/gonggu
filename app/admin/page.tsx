import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth.server';
import { GongguForm } from './gonggu-form';

export default async function AdminPage() {
  // 인증 체크
  const {
    data: { user },
    error,
  } = await getCurrentUser();

  if (error || !user) {
    redirect('/?error=auth_required');
  }

  return (
    <div className='bg-background min-h-screen'>
      <main className='mx-auto max-w-md px-4 py-6'>
        <header className='mb-6'>
          <h1 className='text-foreground text-2xl font-bold'>공구 등록</h1>
          <p className='text-muted-foreground text-sm'>
            새로운 공구를 추가합니다
          </p>
        </header>

        <GongguForm />
      </main>
    </div>
  );
}
