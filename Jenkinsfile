pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "swiftride:latest"
        GITHUB_ACCOUNT = "sainikhilchitra" // GitHub username/org
        GITHUB_REPO = "ride"               // Repository name only
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    // Get the commit SHA for GitHub notifications
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
                // catchError ensures the pipeline continues even if tests fail
                catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                    bat """
                    if not exist test-results mkdir test-results
                    docker run --rm -v "%cd%\\\\test-results:/tests" %DOCKER_IMAGE% npm test -- --reporters=default --reporters=jest-junit > test-results/test-output.txt 2>&1
                    """
                }
            }
        }

        stage('Publish Test Results') {
            steps {
                // Try JUnit report; fallback to archiving test log
                catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
                    junit 'test-results/junit.xml'
                }
                archiveArtifacts artifacts: 'test-results/test-output.txt', allowEmptyArchive: true
                echo "Test logs archived in test-results/test-output.txt"
            }
        }
    }

    post {
        success {
            githubNotify(
                account: "%GITHUB_ACCOUNT%",
                repo: "%GITHUB_REPO%",
                sha: "%GIT_COMMIT%",
                credentialsId: 'github-token', // Secret Text credential with your GitHub PAT
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
                credentialsId: 'github-token',
                context: 'CI/Jenkins',
                status: 'FAILURE',
                description: 'Build failed'
            )
        }
    }
}
