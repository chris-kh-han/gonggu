'use client';

import Link from 'next/link';
import { signOut } from '@/lib/auth';
import type { User } from '@supabase/supabase-js';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface UserMenuProps {
  user: User;
}

export function UserMenu({ user }: UserMenuProps) {
  const displayName = user.user_metadata?.name || user.email || 'User';
  const avatarUrl = user.user_metadata?.avatar_url;
  const email = user.email;

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' className='flex items-center gap-2'>
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={displayName}
              className='h-6 w-6 rounded-full object-cover'
            />
          ) : (
            <div className='flex h-6 w-6 items-center justify-center rounded-full bg-violet-500 text-xs text-white'>
              {getInitials(displayName)}
            </div>
          )}
          <span className='max-w-[100px] truncate'>{displayName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-56'>
        <DropdownMenuLabel>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium'>{displayName}</p>
            {email && (
              <p className='text-muted-foreground truncate text-xs'>{email}</p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href='/my-profile'>내 프로필</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>로그아웃</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
