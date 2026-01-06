"use client";

import { authClient } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from 'react';

export default function Home() {
  const { data: session } = authClient.useSession();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  const onSubmit = async () => {
    await authClient.signUp.email({
      email,
      password,
      name,
    }, {
      onSuccess: () => {
        alert('User created successfully!');
      },
      onError: (ctx) => {
        alert(ctx.error.message);
      },
    });
  };

  const onLogin = async () => {
    await authClient.signIn.email({
      email: loginEmail,
      password: loginPassword,
    }, {
      onSuccess: () => {
        alert('Logged in successfully!');
      },
      onError: (ctx) => {
        alert(ctx.error.message);
      },
    });
  };

  if (session) {
    return (
      <div className="flex flex-col gap-4 p-8">
        <p>Logged in as {session.user.name}</p>
        <Button onClick={() => authClient.signOut()}>
          Sign out
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-8 max-w-md mx-auto">
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">Create Account</h2>
        <Input placeholder='Name' value={name} onChange={(e) => setName(e.target.value)} />
        <Input placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} type='email' autoComplete='email' />
        <Input placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} type='password' />
        <Button onClick={onSubmit}>Create User</Button>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">Login</h2>
        <Input placeholder='Email' value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} type='email' autoComplete='email' />
        <Input placeholder='Password' value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} type='password' />
        <Button onClick={onLogin}>Login</Button>
      </div>
    </div>
  );
}