# Step 2: Create Your EC2 Instance (Virtual Computer)

## What is EC2?

EC2 (Elastic Compute Cloud) is like renting a computer in the cloud. Think of it as a virtual computer that runs on Amazon's servers.

## Why We Need EC2?

- **Your app needs a place to run**: Right now your backend is on Render, but we want it on AWS
- **Full control**: You can install anything you want
- **Learning experience**: Most companies use AWS EC2

## Step-by-Step EC2 Creation

### 1. Access AWS Console

1. Go to: https://console.aws.amazon.com
2. Sign in with your AWS account
3. You'll see the AWS Management Console (dashboard)

### 2. Find EC2 Service

1. In the search bar at the top, type: **"EC2"**
2. Click on **"EC2"** from the search results
3. You'll be taken to the EC2 Dashboard

### 3. Launch Your Instance

1. Click the big orange button: **"Launch Instance"**
2. This will start the process of creating your virtual computer

### 4. Configure Your Instance

#### Step 4a: Name Your Instance

- **Name**: Type `imagify-server`
- This is just a label to identify your computer

#### Step 4b: Choose Operating System

- **Application and OS Images**: Look for **"Ubuntu Server 22.04 LTS"**
- **Architecture**: Keep default (x86)
- **Important**: Choose Ubuntu (not Amazon Linux) because:
  - Better for beginners
  - More tutorials available
  - Better Docker support
  - Simpler commands

#### Step 4c: Choose Instance Type

- **Instance type**: Select **"t2.micro"**
- **Important**: This is free tier eligible
- This determines how powerful your computer will be

#### Step 4d: Create Key Pair

- **Key pair name**: Click **"Create new key pair"**
- **Name**: Type `imagify-key` (or `imaginex-key` as ChatGPT suggested)
- **Key pair type**: Select **"RSA"**
- **Private key file format**: Select **".pem"**
- Click **"Create key pair"**
- **Important**: Your browser will download a file called `imagify-key.pem`
- **Save this file safely** - you'll need it to connect to your server

#### Step 4e: Network Settings

- **Allow HTTP traffic from the internet**: ✅ **Check this box**
- **Allow HTTPS traffic from the internet**: ✅ **Check this box**
- **Important**: Click **"Edit"** under "Firewall (security groups)"
- Add these rules:
  - SSH (Port 22): 0.0.0.0/0 ✅
  - HTTP (Port 80): 0.0.0.0/0 ✅
  - Custom TCP (Port 4000): 0.0.0.0/0 ✅ (for your Node.js backend)
- This allows your app to be accessed from the internet

#### Step 4f: Configure Security Group

- **Security group name**: Type `imagify-sg`
- **Description**: Type `Security group for Imagify app`
- **Inbound security group rules**: You should see:
  - SSH (Port 22): 0.0.0.0/0 ✅
  - HTTP (Port 80): 0.0.0.0/0 ✅
  - HTTPS (Port 443): 0.0.0.0/0 ✅

### 5. Launch Your Instance

1. Scroll down to the bottom
2. Click **"Launch Instance"**
3. You'll see a success message

### 6. View Your Instance

1. Click **"View all instances"**
2. You'll see your `imagify-server` in the list
3. Wait for **"Instance state"** to show **"Running"** (green)
4. **Note down your Public IPv4 address** (looks like: 3.250.123.45)

## What You Just Created:

- ✅ A virtual computer running Ubuntu Server 22.04 LTS
- ✅ Free tier eligible (t2.micro)
- ✅ Security group with proper ports open (SSH, HTTP, Custom TCP 4000)
- ✅ Key pair for secure connection

## Important Information to Save:

1. **Public IP Address**: Your server's internet address
2. **Key file**: `imagify-key.pem` (downloaded to your computer)
3. **Instance ID**: Something like `i-1234567890abcdef0`

## Next Steps:

Once you complete this step, tell me:

1. "EC2 instance created"
2. Your Public IP address
3. That you have the `imagify-key.pem` file

Then I'll guide you to the next step!

## Questions?

- **Q**: What if I can't find EC2?
  **A**: Use the search bar at the top of AWS Console

- **Q**: What if the key file doesn't download?
  **A**: Check your browser's download folder or try again

- **Q**: How long does it take to create?
  **A**: Usually 1-2 minutes

---

**Ready? Go to https://console.aws.amazon.com and start creating your EC2 instance!**
