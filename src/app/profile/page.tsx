"use client";

import { useAuth } from '@/contexts/AuthContext';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, UserCircle, ShieldCheck } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    // This case should ideally be handled by AppLayout redirecting,
    // but as a fallback or if accessed directly before redirect.
    return (
      <AppLayout>
        <div className="flex justify-center items-center h-full">
          <p>Loading user profile...</p>
        </div>
      </AppLayout>
    );
  }
  
  const getInitials = (name: string | undefined) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return names[0].substring(0, 2).toUpperCase();
  };


  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        <Card className="shadow-xl">
          <CardHeader className="items-center text-center">
             <Avatar className="h-24 w-24 mb-4 ring-4 ring-primary ring-offset-background ring-offset-2">
              <AvatarImage src={`https://placehold.co/100x100.png?text=${getInitials(user.name)}`} alt={user.name} data-ai-hint="user avatar" />
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-3xl font-bold text-primary">{user.name}</CardTitle>
            <CardDescription>Your personal account details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg">
              <UserCircle className="h-6 w-6 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">Full Name</p>
                <p className="text-lg text-foreground">{user.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg">
              <Mail className="h-6 w-6 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">Email Address</p>
                <p className="text-lg text-foreground">{user.email}</p>
              </div>
            </div>
             <div className="flex items-center space-x-4 p-4 bg-accent/10 rounded-lg border border-accent">
              <ShieldCheck className="h-6 w-6 text-accent" />
              <div>
                <p className="text-sm font-medium text-accent-foreground">Account Status</p>
                <p className="text-lg text-accent-foreground">Verified</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
