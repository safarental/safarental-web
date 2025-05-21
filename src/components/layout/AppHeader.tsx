
"use client";

import Link from 'next/link';
import Image from 'next/image'; // Added import for Image
import { useRouter } from 'next/navigation';
import { UserCircle, LogOut, LayoutDashboard } from 'lucide-react';
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
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-6 sm:px-10 lg:px-16 flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="mr-2 md:hidden" /> 
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <Image 
              src="/logo.png" 
              alt="Safarental Admin Logo" 
              width={32} // Adjust as needed
              height={32} // Adjust as needed
              className="h-8 w-auto" // Control visual size
            />
            <span className="text-xl font-bold text-primary">Adminify</span>
          </Link>
        </div>
        
        <nav className="flex items-center gap-4">
           <Button variant="ghost" onClick={() => router.push('/admin/dashboard')} className="hidden sm:flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5" /> Dasbor
          </Button>
           <Button variant="ghost" onClick={() => router.push('/profile')} className="hidden sm:flex items-center gap-2">
            <UserCircle className="h-5 w-5" /> Profil
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
                  <span>Dasbor</span>
                </DropdownMenuItem>
                 <DropdownMenuItem onClick={() => router.push('/profile')} className="sm:hidden">
                  <UserCircle className="mr-2 h-4 w-4" />
                  <span>Profil</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="sm:hidden"/>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Keluar</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => router.push('/login')}>Masuk</Button>
          )}
        </nav>
      </div>
    </header>
  );
}
