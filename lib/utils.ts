import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  console.log('debug test'); // 테스트용
  return twMerge(clsx(inputs));
}
