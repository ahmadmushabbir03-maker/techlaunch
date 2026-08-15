pipeline {
    agent any

    environment {
        APP_NAME = 'techlaunch'
        ARTIFACT = "techlaunch-${BUILD_NUMBER}.zip"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Validate Application') {
            steps {
                sh 'node --check app.js'
                sh 'node --check routes/index.js'
                sh 'node --check routes/api.js'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test'
            }
        }

        stage('Package Application') {
            steps {
                sh '''
                    rm -f "${ARTIFACT}"
                    zip -r "${ARTIFACT}" . \
                      -x ".git/*" \
                      -x ".env" \
                      -x "node_modules/*" \
                      -x "*.zip" \
                      -x "terraform/.terraform/*" \
                      -x "terraform/*.tfstate*" \
                      -x "terraform/*.tfplan"
                '''

                archiveArtifacts artifacts: "${ARTIFACT}", fingerprint: true
            }
        }
    }

    post {
        success {
            echo "TECHLAUNCH CI SUCCESS"
            echo "Artifact published: ${ARTIFACT}"
        }

        failure {
            echo "TECHLAUNCH CI FAILED"
        }

        always {
            sh 'rm -f *.zip || true'
        }
    }
}
