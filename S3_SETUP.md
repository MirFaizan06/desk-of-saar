# Amazon S3 Setup Guide

---

## 1. Create an S3 Bucket

1. Go to [AWS Console](https://console.aws.amazon.com/) → search **S3** → **Create bucket**
2. Set a unique **Bucket name** (e.g. `saar-portfolio-files`)
3. Choose your **Region** (e.g. `ap-south-1` for India)
4. Under **Block Public Access** — **uncheck** "Block all public access" and confirm
5. Leave everything else as default → **Create bucket**

---

## 2. Add Bucket Policy (Public Read)

1. Open your bucket → **Permissions** tab → **Bucket policy** → **Edit**
2. Paste this (replace `your-bucket-name`):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

3. **Save changes**

---

## 3. Configure CORS (Required for Uploads)

1. Same **Permissions** tab → **CORS** → **Edit**
2. Paste this (add your production domain to `AllowedOrigins`):

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedOrigins": [
      "http://localhost:5173",
      "https://your-production-domain.com"
    ],
    "ExposeHeaders": ["ETag"]
  }
]
```

3. **Save changes**

---

## 4. Create an IAM User

1. Go to **IAM** → **Users** → **Create user**
2. Username: anything (e.g. `saar-s3-uploader`)
3. **Attach policies directly** → **Create policy** → JSON tab → paste this (replace `your-bucket-name`):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:DeleteObject"],
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

4. Name the policy → create it → attach it to the user → **Create user**
5. Open the user → **Security credentials** → **Create access key** → select **Other** → copy both keys

---

## 5. Fill in `.env`

```env
VITE_AWS_REGION=ap-south-1
VITE_AWS_ACCESS_KEY_ID=your_access_key
VITE_AWS_SECRET_ACCESS_KEY=your_secret_key
VITE_S3_BUCKET=your-bucket-name
VITE_S3_PUBLIC_URL=https://your-bucket-name.s3.ap-south-1.amazonaws.com
```

> Format for `VITE_S3_PUBLIC_URL`: `https://{bucket}.s3.{region}.amazonaws.com` — no trailing slash.

---

## Troubleshooting

- **CORS error on upload** → your production domain isn't in the CORS `AllowedOrigins`
- **Image/PDF not loading** → bucket policy not saved, or "Block public access" is still on
- **403 on upload** → IAM policy not attached correctly to the user
