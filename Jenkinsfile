pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "swiftride:latest"
        GITHUB_ACCOUNT = "sainikhilchitra"  // username/org
        GITHUB_REPO = "ride"               // repo name only
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    // Use 'bat' on Windows to get commit SHA
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
                bat """
                if not exist test-results mkdir test-results
                docker run --rm -v "%cd%\\\\test-results:/tests" %DOCKER_IMAGE% sh -c "npm test -- --testResultsProcessor=jest-junit --outputFile=/tests/results.xml"
                """
            }
        }

        stage('Publish Test Results') {
            steps {
                junit 'test-results/results.xml'
            }
        }
    }

    post {
        success {
            githubNotify(
                account: "%GITHUB_ACCOUNT%",
                repo: "%GITHUB_REPO%",
                sha: "%GIT_COMMIT%",
                credentialsId: 'github-token',
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
