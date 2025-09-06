pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "my-app:test"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                bat "docker build -t ${DOCKER_IMAGE} ."
            }
        }

        stage('Run Tests in Docker') {
            steps {
                bat '''
                if not exist test-results mkdir test-results
                docker run --rm -v "%cd%\\test-results:/tests" ${DOCKER_IMAGE} sh -c "npm test -- --testResultsProcessor=jest-junit --outputFile=/tests/results.xml"
                '''
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
            githubNotify(credentialsId: 'github-token', status: 'SUCCESS', context: 'CI/Jenkins', description: 'Build passed')
        }
        failure {
            githubNotify(credentialsId: 'github-token', status: 'FAILURE', context: 'CI/Jenkins', description: 'Build failed')
        }
    }
}
