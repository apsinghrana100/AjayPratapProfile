# How to Connect Vercel to Hostinger

Since you have your code ready and your domain on Hostinger, here is the professional way to connect them.

## Phase 1: Push Code to GitHub (Recommended)
As a developer, your portfolio should be on GitHub.
1. Create a new repository on [GitHub.com](https://github.com/new) named `portfolio`.
2. Open your terminal in VS Code (Ctrl+`) and run these commands:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   # Replace YOUR_USERNAME with your actual GitHub username
   git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
   git push -u origin main
   ```

## Phase 2: Deploy on Vercel
1. Go to [Vercel.com](https://vercel.com) and Sign Up using **GitHub**.
2. Click **"Add New..."** -> **"Project"**.
3. You will see your `portfolio` repository. Click **Import**.
4. Click **Deploy**.
   *   *Result:* Your site is now live at something like `portfolio-ajay.vercel.app`.

## Phase 3: Connect Your Hostinger Domain
1. In your **Vercel Dashboard**, go to your project.
2. Click **Settings** -> **Domains**.
3. Type your new domain (e.g., `ajaypratapsingh.com`) in the box and click **Add**.
4. Vercel will show you two "Nameservers" or an "A Record" configuration.
   *   **Recommended Method (Nameservers):**
       *   Vercel will give you: `ns1.vercel-dns.com` and `ns2.vercel-dns.com`.

## Phase 4: Configure Hostinger
1. Log in to **Hostinger**.
2. Go to **Domains** -> Manage your domain.
3. Look for **"Nameservers"** (usually on the left sidebar or dashboard).
4. Select **"Change Nameservers"**.
5. Change them from "Hostinger Nameservers" to **"Custom Nameservers"**.
6. Enter the Vercel values:
   *   `ns1.vercel-dns.com`
   *   `ns2.vercel-dns.com`
7. Click **Save**.

## Final Step
Wait! DNS changes can take anywhere from **1 hour to 24 hours** to propagate worldwide.
Once finished, when you go to `ajaypratapsingh.com`, it will show your Vercel (Portfolio) site with a secure HTTPS lock.
