pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "swiftride:latest"
        GITHUB_ACCOUNT = "sainikhilchitra"
        GITHUB_REPO = "ride"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                script {
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
                if (Jenkins.instance.getCredentials('github-token') != null) {
                    githubNotify(
                        account: "%GITHUB_ACCOUNT%",
                        repo: "%GITHUB_REPO%",
                        sha: "%GIT_COMMIT%",
                        credentialsId: 'github-token',
                        context: 'CI/Jenkins',
                        status: currentBuild.result == 'SUCCESS' ? 'SUCCESS' : 'FAILURE',
                        description: "Build ${currentBuild.result}"
                    )
                } else {
                    echo "GitHub credential 'github-token' not found. Skipping GitHub notify."
                }
            }
        }
    }
}
