'use client'

import { useProfile, useLogout } from '@/hooks'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Navbar() {
  const { data: profile } = useProfile()
  const { mutate: logout, isPending } = useLogout()

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <nav className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/dashboard" className="text-xl font-bold">
            SnippetVault
          </Link>

          {/* User Info & Logout */}
          <div className="flex items-center gap-4">
            {profile && (
              <>
                {/* Avatar */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">
                    {profile.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt={profile.display_name}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      getInitials(profile.display_name)
                    )}
                  </div>
                  <span className="text-sm font-medium hidden sm:block">
                    {profile.display_name}
                  </span>
                </div>

                {/* Logout Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => logout()}
                  disabled={isPending}
                >
                  {isPending ? 'Logging out...' : 'Logout'}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}