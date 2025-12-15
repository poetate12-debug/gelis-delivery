#!/bin/bash

echo "🚀 Building GELIS DELIVERY Apps for Production..."

# Build Customer App
echo "📱 Building Customer App..."
cd customer-app
npm run build
cd ..

# Build Partner App
echo "🏪 Building Partner App..."
cd partner-app
npm run build
cd ..

# Build Driver App
echo "🚚 Building Driver App..."
cd driver-app
npm run build
cd ..

# Build Admin Panel
echo "👨‍💼 Building Admin Panel..."
cd admin-panel
npm run build
cd ..

echo "✅ All apps built successfully!"

# Create deployment structure
echo "📁 Creating deployment structure..."
mkdir -p dist/customer dist/partner dist/driver dist/admin

# Copy build files
cp -r customer-app/dist/* dist/customer/
cp -r partner-app/dist/* dist/partner/
cp -r driver-app/dist/* dist/driver/
cp -r admin-panel/dist/* dist/admin/

# Create index files for subdirectories
echo "📄 Creating index files..."
cat > dist/customer/index.html << 'EOF'
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GELIS DELIVERY - Pesan Makanan Online</title>
    <meta name="description" content="Aplikasi pesan antar makanan online terpercaya">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="https://gelisdelivery.com/">
</head>
<body>
    <div id="root"></div>
    <script type="module" src="/assets/index.js"></script>
</body>
</html>
EOF

cat > dist/partner/index.html << 'EOF'
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GELIS DELIVERY - Dashboard Mitra</title>
    <meta name="description" content="Dashboard untuk mitra warung GELIS DELIVERY">
    <meta name="robots" content="noindex, nofollow">
</head>
<body>
    <div id="root"></div>
    <script type="module" src="/assets/index.js"></script>
</body>
</html>
EOF

cat > dist/driver/index.html << 'EOF'
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GELIS DELIVERY - Dashboard Driver</title>
    <meta name="description" content="Dashboard untuk driver GELIS DELIVERY">
    <meta name="robots" content="noindex, nofollow">
</head>
<body>
    <div id="root"></div>
    <script type="module" src="/assets/index.js"></script>
</body>
</html>
EOF

cat > dist/admin/index.html << 'EOF'
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GELIS DELIVERY - Admin Panel</title>
    <meta name="description" content="Panel admin untuk mengelola GELIS DELIVERY">
    <meta name="robots" content="noindex, nofollow">
</head>
<body>
    <div id="root"></div>
    <script type="module" src="/assets/index.js"></script>
</body>
</html>
EOF

echo "🎉 Build complete! Check /dist folder for deployment files."