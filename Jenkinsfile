pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test -- --watchAll=false'
            }
        }

        stage('Docker Build & Push') {
            steps {
                withDockerRegistry([ credentialsId: 'dockerhub-creds', url: '' ]) {
                    sh 'docker build -t your-dockerhub-username/swiftride:latest .'
                    sh 'docker push your-dockerhub-username/swiftride:latest'
                }
            }
        }
    }
}
