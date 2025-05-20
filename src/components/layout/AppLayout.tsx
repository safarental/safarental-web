
"use client";

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import AppHeader from './AppHeader';
import { Loader2, Building, LayoutDashboard, UserCircle, Car, ImageIcon as ImageIconLucide, Settings, HelpCircle } from 'lucide-react'; // Added Settings, HelpCircle icons
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarFooter,
} from '@/components/ui/sidebar';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Link href="/admin/dashboard" className="flex items-center gap-2 px-2 py-1">
            <Building className="h-7 w-7 text-sidebar-primary" />
            <span className="text-xl font-bold text-sidebar-primary">Adminify</span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/admin/dashboard'}
                tooltip={{ children: "Dashboard", side: "right", align: "center" }}
              >
                <Link href="/admin/dashboard">
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem> 
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith('/admin/cars')}
                tooltip={{ children: "Cars Management", side: "right", align: "center" }}
              >
                <Link href="/admin/cars">
                  <Car />
                  <span>Cars</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith('/admin/galleries')}
                tooltip={{ children: "Galleries", side: "right", align: "center" }}
              >
                <Link href="/admin/galleries">
                  <ImageIconLucide />
                  <span>Galleries</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith('/admin/meta-web')}
                tooltip={{ children: "Website Settings", side: "right", align: "center" }}
              >
                <Link href="/admin/meta-web">
                  <Settings />
                  <span>Meta Website</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith('/admin/faqs')}
                tooltip={{ children: "FAQs", side: "right", align: "center" }}
              >
                <Link href="/admin/faqs">
                  <HelpCircle />
                  <span>FAQs</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/profile'}
                tooltip={{ children: "Profile", side: "right", align: "center" }}
              >
                <Link href="/profile">
                  <UserCircle />
                  <span>Profile</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        {user && (
          <SidebarFooter className="mt-auto border-t border-sidebar-border">
             <div className="flex items-center gap-2 p-3">
                <UserCircle className="h-8 w-8 text-sidebar-muted-foreground" />
                <div>
                    <p className="text-sm font-medium text-sidebar-foreground">{user.name}</p>
                    <p className="text-xs text-sidebar-muted-foreground">{user.email}</p>
                </div>
            </div>
          </SidebarFooter>
        )}
      </Sidebar>
      <SidebarInset>
        <AppHeader />
        <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="border-t bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-between gap-4 md:h-20 md:flex-row py-6">
            <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
              © {new Date().getFullYear()} Adminify. All rights reserved.
            </p>
          </div>
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}
