'use client';

import { LoginButton } from './login-button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export function LoginModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='default'>로그인/회원가입</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>공구 파인더</DialogTitle>
          <DialogDescription>
            간편하게 로그인하고 공구 정보를 확인하세요
          </DialogDescription>
        </DialogHeader>
        <div className='flex justify-center py-4'>
          <LoginButton />
        </div>
      </DialogContent>
    </Dialog>
  );
}
