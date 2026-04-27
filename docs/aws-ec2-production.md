# AWS EC2 Production Path

This repo now has the minimum pieces needed to run as a small hosted web app:

- `nginx` serving the frontend
- Node backend from `backend/`
- PostgreSQL for users and projects
- AWS ALB + ACM for HTTPS
- Route 53 for DNS

## Recommended AWS Resources

- 1 EC2 instance: `t3.small` or `t3.medium`
- 1 RDS PostgreSQL instance: `db.t4g.micro` or similar for 10-20 users
- 1 Application Load Balancer
- 1 ACM certificate for your domain
- 1 Route 53 hosted zone or equivalent DNS record

## What You Must Provide

I can prepare the repo, but these values must come from you or your AWS account:

- the domain name you want to use
- the AWS account where EC2, ALB, ACM, and Route 53 will live
- a final `APP_ORIGIN` such as `https://ew.example.com`
- a strong `JWT_SECRET`
- either:
	- a managed RDS PostgreSQL endpoint, username, password, and database name
	- or approval to run PostgreSQL in Docker on the EC2 instance for an initial deployment

## Fastest First Deployment

If you want the quickest path, use one EC2 instance with Docker for:

- `web`
- `api`
- `postgres`

Then move Postgres to RDS later.

## Exact EC2 Commands

These commands assume Ubuntu 24.04 LTS.

### 1. Create the EC2 instance

Use these settings:

- AMI: Ubuntu Server 24.04 LTS
- Instance type: `t3.small` or `t3.medium`
- Security group inbound:
	- TCP 80 from the ALB security group
	- TCP 22 from your admin IP only
- Disk: at least 20 GB gp3

### 2. SSH to the instance

```bash
ssh -i /path/to/your-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

### 3. Install Docker and Compose

```bash
sudo apt update
sudo apt install -y ca-certificates curl git docker.io docker-compose-v2
sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker $USER
newgrp docker
docker --version
docker compose version
```

### 4. Clone the repo

```bash
git clone YOUR_REPO_URL ew-sim
cd ew-sim
```

### 5. Create deploy secrets

```bash
cp deploy/.env.example deploy/.env
nano deploy/.env
```

Set at least:

```env
POSTGRES_DB=ew_sim
POSTGRES_USER=ew_sim
POSTGRES_PASSWORD=REPLACE_WITH_A_LONG_RANDOM_PASSWORD
JWT_SECRET=REPLACE_WITH_A_LONG_RANDOM_SECRET
APP_ORIGIN=https://YOUR_DOMAIN
```

### 6. Start the stack

```bash
cd deploy
docker compose up -d --build
docker compose ps
docker compose logs api --tail=100
docker compose logs web --tail=100
```

### 7. Confirm the app responds on the instance

```bash
curl http://127.0.0.1/
curl http://127.0.0.1/api/health
```

You want `/api/health` to return JSON with `ok: true`.

## ALB, HTTPS, and DNS

### 1. ACM certificate

In AWS Certificate Manager, request a public certificate for your domain, for example:

- `ew.example.com`

Use DNS validation.

### 2. Application Load Balancer

Create an internet-facing ALB with:

- listener 80 redirecting to 443
- listener 443 using the ACM certificate
- target group protocol HTTP, port 80
- health check path `/api/health`

Register the EC2 instance in that target group.

### 3. Route 53

Create an alias record:

- name: your desired subdomain
- target: the ALB DNS name

## If You Use RDS Instead of Docker Postgres

Do this instead of using the `postgres` container as your long-term database:

1. Create a PostgreSQL RDS instance.
2. Allow inbound PostgreSQL traffic from the EC2 security group.
3. Update `deploy/.env` with an RDS-backed `DATABASE_URL` flow by editing `deploy/docker-compose.yml` to point `api` to RDS and removing the `postgres` service.

If you want, I can make that repo change next.

## Security Notes

- Replace the JWT secret before production.
- Move secrets to AWS Secrets Manager or SSM Parameter Store once the first deployment works.
- Restrict the Cesium Ion token to your production domain.
- Do not expose admin-grade AI provider keys in the browser.
- Route AI provider traffic through the backend for production use.

GenAI.mil requests in the deployed app should now flow through the existing same-origin backend API (`/api/ai/genai-mil/models` and `/api/ai/genai-mil/chat/completions`). This avoids browser CORS and localhost proxy issues when using Chrome on the EC2-hosted site.

## Current Backend Scope

The backend currently provides:

- account registration
- account login
- session restore
- project listing
- project creation
- project update
- project deletion
- project duplication
- project snapshots

This is the minimum platform needed to replace browser-only local project storage.