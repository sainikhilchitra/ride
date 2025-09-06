pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "swiftride:latest"
        GITHUB_ACCOUNT = "sainikhilchitra"  // GitHub username/org
        GITHUB_REPO = "ride"               // Repository name only
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    // Get the current commit SHA for GitHub notifications
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
                // Use catchError so that even if some tests fail, Jenkins continues to publish results
                catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                    bat """
                    if not exist test-results mkdir test-results
                    docker run --rm -v "%cd%\\\\test-results:/tests" %DOCKER_IMAGE% npm test -- --reporters=default --reporters=jest-junit
                    """
                }
            }
        }

        stage('Publish Test Results') {
            steps {
                // Make sure this matches the output file of jest-junit
                junit allowEmptyResults: true, testResults: 'test-results/junit.xml'
            }
        }
    }

    post {
        success {
            githubNotify(
                account: "%GITHUB_ACCOUNT%",
                repo: "%GITHUB_REPO%",
                sha: "%GIT_COMMIT%",
                credentialsId: 'github-token',  // Secret Text credential with your GitHub PAT
                context: 'CI/Jenkins',
                status: 'SUCCESS',
                description: 'Build passed'
            )
        }
        failure {
            githubNotify(
                account: "%GITHUB_ACCOUNT%",
                repo: "%GITHUB_REPO%",
                sha: "%GIT_COMMIT%",
                credentialsId: 'github-token',  // Secret Text credential with your GitHub PAT
                context: 'CI/Jenkins',
                status: 'FAILURE',
                description: 'Build failed'
            )
        }
    }
}
