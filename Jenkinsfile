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

                    node -e "const pug=require('pug'); const files=['views/index.pug','views/career.pug','views/projects.pug','views/badges.pug','views/architecture.pug','views/pricing.pug']; for (const f of files) { pug.compileFile(f); console.log('PASS: '+f); }"

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

                    $staging = Join-Path $env:WORKSPACE "deployment-staging"
                    $artifact = Join-Path $env:WORKSPACE $env:ARTIFACT

                    Write-Host "Creating clean deployment staging directory..."

                    if (Test-Path $staging) {
                        Remove-Item $staging -Recurse -Force
                    }

                    New-Item -ItemType Directory -Path $staging -Force | Out-Null

                    Write-Host "Copying application files..."

                    $robocopyArgs = @(
                        $env:WORKSPACE,
                        $staging,
                        "/E",
                        "/R:2",
                        "/W:1",
                        "/NFL",
                        "/NDL",
                        "/XD",
                        ".git",
                        "node_modules",
                        "terraform",
                        "deployment-staging",
                        "/XF",
                        "*.zip",
                        ".env",
                        "*.bak"
                    )

                    & robocopy @robocopyArgs

                    $robocopyExit = $LASTEXITCODE

                    if ($robocopyExit -gt 7) {
                        throw "robocopy failed with exit code $robocopyExit"
                    }

                    Write-Host "Application files copied successfully."

                    Write-Host ""
                    Write-Host "=== CHECKING REQUIRED APPLICATION FILES ==="

                    $requiredFiles = @(
                        "package.json",
                        "package-lock.json",
                        "app.js",
                        "bin\www",
                        "routes\index.js",
                        "routes\api.js"
                    )

                    foreach ($required in $requiredFiles) {

                        $requiredPath = Join-Path $staging $required

                        if (-not (Test-Path $requiredPath -PathType Leaf)) {
                            throw "Required file missing from deployment staging: $required"
                        }

                        Write-Host "PASS: $required"
                    }

                    Write-Host ""
                    Write-Host "All required application files are present."

                    if (Test-Path $artifact) {
                        Remove-Item $artifact -Force
                    }

                    Write-Host ""
                    Write-Host "=== CREATING DEPLOYMENT ZIP ==="
                    Write-Host $artifact

                    Add-Type -AssemblyName System.IO.Compression

                    $zip = [System.IO.Compression.ZipFile]::Open(
                        $artifact,
                        [System.IO.Compression.ZipArchiveMode]::Create
                    )

                    try {

                        $files = Get-ChildItem `
                            -Path $staging `
                            -Recurse `
                            -File

                        foreach ($file in $files) {

                            $relativePath = $file.FullName.Substring(
                                $staging.Length
                            )

                            $relativePath = $relativePath.TrimStart(
                                [char[]](92,47)
                            )

                            $relativePath = $relativePath.Replace(
                                [string][char]92,
                                [string][char]47
                            )

                            [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile(
                                $zip,
                                $file.FullName,
                                $relativePath,
                                [System.IO.Compression.CompressionLevel]::Optimal
                            ) | Out-Null
                        }

                    }
                    finally {
                        $zip.Dispose()
                    }

                    Write-Host ""
                    Write-Host "=== VERIFYING DEPLOYMENT ZIP ==="

                    $archive = [System.IO.Compression.ZipFile]::OpenRead(
                        $artifact
                    )

                    try {

                        $entries = @(
                            $archive.Entries |
                            Select-Object -ExpandProperty FullName
                        )

                        Write-Host "ZIP entries: $($entries.Count)"

                        $requiredZipFiles = @(
                            "package.json",
                            "package-lock.json",
                            "app.js",
                            "bin/www",
                            "routes/index.js",
                            "routes/api.js"
                        )

                        foreach ($requiredZip in $requiredZipFiles) {

                            if ($entries -notcontains $requiredZip) {
                                throw "Required file missing from ZIP: $requiredZip"
                            }

                            Write-Host "PASS ZIP: $requiredZip"
                        }

                        $nestedZip = @(
                            $entries |
                            Where-Object {
                                $_ -like "*.zip"
                            }
                        )

                        if ($nestedZip.Count -gt 0) {
                            throw "Nested ZIP detected inside deployment artifact."
                        }

                        Write-Host "PASS: No nested ZIP."

                    }
                    finally {
                        $archive.Dispose()
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