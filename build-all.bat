@echo off
echo 🚀 Building GELIS DELIVERY Apps for Production...

REM Build Customer App
echo 📱 Building Customer App...
cd customer-app
npm run build
if errorlevel 1 (
    echo Failed to build Customer App
    exit /b 1
)
cd ..

REM Build Partner App
echo 🏪 Building Partner App...
cd partner-app
npm run build
if errorlevel 1 (
    echo Failed to build Partner App
    exit /b 1
)
cd ..

REM Build Driver App
echo 🚚 Building Driver App...
cd driver-app
npm run build
if errorlevel 1 (
    echo Failed to build Driver App
    exit /b 1
)
cd ..

REM Build Admin Panel
echo 👨‍💼 Building Admin Panel...
cd admin-panel
npm run build
if errorlevel 1 (
    echo Failed to build Admin Panel
    exit /b 1
)
cd ..

echo ✅ All apps built successfully!

REM Create deployment structure
echo 📁 Creating deployment structure...
mkdir -p dist\customer dist\partner dist\driver dist\admin

REM Copy build files
xcopy /E /I customer-app\dist\* dist\customer\
xcopy /E /I partner-app\dist\* dist\partner\
xcopy /E /I driver-app\dist\* dist\driver\
xcopy /E /I admin-panel\dist\* dist\admin\

echo 🎉 Build complete! Check /dist folder for deployment files.
pause