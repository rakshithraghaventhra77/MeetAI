"use client";

import { Card, CardContent } from '@/components/ui/card';
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from '@/components/ui/input'; 
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { OctagonAlertIcon } from 'lucide-react';

/**
 * SignInView component that renders a responsive sign-in card layout.
 * 
 * The component displays a card with content in a grid layout that:
 * - Shows 2 columns side-by-side on desktop (md breakpoint)
 * - Stacks vertically on mobile devices
 */

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, { message: 'Password is Required' }),
});

/* type SignInFormData = z.infer<typeof signInSchema>; */

export const SignInView = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setError(null);
    setIsPending(true);

    const { error } = await authClient.signIn.email(
      {
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: () => {
          setIsPending(false);
          router.push('/dashboard');
          router.refresh();
        },
      }
    );

    if (error) {
      setError(error.message ?? 'Unable to sign in. Please try again.');
      setIsPending(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden p-0">
        <CardContent className="grid gap-6 p-0 md:grid-cols-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6 p-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Sign In</h2>
                <p className="text-sm text-gray-600">Enter your credentials to sign in</p>
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="********" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <Alert variant="destructive">
                  <OctagonAlertIcon className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? 'Signing in...' : 'Sign In'}
              </Button>

              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">Or continue with</span>
              </div>

              <Button
                disabled={isPending}
                onClick={async () => {
                  setError(null);
                  setIsPending(true);
                  try {
                    await authClient.signIn.social({
                      provider: 'google',
                    }, {
                      onSuccess: () => {
                        setIsPending(false);
                        router.push('/dashboard');
                        router.refresh();
                      },
                      onError: (error) => {
                        setError(error.message ?? 'Failed to sign in with Google');
                        setIsPending(false);
                      },
                    });
                  } catch (err) {
                    setError('An error occurred during sign in');
                    setIsPending(false);
                  }
                }}
                variant="outline"
                type="button"
                className="w-full"
              >
                Google
              </Button>

              <div className="text-center text-sm">
                Don’t have an account?{' '}
                <Link href="/auth/sign-up" className="underline underline-offset-4">
                  Sign up
                </Link>
              </div>
            </form>
          </Form>

          <div className="bg-gradient-to-b from-green-900 to-green-900 relative hidden md:flex flex-col gap-y-4 items-center justify-center">
            <img src="/logo.svg" alt="Meet.AI Logo" className="h-[92px] w-[92px]" />
            <p className="text-2xl font-semibold text-white">Meet.AI</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
