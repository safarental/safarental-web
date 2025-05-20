
"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Building, UserCircle, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarTrigger } from '@/components/ui/sidebar';


export default function AppHeader() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
  };

  const getInitials = (name: string | undefined) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return names[0].substring(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"> {/* z-index adjusted for sidebar */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="mr-2 md:hidden" /> {/* Trigger for mobile, hidden on md+ */}
           {/* Desktop sidebar is toggled by its rail or keyboard shortcut, so the trigger can be hidden on desktop if preferred */}
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <Building className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold text-primary">Adminify</span>
          </Link>
        </div>
        
        <nav className="flex items-center gap-4">
           <Button variant="ghost" onClick={() => router.push('/admin/dashboard')} className="hidden sm:flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5" /> Dashboard
          </Button>
           <Button variant="ghost" onClick={() => router.push('/profile')} className="hidden sm:flex items-center gap-2">
            <UserCircle className="h-5 w-5" /> Profile
          </Button>

          {user && !isLoading ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={`https://placehold.co/100x100.png?text=${getInitials(user.name)}`} alt={user.name || 'User Avatar'} data-ai-hint="placeholder avatar" />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/admin/dashboard')} className="sm:hidden">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </DropdownMenuItem>
                 <DropdownMenuItem onClick={() => router.push('/profile')} className="sm:hidden">
                  <UserCircle className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="sm:hidden"/>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => router.push('/login')}>Login</Button>
          )}
        </nav>
      </div>
    </header>
  );
}
