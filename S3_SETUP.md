# Amazon S3 Setup Guide

Complete guide to configure S3 for storing book covers, PDFs, project thumbnails, and attachments.

---

## 1. Create an S3 Bucket

1. Log in to the [AWS Console](https://console.aws.amazon.com/)
2. Search for **S3** and open it
3. Click **Create bucket**
4. **Bucket name**: choose a unique name (e.g. `saar-portfolio-files`)
5. **AWS Region**: choose the closest to your users (e.g. `ap-south-1` for India)
6. **Object Ownership**: Select **ACLs disabled** (recommended)
7. **Block Public Access**: **Uncheck** "Block all public access"
   - Confirm the warning checkbox
8. Leave all other defaults
9. Click **Create bucket**

---

## 2. Configure the Bucket Policy (Public Read)

This allows the website to display images and PDFs directly from S3 URLs.

1. Open your bucket → **Permissions** tab
2. Scroll to **Bucket policy** → Click **Edit**
3. Paste this policy (replace `your-bucket-name`):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadObjects",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": [
        "arn:aws:s3:::your-bucket-name/covers/*",
        "arn:aws:s3:::your-bucket-name/thumbnails/*",
        "arn:aws:s3:::your-bucket-name/books/*",
        "arn:aws:s3:::your-bucket-name/attachments/*"
      ]
    }
  ]
}
```

4. Click **Save changes**

---

## 3. Configure CORS (Required for Browser Uploads)

Without CORS, the browser will block all upload requests from the admin panel.

1. Open your bucket → **Permissions** tab
2. Scroll to **Cross-origin resource sharing (CORS)** → Click **Edit**
3. Paste this configuration:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedOrigins": [
      "http://localhost:5173",
      "http://localhost:4173",
      "https://your-production-domain.com"
    ],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

4. Replace `your-production-domain.com` with your actual domain
5. Click **Save changes**

---

## 4. Create a Restricted IAM User

**Never use your root AWS credentials.** Create a dedicated IAM user with minimal permissions.

### Step 4a: Create an IAM Policy

1. Go to **IAM** → **Policies** → **Create policy**
2. Click the **JSON** tab
3. Paste this policy (replace `your-bucket-name`):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "S3AdminUpload",
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    },
    {
      "Sid": "S3ListBucket",
      "Effect": "Allow",
      "Action": "s3:ListBucket",
      "Resource": "arn:aws:s3:::your-bucket-name"
    }
  ]
}
```

4. Name it: `SaarPortfolioS3Admin`
5. Click **Create policy**

### Step 4b: Create the IAM User

1. Go to **IAM** → **Users** → **Create user**
2. Username: `saar-portfolio-s3`
3. Select **Attach policies directly**
4. Search for and select `SaarPortfolioS3Admin`
5. Click **Create user**

### Step 4c: Generate Access Keys

1. Open the user you just created
2. Click **Security credentials** tab
3. Under **Access keys** → **Create access key**
4. Use case: **Other**
5. Click **Create access key**
6. **COPY BOTH KEYS NOW** — the secret key is only shown once

---

## 5. Configure Environment Variables

Add to your `.env` file:

```env
VITE_AWS_REGION=ap-south-1
VITE_AWS_ACCESS_KEY_ID=AKIA...your_key...
VITE_AWS_SECRET_ACCESS_KEY=your_secret_key
VITE_S3_BUCKET=your-bucket-name
VITE_S3_PUBLIC_URL=https://your-bucket-name.s3.ap-south-1.amazonaws.com
```

> The `VITE_S3_PUBLIC_URL` format is:
> `https://{bucket-name}.s3.{region}.amazonaws.com`

---

## 6. Bucket Folder Structure

Files are stored with this prefix structure:

```
your-bucket/
├── covers/          → Book cover images (JPG, PNG, WebP)
├── thumbnails/      → Project thumbnail images
├── books/           → Book PDF files
└── attachments/     → Project PDF attachments
```

---

## 7. Security Notes

⚠️ **Important:** The AWS credentials (`VITE_AWS_ACCESS_KEY_ID`, `VITE_AWS_SECRET_ACCESS_KEY`) are embedded in the built JavaScript bundle and are visible to anyone who inspects the source.

**This is mitigated by:**
- The IAM policy only allows `PutObject` and `DeleteObject` on your specific bucket
- A malicious actor could upload files to your bucket or delete existing ones — but cannot access other AWS resources, create buckets, modify billing, or do anything else
- The admin panel UI requires Firebase authentication to reach file upload controls, adding an additional barrier

**To further harden (optional):**
- Add an S3 bucket condition to restrict uploads by `aws:Referer` (HTTP referer header — can be spoofed, but adds friction)
- Set a monthly budget alert in AWS Billing so you're notified if unexpected S3 usage occurs (someone filling your bucket)
- Enable S3 object versioning if you want recovery from accidental deletes

---

## Troubleshooting

**CORS error on upload** — Ensure your deployment domain is listed in the S3 CORS config. CORS errors appear as network failures with no useful message in the console.

**403 Forbidden on image display** — The bucket policy public read statement is not applied. Verify the bucket policy in the Permissions tab and that "Block all public access" is disabled.

**Upload succeeds but URL doesn't load** — Check that `VITE_S3_PUBLIC_URL` exactly matches `https://{bucket}.s3.{region}.amazonaws.com` with no trailing slash.

**"Access Denied" uploading from admin panel** — The IAM user's `PutObject` permission may not be saved. Re-check the policy attachment in IAM.
