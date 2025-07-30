This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## AWS S3 Configuration

This project uses AWS S3 for file storage (course images, videos, documents, etc.). To set up S3 integration:

### 1. Create AWS S3 Bucket

- Create an S3 bucket in your AWS account
- Configure bucket permissions for public read access on uploaded files
- Note your bucket name and region

### 2. Create AWS IAM User

- Create an IAM user with programmatic access
- Attach the following permissions policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:PutObjectAcl",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

### 3. Environment Variables

Copy `.env.example` to `.env.local` and update with your AWS credentials:

```bash
cp .env.example .env.local
```

Update the values in `.env.local`:

```env
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_REGION=your-bucket-region
AWS_S3_BUCKET=your-bucket-name
```

### 4. File Upload Features

The application supports uploading:

- Course images (JPEG, PNG, GIF, WebP)
- Course preview videos (MP4, MOV, AVI, WebM)
- Course materials and documents (PDF, DOC, DOCX, PPT, PPTX)
- Video content for course modules

All uploads include:

- Progress tracking
- Error handling with user-friendly messages
- File type and size validation (max 100MB)
- Automatic file renaming for uniqueness

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
