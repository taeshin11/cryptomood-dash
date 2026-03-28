# Adsterra Ad Integration Setup

## Step 1: Sign Up for Adsterra

1. Go to [https://www.adsterra.com](https://www.adsterra.com)
2. Click **Sign Up** and choose **Publisher**
3. Fill in your details and submit
4. Add your site URL (e.g., `https://cryptomood-dash.vercel.app`)
5. Wait for approval — usually under 24 hours for crypto-related sites

## Step 2: Create Ad Units

Once approved, create the following ad units from your Adsterra dashboard:

### Banner Ad (Top of Page)
1. Go to **Dashboard > Ad Units > Create**
2. Choose **Banner** format
3. Size: **728x90** (responsive — becomes 320x50 on mobile)
4. Copy the script tag and data-key

### Native Banner (Between Sections)
1. Create another ad unit
2. Choose **Native Banner** format
3. Copy the script tag and data-key

### Social Bar (Optional)
1. Create another ad unit
2. Choose **Social Bar** format (Adsterra specialty, high CPM for crypto)
3. Copy the script tag

## Step 3: Add Ad Codes to the Dashboard

### Top Banner
In `index.html`, find the section with id `ad-top-banner` and replace the placeholder div with your Adsterra script:

```html
<div id="ad-top-banner" class="w-full flex justify-center py-2 ad-slot">
    <!-- Paste your Adsterra Banner script here -->
    <script async="async" data-cfasync="false" src="//pl_________.profitablegatecpm.com/YOUR_KEY/invoke.js"></script>
    <div id="container-YOUR_KEY"></div>
</div>
```

### Native Banner
In `index.html`, find the section with id `ad-native-banner` and replace similarly.

### Social Bar
Add the Social Bar script just before the closing `</body>` tag.

## Tips

- Adsterra crypto site CPMs are typically $2-5 for banner, $5-15 for social bar
- Social Bar performs best but can be intrusive — test with your audience
- Don't place more than 3 ad units per page to maintain user experience
- Adsterra pays via PayPal, Bitcoin, WebMoney, and wire transfer (minimum $5 for crypto payout)
