pipeline {
    agent any

    environment {
        ARTIFACT = "techlaunch-${BUILD_NUMBER}.zip"
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Checking out TechLaunch source code...'
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing Node.js dependencies...'

                bat '''
                    @echo off
                    node --version
                    npm --version
                    npm.cmd ci
                    if errorlevel 1 exit /b 1
                '''
            }
        }

        stage('Validate Application') {
            steps {
                echo 'Validating Node.js application syntax...'

                bat '''
                    @echo off

                    node --check app.js
                    if errorlevel 1 exit /b 1

                    node --check routes\\index.js
                    if errorlevel 1 exit /b 1

                    node --check routes\\api.js
                    if errorlevel 1 exit /b 1

                    node --check bin\\www
                    if errorlevel 1 exit /b 1

                    echo Application syntax validation PASSED.
                '''
            }
        }

        stage('Validate Pug Templates') {
            steps {
                echo 'Validating Pug templates...'

                bat '''
                    @echo off

                    node -e "const fs=require('fs'),pug=require('pug');fs.readdirSync('views').filter(f=>f.endsWith('.pug')).forEach(f=>{pug.compileFile('views/'+f);console.log('PASS: views/'+f)});console.log('Pug template validation PASSED.')"

                    if errorlevel 1 exit /b 1
                '''
            }
        }

        stage('Run Tests') {
            steps {
                echo 'Running TechLaunch automated tests...'

                bat '''
                    @echo off

                    npm.cmd test

                    if errorlevel 1 exit /b 1
                '''
            }
        }

        stage('Package Application') {
            steps {

                powershell '''
                    $ErrorActionPreference = "Stop"

                    $staging = Join-Path $env:WORKSPACE "deployment-staging"
                    $artifact = Join-Path $env:WORKSPACE $env:ARTIFACT

                    Write-Host "Creating clean deployment staging directory..."

                    if (Test-Path $staging) {
                        Remove-Item $staging -Recurse -Force
                    }

                    New-Item `
                        -ItemType Directory `
                        -Path $staging `
                        -Force |
                        Out-Null

                    Write-Host "Copying application files..."

                    & robocopy `
                        $env:WORKSPACE `
                        $staging `
                        /E `
                        /R:2 `
                        /W:1 `
                        /NFL `
                        /NDL `
                        /XD .git node_modules terraform deployment-staging `
                        /XF .env *.zip *.bak

                    if ($LASTEXITCODE -gt 7) {
                        throw "Robocopy failed with exit code $LASTEXITCODE"
                    }

                    Write-Host "Application files copied successfully."

                    Write-Host ""
                    Write-Host "=== CHECKING REQUIRED APPLICATION FILES ==="

                    $requiredFiles = @(
                        "package.json",
                        "package-lock.json",
                        "app.js",
                        "bin/www",
                        "routes/index.js",
                        "routes/api.js"
                    )

                    foreach ($file in $requiredFiles) {

                        $path = Join-Path $staging $file

                        if (-not (Test-Path $path -PathType Leaf)) {
                            throw "Missing required file: $file"
                        }

                        Write-Host "PASS: $file"
                    }

                    Write-Host "All required application files are present."

                    if (Test-Path $artifact) {
                        Remove-Item $artifact -Force
                    }

                    Write-Host ""
                    Write-Host "=== CREATING DEPLOYMENT ZIP ==="
                    Write-Host $artifact

                    Push-Location $staging

                    try {

                        & tar.exe -a -cf $artifact *

                        if ($LASTEXITCODE -ne 0) {
                            throw "Failed to create ZIP archive."
                        }

                    }
                    finally {
                        Pop-Location
                    }

                    if (-not (Test-Path $artifact -PathType Leaf)) {
                        throw "Deployment ZIP was not created."
                    }

                    Write-Host "PASS: Deployment ZIP created."

                    Write-Host ""
                    Write-Host "=== VERIFYING DEPLOYMENT ZIP ==="

                    $zipEntries = @(
                        & tar.exe -tf $artifact
                    )

                    if ($LASTEXITCODE -ne 0) {
                        throw "Unable to read deployment ZIP."
                    }

                    foreach ($requiredZip in @(
                        "package.json",
                        "package-lock.json",
                        "app.js",
                        "bin/www",
                        "routes/index.js",
                        "routes/api.js"
                    )) {

                        if ($zipEntries -notcontains $requiredZip) {
                            throw "Required file missing from ZIP: $requiredZip"
                        }

                        Write-Host "PASS ZIP: $requiredZip"
                    }

                    Write-Host ""
                    Write-Host "=== ARTIFACT INFORMATION ==="

                    Get-Item $artifact |
                        Select-Object Name, Length, FullName

                    Write-Host ""
                    Write-Host "Deployment artifact created successfully."
                '''

                archiveArtifacts artifacts: "${ARTIFACT}", fingerprint: true
            }
        }
    }

    post {

        success {
            echo "============================================================"
            echo "TECHLAUNCH CI SUCCESS"
            echo "============================================================"
            echo "Artifact published: ${ARTIFACT}"
        }

        failure {
            echo "============================================================"
            echo "TECHLAUNCH CI FAILED"
            echo "============================================================"
        }

        always {
            powershell '''
                if (Test-Path "deployment-staging") {
                    Remove-Item `
                        "deployment-staging" `
                        -Recurse `
                        -Force `
                        -ErrorAction SilentlyContinue
                }
            '''
        }
    }
}