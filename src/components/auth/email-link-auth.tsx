'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/firebase/auth-context';

export default function EmailLinkAuth() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [linkSent, setLinkSent] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { isSignInLink, completeSignInWithEmailLink, sendSignInLink } = useAuth();

  // Check if the current URL is a sign-in link
  useEffect(() => {
    const checkEmailLink = async () => {
      // Check if the URL contains a sign-in link
      if (isSignInLink(window.location.href)) {
        setVerifying(true);
        
        // Get the email from localStorage if available
        let emailForSignIn = window.localStorage.getItem('emailForSignIn');
        
        // If no email in storage, prompt the user
        if (!emailForSignIn) {
          emailForSignIn = window.prompt('Please provide your email for confirmation');
          if (!emailForSignIn) {
            setVerifying(false);
            toast({
              title: 'Authentication Failed',
              description: 'Email confirmation is required to complete sign-in.',
              variant: 'destructive',
            });
            return;
          }
        }
        
        try {
          // Complete the sign-in process
          await completeSignInWithEmailLink(emailForSignIn, window.location.href);
          
          // Clear the email from storage
          window.localStorage.removeItem('emailForSignIn');
          
          toast({
            title: 'Authentication Successful',
            description: 'You have been successfully signed in.',
          });
          
          // Redirect to home page or dashboard
          router.push('/');
        } catch (error: any) {
          console.error('Error signing in with email link:', error);
          toast({
            title: 'Authentication Failed',
            description: error.message || 'Failed to complete sign-in. Please try again.',
            variant: 'destructive',
          });
        } finally {
          setVerifying(false);
        }
      }
    };
    
    checkEmailLink();
  }, [isSignInLink, completeSignInWithEmailLink, router, toast]);

  const handleSendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: 'Email Required',
        description: 'Please enter your email address.',
        variant: 'destructive',
      });
      return;
    }
    
    setLoading(true);
    
    // Configure action code settings
    const actionCodeSettings = {
      // URL you want to redirect back to. The domain must be in the authorized domains list in Firebase Console.
      url: `${window.location.origin}/auth`,
      // This must be true for email link sign-in
      handleCodeInApp: true,
    };
    
    try {
      await sendSignInLink(email, actionCodeSettings);
      
      // Save the email locally to remember the user when they complete sign-in
      window.localStorage.setItem('emailForSignIn', email);
      
      setLinkSent(true);
      toast({
        title: 'Email Sent',
        description: 'Check your email for the sign-in link.',
      });
    } catch (error: any) {
      console.error('Error sending email link:', error);
      toast({
        title: 'Failed to Send Email',
        description: error.message || 'An error occurred while sending the sign-in link.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Verifying...</CardTitle>
          <CardDescription>Please wait while we verify your sign-in link.</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{linkSent ? 'Check Your Email' : 'Sign In with Email Link'}</CardTitle>
        <CardDescription>
          {linkSent 
            ? 'A sign-in link has been sent to your email address.' 
            : 'Enter your email to receive a sign-in link.'}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSendLink}>
        <CardContent className="space-y-4">
          {!linkSent && (
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email Address</label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>
          )}
          
          {linkSent && (
            <div className="text-center text-sm text-muted-foreground">
              <p>If you don't see the email, check your spam folder.</p>
              <p className="mt-2">
                Wrong email?{' '}
                <button 
                  type="button" 
                  className="text-primary hover:underline"
                  onClick={() => setLinkSent(false)}
                >
                  Try again
                </button>
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          {!linkSent ? (
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Sign-In Link'}
            </Button>
          ) : (
            <Button 
              type="button" 
              variant="outline" 
              className="w-full"
              onClick={() => setLinkSent(false)}
            >
              Back to Sign In
            </Button>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
