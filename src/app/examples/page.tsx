'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const examples = [
  {
    title: 'Analytics',
    description: 'Learn how to use Firebase Analytics in your application',
    href: '/examples/analytics',
  },
  {
    title: 'Images',
    description: 'Learn how to add and optimize images in your Next.js application',
    href: '/examples/images',
  },
];

export default function ExamplesPage() {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Examples</h1>
        <p className="text-muted-foreground mt-2">
          Explore examples of different features and implementations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {examples.map((example) => (
          <Card key={example.href} className="flex flex-col">
            <CardHeader>
              <CardTitle>{example.title}</CardTitle>
              <CardDescription>{example.description}</CardDescription>
            </CardHeader>
            <CardFooter className="mt-auto">
              <Button asChild>
                <Link href={example.href}>View Example</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
