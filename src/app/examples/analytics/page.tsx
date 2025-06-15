'use client';

import AnalyticsExample from '@/components/examples/analytics-example';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AnalyticsExamplePage() {
  return (
    <div className="container py-10 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Firebase Analytics Example</h1>
        <p className="text-muted-foreground mt-2">
          This page demonstrates how to use Firebase Analytics in your application
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>About Firebase Analytics</CardTitle>
            <CardDescription>
              Understanding how Firebase Analytics works
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Firebase Analytics is a free app measurement solution that provides insight into app usage and user engagement.
            </p>
            <p>
              Key features include:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Unlimited reporting for up to 500 distinct events</li>
              <li>User behavior insights</li>
              <li>Audience segmentation</li>
              <li>Integration with other Firebase services</li>
              <li>Cross-platform analytics</li>
            </ul>
            <p className="text-sm text-muted-foreground mt-4">
              Note: Analytics events are only logged in production environments or when explicitly enabled for development.
              Check your browser console for debugging information.
            </p>
          </CardContent>
        </Card>

        <AnalyticsExample />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Implementation Details</CardTitle>
          <CardDescription>
            How Firebase Analytics is implemented in this application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            This application uses the following components to implement Firebase Analytics:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><code>src/lib/firebase/config.ts</code> - Initializes Firebase Analytics</li>
            <li><code>src/lib/firebase/analytics-context.tsx</code> - Provides a React context for using Analytics</li>
            <li><code>src/components/examples/analytics-example.tsx</code> - Example component that logs events</li>
          </ul>
          <p className="mt-4">
            To use Analytics in your components:
          </p>
          <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
{`import { useAnalytics } from '@/lib/firebase/analytics-context';

export default function MyComponent() {
  const { logEvent } = useAnalytics();
  
  const handleAction = () => {
    logEvent('button_click', {
      button_name: 'submit',
      page: 'home'
    });
  };
  
  return (
    <button onClick={handleAction}>
      Click Me
    </button>
  );
}`}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
