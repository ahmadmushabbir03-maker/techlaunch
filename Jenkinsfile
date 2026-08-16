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

                    node -e "const pug=require('pug'); const fs=require('fs'); const files=['views/index.pug','views/career.pug','views/projects.pug','views/badges.pug','views/architecture.pug','views/pricing.pug']; for (const f of files) { pug.compileFile(f); console.log('PASS: '+f); }"

                    if errorlevel 1 exit /b 1

                    echo Pug template validation PASSED.
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

                    echo TechLaunch automated tests PASSED.
                '''
            }
        }

        stage('Package Application') {
            steps {

                powershell '''
                    $ErrorActionPreference = "Stop"

                    Write-Host "Creating clean deployment staging directory..."

                    $staging = Join-Path $env:WORKSPACE "deployment-staging"

                    if (Test-Path $staging) {
                        Remove-Item $staging -Recurse -Force
                    }

                    New-Item `
                        -ItemType Directory `
                        -Path $staging `
                        -Force |
                        Out-Null

                    Write-Host "Copying application files..."

                    $excludeDirectories = @(
                        ".git",
                        "node_modules",
                        "terraform",
                        "deployment-staging"
                    )

                    $excludeFiles = @(
                        "*.zip",
                        ".env",
                        "Jenkinsfile.backup"
                    )

                    Get-ChildItem `
                        -Path $env:WORKSPACE `
                        -Force |
                        Where-Object {
                            $_.Name -notin $excludeDirectories
                        } |
                        Where-Object {
                            $skip = $false

                            foreach ($pattern in $excludeFiles) {
                                if ($_.Name -like $pattern) {
                                    $skip = $true
                                }
                            }

                            -not $skip
                        } |
                        ForEach-Object {

                            Copy-Item `
                                -Path $_.FullName `
                                -Destination $staging `
                                -Recurse `
                                -Force
                        }

                    Write-Host ""
                    Write-Host "Installing production dependencies into staging..."

                    Push-Location $staging

                    npm.cmd ci --omit=dev

                    if ($LASTEXITCODE -ne 0) {
                        throw "npm ci --omit=dev failed."
                    }

                    Pop-Location

                    $artifact = Join-Path $env:WORKSPACE $env:ARTIFACT

                    if (Test-Path $artifact) {
                        Remove-Item $artifact -Force
                    }

                    Write-Host ""
                    Write-Host "Creating deployment artifact:"
                    Write-Host $artifact

                    Compress-Archive `
                        -Path (Join-Path $staging "*") `
                        -DestinationPath $artifact `
                        -CompressionLevel Optimal `
                        -Force

                    Write-Host ""
                    Write-Host "Verifying deployment artifact..."

                    $archive = [System.IO.Compression.ZipFile]::OpenRead($artifact)

                    $entries = @(
                        $archive.Entries |
                        Select-Object -ExpandProperty FullName
                    )

                    Write-Host ""
                    Write-Host "=== FIRST ARTIFACT ENTRIES ==="

                    $entries |
                        Select-Object -First 40 |
                        ForEach-Object {
                            Write-Host $_
                        }

                    Write-Host ""
                    Write-Host "=== CHECKING FOR NESTED ZIP ==="

                    $nestedZip = $entries |
                        Where-Object {
                            $_ -like "*.zip" -and
                            $_ -ne $env:ARTIFACT
                        }

                    if ($nestedZip) {
                        $archive.Dispose()
                        throw "ERROR: Nested ZIP detected inside deployment artifact."
                    }

                    Write-Host "PASS: No nested ZIP found."

                    Write-Host ""
                    Write-Host "=== CHECKING REQUIRED APPLICATION FILES ==="

                    $requiredFiles = @("package.json","package-lock.json","app.js","bin/www","routes/index.js","routes/api.js")

                    foreach ($required in $requiredFiles) {
                        $requiredPath = Join-Path $staging $required

                        if (-not (Test-Path $requiredPath -PathType Leaf)) {
                            throw "Required file missing from deployment staging: $required"
                        }

                        Write-Host "PASS: $required"
                    }

                    Write-Host ""
                    Write-Host "All required application files are present in deployment staging."

                    $archive.Dispose()

                    Write-Host "=== ARTIFACT INFORMATION ==="

                    Get-Item $artifact |
                        Select-Object Name,Length,FullName

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


