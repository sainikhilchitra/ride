pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "swiftride:latest"
        GITHUB_TOKEN = credentials('github-token')  // Jenkins credential with your GitHub token
        REPO_OWNER   = "sainikhilchitra"
        REPO_NAME    = "ride"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                bat "docker build -t %DOCKER_IMAGE% ."
            }
        }

        stage('Run Tests in Docker') {
            steps {
                bat """
                if not exist test-results mkdir test-results
                docker run --rm -v "%cd%\\\\test-results:/tests" %DOCKER_IMAGE% npm test -- --reporters=default 1>test-results/test-output.txt 2>&1
                """
                
                script {
                    // Extract test summary from test-output.txt
                    def summary = bat(script: 'findstr /R /C:"Tests:.*" test-results\\test-output.txt', returnStdout: true).trim()
                    if(summary == "") {
                        summary = "No test summary found."
                    }
                    env.TEST_SUMMARY = summary
                    echo "Test Summary: ${env.TEST_SUMMARY}"
                }
            }
        }

        stage('Archive Test Logs') {
            steps {
                archiveArtifacts artifacts: 'test-results/test-output.txt', fingerprint: true
                echo "Test logs archived at test-results/test-output.txt"
            }
        }

        stage('Post GitHub PR Comment') {
            when {
                expression { return env.CHANGE_ID != null } // Only run if this is a PR
            }
            steps {
                script {
                    echo "Posting test summary to GitHub PR #${env.CHANGE_ID}"

                    bat """
                    curl -H "Authorization: token %GITHUB_TOKEN%" ^
                         -H "Accept: application/vnd.github.v3+json" ^
                         -X POST ^
                         -d "{\\"body\\": \\"Jenkins Test Results: ${env.TEST_SUMMARY}\\"}" ^
                         https://api.github.com/repos/%REPO_OWNER%/%REPO_NAME%/issues/%CHANGE_ID%/comments
                    """
                }
            }
        }
    }

    post {
        always {
            echo "Pipeline finished. Test logs archived."
        }
    }
}
