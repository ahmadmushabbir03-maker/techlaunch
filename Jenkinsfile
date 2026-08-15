pipeline {
    agent any

    environment {
        APP_NAME = 'techlaunch'
        ARTIFACT = "techlaunch-${BUILD_NUMBER}.zip"
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Checking out TechLaunch from GitHub...'
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing Node.js dependencies...'
                bat 'npm.cmd ci'
            }
        }

        stage('Validate Application') {
            steps {
                echo 'Validating Node.js application syntax...'

                bat 'node --check app.js'
                bat 'node --check routes/index.js'
                bat 'node --check routes/api.js'
            }
        }

        stage('Run Tests') {
            steps {
                echo 'Running TechLaunch automated tests...'
                bat 'npm.cmd test'
            }
        }

        stage('Package Application') {
            steps {
                echo 'Creating deployment artifact...'

                bat '''
                    if exist "%ARTIFACT%" del /f /q "%ARTIFACT%"

                    powershell -NoProfile -ExecutionPolicy Bypass -Command ^
                      "Compress-Archive -Path app.js,bin,models,public,routes,scripts,views,package.json,package-lock.json,.env.example,TECHLAUNCH.md,Jenkinsfile,Jenkinsfile.CD,docs,test -DestinationPath '%ARTIFACT%' -Force"
                '''

                archiveArtifacts artifacts: "${ARTIFACT}", fingerprint: true
            }
        }
    }

    post {

        success {
            echo '============================================================'
            echo 'TECHLAUNCH CI SUCCESS'
            echo '============================================================'
            echo "Artifact published: ${ARTIFACT}"
        }

        failure {
            echo '============================================================'
            echo 'TECHLAUNCH CI FAILED'
            echo '============================================================'
        }

        always {
            bat 'if exist "%ARTIFACT%" del /f /q "%ARTIFACT%"'
        }
    }
}