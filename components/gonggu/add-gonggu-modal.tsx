'use client';

import { useState, useEffect } from 'react';
import { useActionState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { addGonggu, type FormState } from '@/app/admin/actions';

const CATEGORIES = [
  { value: '식품', label: '식품' },
  { value: '패션', label: '패션' },
  { value: '육아', label: '육아' },
  { value: '생활', label: '생활' },
];

export function AddGongguModal() {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    addGonggu,
    null,
  );

  // 성공 시 모달 닫기
  useEffect(() => {
    if (state?.success) {
      const timer = setTimeout(() => {
        setOpen(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [state]);

  return (
    <>
      {/* FAB 버튼 */}
      {!open && (
        <Button
          size='icon'
          className='fixed bottom-6 right-4 h-14 w-14 rounded-full shadow-lg'
          onClick={() => setOpen(true)}
        >
          <Plus className='h-6 w-6' />
        </Button>
      )}

      {/* 배경 overlay */}
      {open && (
        <div
          className='fixed inset-0 z-50 bg-black/50'
          onClick={() => setOpen(false)}
        />
      )}

      {/* 전체 화면 모달 */}
      <Dialog open={open} onOpenChange={setOpen} modal={false}>
        <DialogContent
          showCloseButton={false}
          className='z-50 max-h-[90vh] max-w-md overflow-hidden rounded-xl border-none p-0'
        >
          {/* 헤더 */}
          <DialogHeader className='sticky top-0 z-10 flex flex-row items-center justify-between border-b bg-background px-4 py-3'>
            <DialogTitle className='text-lg font-semibold'>
              공구 등록
            </DialogTitle>
            <Button
              variant='ghost'
              size='icon'
              className='h-8 w-8'
              onClick={() => setOpen(false)}
            >
              <X className='h-5 w-5' />
            </Button>
          </DialogHeader>

          {/* 폼 */}
          <form action={formAction} className='flex-1 overflow-y-auto p-4'>
            <div className='space-y-6'>
              {/* 판매자 정보 */}
              <div className='space-y-4'>
                <h3 className='text-sm font-medium text-muted-foreground'>
                  판매자 정보
                </h3>

                <div className='space-y-2'>
                  <Label htmlFor='instagram_username'>
                    인스타그램 아이디 *
                  </Label>
                  <div className='flex'>
                    <span className='inline-flex items-center rounded-l-lg border border-r-0 bg-muted px-3 text-sm text-muted-foreground'>
                      @
                    </span>
                    <Input
                      id='instagram_username'
                      name='instagram_username'
                      placeholder='username'
                      className='rounded-l-none'
                      required
                    />
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='category'>카테고리</Label>
                  <Select name='category'>
                    <SelectTrigger>
                      <SelectValue placeholder='선택' />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* 공구 정보 */}
              <div className='space-y-4'>
                <h3 className='text-sm font-medium text-muted-foreground'>
                  공구 정보
                </h3>

                <div className='space-y-2'>
                  <Label htmlFor='instagram_url'>인스타그램 게시물 URL *</Label>
                  <Input
                    id='instagram_url'
                    name='instagram_url'
                    type='url'
                    placeholder='https://instagram.com/p/...'
                    required
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='title'>공구 제목 *</Label>
                  <Input
                    id='title'
                    name='title'
                    placeholder='예: 제주 감귤 5kg 공구'
                    required
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='price'>가격 (원)</Label>
                  <Input
                    id='price'
                    name='price'
                    type='number'
                    placeholder='29000'
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='deadline'>마감일</Label>
                  <Input id='deadline' name='deadline' type='datetime-local' />
                </div>
              </div>

              {/* 상태 메시지 */}
              {state && (
                <div
                  className={`rounded-lg p-3 text-sm ${
                    state.success
                      ? 'bg-green-50 text-green-700'
                      : 'bg-red-50 text-red-700'
                  }`}
                >
                  {state.message}
                </div>
              )}

              {/* 제출 버튼 */}
              <Button type='submit' className='w-full' disabled={pending}>
                {pending ? '등록 중...' : '공구 등록'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
