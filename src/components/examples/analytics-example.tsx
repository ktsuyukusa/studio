'use client';

import { useState } from 'react';
import { useAnalytics } from '@/lib/firebase/analytics-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function AnalyticsExample() {
  const { logEvent, setUserProperties } = useAnalytics();
  const { toast } = useToast();
  const [count, setCount] = useState(0);

  const handleButtonClick = () => {
    // Increment counter
    const newCount = count + 1;
    setCount(newCount);
    
    // Log a custom event
    logEvent('button_click', {
      button_name: 'example_button',
      click_count: newCount,
      timestamp: new Date().toISOString()
    });
    
    // Show toast
    toast({
      title: 'Analytics Event Logged',
      description: `Button click event logged (count: ${newCount})`,
    });
  };

  const handleSetUserProperty = () => {
    // Set a custom user property
    setUserProperties({
      last_interaction: new Date().toISOString(),
      interaction_count: count
    });
    
    // Show toast
    toast({
      title: 'User Properties Set',
      description: 'Custom user properties have been set',
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Firebase Analytics Example</CardTitle>
        <CardDescription>
          This component demonstrates how to use Firebase Analytics in your application.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-center text-2xl font-bold">{count}</p>
        <p className="text-sm text-muted-foreground">
          Click the button below to increment the counter and log an analytics event.
          Each click will send an event to Firebase Analytics.
        </p>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button 
          onClick={handleButtonClick} 
          className="w-full"
        >
          Log Button Click Event
        </Button>
        <Button 
          onClick={handleSetUserProperty} 
          variant="outline"
          className="w-full"
        >
          Set User Properties
        </Button>
      </CardFooter>
    </Card>
  );
}
