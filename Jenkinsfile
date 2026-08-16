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

                    Write-Host "Creating clean deployment staging directory..."

                    $workspace = $env:WORKSPACE
                    $staging = Join-Path $workspace "deployment-staging"
                    $artifact = Join-Path $workspace $env:ARTIFACT

                    if (Test-Path $staging) {
                        Remove-Item $staging -Recurse -Force
                    }

                    if (Test-Path $artifact) {
                        Remove-Item $artifact -Force
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
                        "Jenkinsfile.backup",
                        "Jenkinsfile.CD.backup",
                        "Jenkinsfile.before-artifact-fix.bak"
                    )

                    Get-ChildItem `
                        -Path $workspace `
                        -Force |
                        Where-Object {
                            $_.Name -notin $excludeDirectories
                        } |
                        Where-Object {

                            $skip = $false

                            foreach ($pattern in $excludeFiles) {
                                if ($_.Name -like $pattern) {
                                    $skip = $true
                                    break
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
                    Write-Host "=== CHECKING REQUIRED APPLICATION FILES ==="

                    $requiredFiles = @(
                        "package.json",
                        "package-lock.json",
                        "app.js",
                        "bin/www",
                        "routes/index.js",
                        "routes/api.js"
                    )

                    foreach ($required in $requiredFiles) {

                        $requiredPath = Join-Path `
                            $staging `
                            $required.Replace("/", "\")

                        if (-not (Test-Path $requiredPath -PathType Leaf)) {
                            throw "Required file missing from deployment staging: $required"
                        }

                        Write-Host "PASS: $required"
                    }

                    Write-Host ""
                    Write-Host "Creating Linux-compatible ZIP..."

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
                            $relativePath = $relativePath.TrimStart([char]92).TrimStart([char]47)
                            )

                            $zipPath = $relativePath.Replace(
                                "\",
                                "/"
                            )

                            Write-Host "Adding: $zipPath"

                            $entry = $zip.CreateEntry(
                                $zipPath,
                                [System.IO.Compression.CompressionLevel]::Optimal
                            )

                            $inputStream = [System.IO.File]::OpenRead(
                                $file.FullName
                            )

                            try {

                                $outputStream = $entry.Open()

                                try {
                                    $inputStream.CopyTo($outputStream)
                                }
                                finally {
                                    $outputStream.Dispose()
                                }

                            }
                            finally {
                                $inputStream.Dispose()
                            }
                        }

                    }
                    finally {
                        $zip.Dispose()
                    }

                    Write-Host ""
                    Write-Host "=== VERIFYING ZIP ==="

                    $archive = [System.IO.Compression.ZipFile]::OpenRead(
                        $artifact
                    )

                    try {

                        $entries = @(
                            $archive.Entries |
                            Select-Object -ExpandProperty FullName
                        )

                        Write-Host "ZIP entries: $($entries.Count)"

                        Write-Host ""
                        Write-Host "=== FIRST 40 ENTRIES ==="

                        $entries |
                            Select-Object -First 40 |
                            ForEach-Object {
                                Write-Host $_
                            }

                        Write-Host ""
                        Write-Host "=== CHECKING PATH SEPARATORS ==="

                        $badPaths = @(
                            $entries |
                            Where-Object {
                                $_ -match "\\"
                            }
                        )

                        if ($badPaths.Count -gt 0) {

                            Write-Host "ERROR: Backslash paths found:"

                            $badPaths |
                                Select-Object -First 20 |
                                ForEach-Object {
                                    Write-Host $_
                                }

                            throw "ZIP contains Windows backslash paths."
                        }

                        Write-Host "PASS: ZIP paths use forward slashes."

                        Write-Host ""
                        Write-Host "=== CHECKING NESTED ZIP ==="

                        $nestedZip = @(
                            $entries |
                            Where-Object {
                                $_ -like "*.zip"
                            }
                        )

                        if ($nestedZip.Count -gt 0) {
                            throw "Nested ZIP detected inside artifact."
                        }

                        Write-Host "PASS: No nested ZIP."

                        Write-Host ""
                        Write-Host "=== CHECKING REQUIRED ZIP FILES ==="

                        foreach ($required in $requiredFiles) {

                            $zipRequired = $required.Replace(
                                "\",
                                "/"
                            )

                            $found = $entries |
                                Where-Object {
                                    $_.ToLowerInvariant() -eq
                                    $zipRequired.ToLowerInvariant()
                                }

                            if (-not $found) {
                                throw "Required file missing from ZIP: $required"
                            }

                            Write-Host "PASS: $required"
                        }

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
                $staging = Join-Path $env:WORKSPACE "deployment-staging"

                if (Test-Path $staging) {
                    Remove-Item `
                        $staging `
                        -Recurse `
                        -Force `
                        -ErrorAction SilentlyContinue
                }
            '''
        }
    }
}
