# Adding Images to Your Next.js Application

This guide explains how to add images to your Next.js application and deploy them to Vercel.

## 1. Understanding Next.js Image Optimization

Next.js provides an `Image` component that automatically optimizes images for better performance:

- Automatically serves images in modern formats like WebP
- Prevents layout shifts with proper sizing
- Lazy loads images by default
- Only loads images when they enter the viewport

## 2. Adding Local Images

### Step 1: Place Images in the Public Directory

We've created a `public/images` directory for you. Add your image files here:

```bash
# Example structure
public/
  images/
    logo.png
    profile.jpg
    banner.webp
```

### Step 2: Use the Next.js Image Component

```jsx
import Image from 'next/image';

function MyComponent() {
  return (
    <Image
      src="/images/logo.png"  // Path relative to the public directory
      alt="Logo"              // Always include alt text for accessibility
      width={300}             // Width in pixels
      height={200}            // Height in pixels
    />
  );
}
```

## 3. Using Remote Images

### Step 1: Configure Allowed Domains

We've already updated your `next.config.ts` to allow images from:
- placehold.co
- images.unsplash.com
- res.cloudinary.com

If you need to add more domains, update the `remotePatterns` in `next.config.ts`.

### Step 2: Use the Image Component with Remote URLs

```jsx
import Image from 'next/image';

function ProfileImage() {
  return (
    <Image
      src="https://images.unsplash.com/photo-1551434678-e076c223a692"
      alt="CEO working at desk"
      width={400}
      height={300}
    />
  );
}
```

## 4. Image Optimization Services

For professional image management, consider using:

- **Cloudinary**: Offers automatic resizing, format optimization, and CDN delivery
- **Imgix**: Powerful image processing API
- **Vercel Image Optimization**: Built into Vercel deployments

## 5. Deploying to Vercel

After adding images to your project:

1. Commit your changes to your GitHub repository:
   ```bash
   git add .
   git commit -m "Add images to the project"
   git push
   ```

2. Vercel will automatically detect the changes and redeploy your application

3. Your images will be optimized and served through Vercel's global CDN

## 6. Example Page

We've created an example page at `/examples/images` that demonstrates how to use images in your application. Visit this page to see examples of both local and remote images.

## 7. Best Practices

- Always specify width and height to prevent layout shifts
- Use responsive images with the `sizes` prop for different viewports
- Add the `priority` attribute to images above the fold
- Use proper alt text for accessibility
- Consider using blur placeholders for large images

## Need Help?

If you have any questions or need further assistance, refer to the [Next.js Image documentation](https://nextjs.org/docs/api-reference/next/image).
