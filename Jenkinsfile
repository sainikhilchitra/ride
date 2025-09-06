pipeline {
    agent any

    environment {
        GITHUB_TOKEN = credentials('github-token') // GitHub App token or Personal Access Token
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm ci'
            }
        }

        stage('Run Tests') {
            steps {
                bat 'npm test'
            }
            post {
                success {
                    echo "All tests passed ✅"
                }
                failure {
                    error "Tests failed ❌"
                }
            }
        }

        stage('Merge to Main') {
            when {
                branch pattern: "PR-.*", comparator: "REGEXP" // Only run on PRs
            }
            steps {
                script {
                    echo "Merging PR to main since tests passed..."
                    bat """
                    git config user.name "Jenkins CI"
                    git config user.email "jenkins@ci.com"
                    git checkout main
                    git merge %BRANCH_NAME% --no-ff -m "Auto-merge PR %BRANCH_NAME% via Jenkins"
                    git push https://%GITHUB_TOKEN%@github.com/<username>/<repo>.git main
                    """
                }
            }
        }
    }

    post {
        always {
            echo "Pipeline finished."
        }
    }
}
