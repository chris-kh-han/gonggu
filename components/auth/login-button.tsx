'use client'

import { signInWithKakao, signInWithGoogle, signInWithNaver } from '@/lib/auth'
import { Button } from '@/components/ui/button'

interface LoginButtonProps {
  redirectTo?: string
}

export function LoginButton({ redirectTo }: LoginButtonProps) {
  const handleKakaoLogin = async () => {
    try {
      await signInWithKakao(redirectTo)
    } catch (error) {
      console.error('Failed to sign in with Kakao:', error)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle(redirectTo)
    } catch (error) {
      console.error('Failed to sign in with Google:', error)
    }
  }

  const handleNaverLogin = () => {
    try {
      signInWithNaver(redirectTo)
    } catch (error) {
      console.error('Failed to sign in with Naver:', error)
    }
  }

  return (
    <div className="flex flex-col gap-3 w-full max-w-sm">
      <Button
        onClick={handleKakaoLogin}
        className="w-full bg-[#FEE500] hover:bg-[#FEE500]/90 text-[#000000] font-medium"
      >
        카카오로 로그인
      </Button>
      <Button
        onClick={handleNaverLogin}
        className="w-full bg-[#03C75A] hover:bg-[#03C75A]/90 text-white font-medium"
      >
        네이버로 로그인
      </Button>
      <Button
        onClick={handleGoogleLogin}
        variant="outline"
        className="w-full border-gray-300"
      >
        구글로 로그인
      </Button>
    </div>
  )
}
