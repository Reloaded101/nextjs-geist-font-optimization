"use client";

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';

type AuthMode = 'login' | 'register' | 'license';

interface AuthenticationFormProps {
  onSuccess?: () => void;
}

export default function AuthenticationForm({ onSuccess }: AuthenticationFormProps) {
  const [activeMode, setActiveMode] = useState<AuthMode>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [license, setLicense] = useState('');
  const [tfaCode, setTfaCode] = useState('');
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);
    try {
      let endpoint = '';
      let payload = {};

      if (activeMode === 'login') {
        endpoint = '/api/auth/login';
        payload = { username, password, tfaCode };
      } else if (activeMode === 'register') {
        endpoint = '/api/auth/register';
        payload = { username, password, license };
      } else if (activeMode === 'license') {
        endpoint = '/api/auth/license';
        payload = { license, tfaCode };
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      // Show success animation
      setIsSuccess(true);
      setStatusMsg('Authentication successful!');
      onSuccess?.();

      // Store user info and redirect after animation
      setTimeout(() => {
        if (data.success && data.user && data.user.info) {
          localStorage.setItem('userInfo', JSON.stringify(data.user.info));
          localStorage.setItem('authSuccess', 'true');
          window.location.href = '/dashboard';
        }
      }, 2000); // Wait for animation to complete
      
    } catch (error: any) {
      setStatusMsg(error.message);
    }
  };

  const inputClasses = "bg-black/50 border-white/10 focus:border-purple-500 focus:ring-purple-500/20 text-white placeholder:text-gray-500 rounded-lg hover:border-purple-500/50 transition-all duration-300";
  const labelClasses = "text-sm font-medium text-gray-300 uppercase tracking-wide";

  return (
    <div className="relative">
      {/* Success animation overlay */}
      <div className={`fixed inset-0 z-50 transition-all duration-1000 pointer-events-none
        ${isSuccess ? 'opacity-100' : 'opacity-0'}`}>
        {/* Animated rings */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${
          isSuccess ? 'scale-100' : 'scale-0'
        }`}>
          <div className="absolute w-96 h-96 rounded-full border-2 border-purple-500/20 animate-ping" />
          <div className="absolute w-80 h-80 rounded-full border-2 border-blue-500/20 animate-ping [animation-delay:200ms]" />
          <div className="absolute w-64 h-64 rounded-full border-2 border-purple-500/20 animate-ping [animation-delay:400ms]" />
        </div>
        {/* Central flash */}
        <div className={`absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-lg transition-all duration-1000 ${
          isSuccess ? 'opacity-100' : 'opacity-0'
        }`} />
      </div>

      {/* Form container with fade out animation */}
      <div className={`transition-all duration-1000 ${
        isSuccess ? 'scale-95 opacity-0 blur-lg' : 'scale-100 opacity-100'
      }`}>
        <form onSubmit={handleSubmit} className="relative space-y-6 w-full max-w-md bg-black/40 backdrop-blur-sm p-8 rounded-lg border border-white/10">
          <Tabs 
            value={activeMode} 
            onValueChange={(value) => setActiveMode(value as AuthMode)}
            className="w-full"
          >
            <TabsList className="w-full bg-black/40 p-1 backdrop-blur-sm border border-white/10 rounded-lg mb-6">
              <TabsTrigger 
                value="login"
                className="w-full data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400 rounded-md transition-all duration-200"
              >
                LOGIN
              </TabsTrigger>
              <TabsTrigger 
                value="register"
                className="w-full data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400 rounded-md transition-all duration-200"
              >
                REGISTER
              </TabsTrigger>
              <TabsTrigger 
                value="license"
                className="w-full data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400 rounded-md transition-all duration-200"
              >
                LICENSE
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4">
              <div className="space-y-2">
                <label className={labelClasses}>Username</label>
                <Input 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  placeholder="Enter username" 
                  autoComplete="username"
                  required
                  className={inputClasses}
                />
              </div>
              <div className="space-y-2">
                <label className={labelClasses}>Password</label>
                <Input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="Enter password" 
                  autoComplete="current-password"
                  required
                  className={inputClasses}
                />
              </div>
              <div className="space-y-2">
                <label className={labelClasses}>2FA (Optional)</label>
                <Input 
                  value={tfaCode} 
                  onChange={(e) => setTfaCode(e.target.value)} 
                  placeholder="Enter 2FA code" 
                  autoComplete="one-time-code"
                  inputMode="numeric"
                  className={inputClasses}
                />
              </div>
            </TabsContent>

            <TabsContent value="register" className="space-y-4">
              <div className="space-y-2">
                <label className={labelClasses}>Username</label>
                <Input 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  placeholder="Choose username" 
                  autoComplete="username"
                  required
                  className={inputClasses}
                />
              </div>
              <div className="space-y-2">
                <label className={labelClasses}>Password</label>
                <Input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="Choose password" 
                  autoComplete="new-password"
                  required
                  minLength={8}
                  className={inputClasses}
                />
              </div>
              <div className="space-y-2">
                <label className={labelClasses}>License</label>
                <Input 
                  value={license} 
                  onChange={(e) => setLicense(e.target.value)} 
                  placeholder="Enter license key" 
                  required
                  autoComplete="off"
                  spellCheck="false"
                  className={`${inputClasses} uppercase`}
                />
              </div>
            </TabsContent>

            <TabsContent value="license" className="space-y-4">
              <div className="space-y-2">
                <label className={labelClasses}>License Key</label>
                <Input 
                  value={license} 
                  onChange={(e) => setLicense(e.target.value)} 
                  placeholder="Enter license key" 
                  required
                  autoComplete="off"
                  spellCheck="false"
                  className={`${inputClasses} uppercase`}
                />
              </div>
              <div className="space-y-2">
                <label className={labelClasses}>2FA (Optional)</label>
                <Input 
                  value={tfaCode} 
                  onChange={(e) => setTfaCode(e.target.value)} 
                  placeholder="Enter 2FA code" 
                  autoComplete="one-time-code"
                  inputMode="numeric"
                  className={inputClasses}
                />
              </div>
            </TabsContent>
          </Tabs>

          {statusMsg && (
            <div className={`p-3 rounded-lg ${
              isSuccess 
                ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                : 'bg-red-500/10 border-red-500/20 text-red-400'
            } border text-sm transition-all duration-300`}>
              {statusMsg}
            </div>
          )}
          
          <Button 
            type="submit" 
            className={`w-full py-6 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-purple-500/20 ${
              isSuccess ? 'scale-110 opacity-0 translate-y-4' : ''
            }`}
          >
            {activeMode.toUpperCase()}
          </Button>
        </form>
      </div>
    </div>
  );
}
