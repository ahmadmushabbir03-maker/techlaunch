pipeline {
    agent any

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
                    node -v
                    npm -v
                    npm ci
                '''
            }
        }

        stage('Validate Application') {
            steps {
                echo 'Validating Node.js application syntax...'

                bat '''
                    node -c app.js
                    echo Application syntax validation PASSED.
                '''
            }
        }

        stage('Validate Pug Templates') {
            steps {
                echo 'Validating Pug templates...'

                bat '''
                    node -e "const fs=require('fs'),pug=require('pug'); fs.readdirSync('views').filter(f=>f.endsWith('.pug')).forEach(f=>{pug.compileFile('views/'+f); console.log('PASS: views/'+f);}); console.log('Pug template validation PASSED.');"
                '''
            }
        }

        stage('Run Tests') {
            steps {
                echo 'Running TechLaunch automated tests...'

                bat '''
                    npm test
                '''
            }
        }

        stage('Package Application') {
            steps {

                powershell '''
                    $ErrorActionPreference = "Stop"

                    Write-Host "Creating clean deployment staging directory..."

                    if (Test-Path "deployment-staging") {
                        Remove-Item `
                            -Path "deployment-staging" `
                            -Recurse `
                            -Force
                    }

                    New-Item `
                        -ItemType Directory `
                        -Path "deployment-staging" `
                        -Force |
                        Out-Null

                    Write-Host "Copying application files..."

                    robocopy . deployment-staging /S /E `
                        /XF .env *.zip *.bak `
                        /XD .git node_modules terraform deployment-staging

                    if ($LASTEXITCODE -ge 8) {
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

                        $path = Join-Path "deployment-staging" $file

                        if (-not (Test-Path $path -PathType Leaf)) {
                            throw "Missing required file: $file"
                        }

                        Write-Host "PASS: $file"
                    }

                    Write-Host ""
                    Write-Host "All required application files are present."

                    Write-Host ""
                    Write-Host "=== CREATING DEPLOYMENT ZIP ==="

                    $zipName = "techlaunch-$env:BUILD_NUMBER.zip"

                    Write-Host $zipName

                    tar -a -cf $zipName -C deployment-staging .

                    if ($LASTEXITCODE -ne 0) {
                        throw "Failed to create ZIP archive."
                    }

                    if (-not (Test-Path $zipName -PathType Leaf)) {
                        throw "Deployment ZIP was not created."
                    }

                    Write-Host ""
                    Write-Host "Deployment ZIP created successfully."
                    Write-Host "Artifact: $zipName"
                '''

                archiveArtifacts artifacts: "techlaunch-${env.BUILD_NUMBER}.zip",
                                 fingerprint: true
            }
        }
    }

    post {

        success {
            echo "============================================================"
            echo "TECHLAUNCH CI SUCCESS"
            echo "============================================================"

            echo "CI build completed: ${env.BUILD_NUMBER}"
            echo "Triggering TechLaunch-CD automatically..."

            build job: 'TechLaunch-CD',
                  parameters: [
                      string(
                          name: 'CI_BUILD_NUMBER',
                          value: "${env.BUILD_NUMBER}"
                      )
                  ],
                  wait: false,
                  propagate: false

            echo "TechLaunch-CD triggered automatically."
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