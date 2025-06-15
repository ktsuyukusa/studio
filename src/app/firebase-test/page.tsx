'use client';

import { useState } from 'react';
import { testFirebaseAuth } from '@/lib/firebase/test';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function FirebaseTestPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const handleTest = async () => {
    setLoading(true);
    setResult(null);
    setError(null);
    
    try {
      const testResult = await testFirebaseAuth();
      console.log('Test result:', testResult);
      setResult(testResult);
    } catch (err) {
      console.error('Test error:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Firebase Authentication Test</CardTitle>
            <CardDescription className="text-center">
              Test Firebase authentication by creating a random test user
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleTest} 
              className="w-full" 
              disabled={loading}
            >
              {loading ? 'Testing...' : 'Run Firebase Auth Test'}
            </Button>
            
            {result && (
              <div className="mt-4 p-4 bg-green-50 rounded-md">
                <h3 className="font-semibold text-green-700">Test Result:</h3>
                <pre className="mt-2 text-sm overflow-auto max-h-60">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
            
            {error && (
              <div className="mt-4 p-4 bg-red-50 rounded-md">
                <h3 className="font-semibold text-red-700">Error:</h3>
                <pre className="mt-2 text-sm overflow-auto max-h-60">
                  {JSON.stringify(error, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
  );
}
