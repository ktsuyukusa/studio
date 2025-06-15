Place your image files in this directory.

For example:
- logo.png
- profile.jpg
- banner.webp

Then reference them in your components using the Next.js Image component:

import Image from 'next/image';

function MyComponent() {
  return (
    <Image
      src="/images/logo.png"
      alt="Logo"
      width={300}
      height={200}
    />
  );
}
