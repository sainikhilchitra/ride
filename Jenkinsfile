pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "swiftride:latest"
        GITHUB_REPO = "sainikhilchitra/ride"   // owner/repo format
        GITHUB_TOKEN = credentials('github-token')  // GitHub PAT stored in Jenkins credentials
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    // Get the commit SHA
                    env.GIT_COMMIT = bat(script: 'git rev-parse HEAD', returnStdout: true).trim()
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                bat "docker build -t %DOCKER_IMAGE% ."
            }
        }

        stage('Run Tests in Docker') {
            steps {
                catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                    bat """
                    if not exist test-results mkdir test-results
                    docker run --rm -v "%cd%\\\\test-results:/tests" %DOCKER_IMAGE% npm test > test-results/test-output.txt 2>&1
                    """
                }
            }
        }

        stage('Archive Test Logs') {
            steps {
                archiveArtifacts artifacts: 'test-results/test-output.txt', allowEmptyArchive: true
                echo "Test logs archived in test-results/test-output.txt"
            }
        }
    }

    post {
        always {
            script {
                // Determine status for GitHub API
                def status = currentBuild.result == 'SUCCESS' ? 'success' : 'failure'
                def description = currentBuild.result == 'SUCCESS' ? 'Build passed' : 'Build failed'

                // Use curl to post commit status
                bat """
                curl -H "Authorization: token %GITHUB_TOKEN%" ^
                     -H "Accept: application/vnd.github.v3+json" ^
                     -X POST ^
                     -d "{\\"state\\": \\"${status}\\", \\"context\\": \\"Jenkins CI\\", \\"description\\": \\"${description}\\"}" ^
                     https://api.github.com/repos/%GITHUB_REPO%/statuses/%GIT_COMMIT%
                """
            }
        }
    }
}
