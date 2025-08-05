# Step 3: Connect to Your EC2 Server and Install Docker

## What We'll Do:

1. Connect to your EC2 server using SSH
2. Install Docker on Ubuntu
3. Test that everything works
4. Prepare for deploying your application

## Prerequisites:

- Your EC2 instance running (✅ Done!)
- Your key file (`imagify-key.pem`) downloaded
- Your Public IP: `13.62.100.132`

## Step-by-Step Process:

### 1. Prepare Your Key File

**Windows Users:**

1. Move `imagify-key.pem` to a safe folder (e.g., `C:\aws-keys\`)
2. Open PowerShell as Administrator
3. Navigate to your key folder:
   ```powershell
   cd C:\aws-keys\
   ```
4. Set correct permissions:
   ```powershell
   icacls imagify-key.pem /inheritance:r
   icacls imagify-key.pem /grant:r "$($env:USERNAME):(R)"
   ```

**Mac/Linux Users:**

1. Open Terminal
2. Navigate to where your key file is:
   ```bash
   cd ~/Downloads  # or wherever your key file is
   ```
3. Set correct permissions:
   ```bash
   chmod 400 imagify-key.pem
   ```

### 2. Connect to Your Server

**Windows (PowerShell):**

```powershell
ssh -i "C:\aws-keys\imagify-key.pem" ubuntu@13.62.100.132
```

**Mac/Linux (Terminal):**

```bash
ssh -i imagify-key.pem ubuntu@13.62.100.132
```

### 3. What to Expect:

- First time: You'll see a warning about authenticity - type `yes`
- You'll be connected to your Ubuntu server
- You'll see a command prompt like: `ubuntu@ip-172-31-xx-xx:~$`

### 4. Install Docker

Once connected to your server, run these commands one by one:

```bash
# Update system packages
sudo apt update

# Install required packages
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add Docker repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Update package list again
sudo apt update

# Install Docker
sudo apt install -y docker-ce docker-ce-cli containerd.io

# Add your user to docker group (so you don't need sudo for docker commands)
sudo usermod -aG docker $USER

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Verify Docker installation
docker --version
```

### 5. Test Docker

```bash
# Test Docker with hello-world
docker run hello-world
```

You should see a message like "Hello from Docker!"

### 6. Install Docker Compose

```bash
# Download Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Make it executable
sudo chmod +x /usr/local/bin/docker-compose

# Test Docker Compose
docker-compose --version
```

## What You've Accomplished:

- ✅ Connected to your EC2 server
- ✅ Installed Docker
- ✅ Installed Docker Compose
- ✅ Verified everything works

## Next Steps:

Once you complete this step, tell me:

1. "Successfully connected to EC2"
2. "Docker installed and working"
3. Any error messages if something went wrong

Then I'll create the next step for deploying your application!

## Troubleshooting:

**If you get "Permission denied" error:**

- Make sure your key file has correct permissions
- Try: `chmod 400 imagify-key.pem` (Mac/Linux)

**If you can't connect:**

- Check that your instance is "Running"
- Verify your Public IP is correct
- Make sure your key file is in the right location

**If Docker installation fails:**

- Make sure you're connected as `ubuntu` user
- Try running commands with `sudo` if needed

---

**Ready to connect? Start with preparing your key file!**
