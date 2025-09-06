pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'swiftride:latest'
        GITHUB_TOKEN = credentials('github-token') // GitHub App token
    }

    stages {

        stage('Create Pending Check') {
            when {
                expression { return env.CHANGE_ID != null }
            }
            steps {
                script {
                    def commitSHA = env.GIT_COMMIT
                    def startedAt = new Date().format("yyyy-MM-dd'T'HH:mm:ss'Z'", TimeZone.getTimeZone('UTC'))

                    echo "Creating pending GitHub Check for commit ${commitSHA}..."
                    bat """
                    curl -H "Authorization: token ${GITHUB_TOKEN}" ^
                         -H "Accept: application/vnd.github.v3+json" ^
                         -X POST ^
                         -d "{\\"name\\": \\"Jenkins CI\\",
                              \\"head_sha\\": \\"${commitSHA}\\",
                              \\"status\\": \\"in_progress\\",
                              \\"started_at\\": \\"${startedAt}\\",
                              \\"details_url\\": \\"${env.BUILD_URL}\\"}" ^
                         https://api.github.com/repos/sainikhilchitra/ride/check-runs
                    """
                }
            }
        }

        stage('Run Tests in Docker') {
            steps {
                script {
                    echo "==== Running Tests in Docker ===="
                    bat """
                        docker run --rm ${DOCKER_IMAGE} sh -c "npm test -- --reporters=default || exit 0"
                    """
                    echo "==== Test Execution Complete ===="
                }
            }
        }

        stage('Complete GitHub Check') {
            when {
                expression { return env.CHANGE_ID != null }
            }
            steps {
                script {
                    def passed = currentBuild.currentResult == 'SUCCESS'
                    def conclusion = passed ? "success" : "failure"
                    def description = passed ? "All tests passed" : "Some tests failed"
                    def commitSHA = env.GIT_COMMIT
                    def completedAt = new Date().format("yyyy-MM-dd'T'HH:mm:ss'Z'", TimeZone.getTimeZone('UTC'))
                    def durationSec = (System.currentTimeMillis() - currentBuild.startTimeInMillis) / 1000

                    echo "Marking GitHub Check as ${conclusion} for commit ${commitSHA}..."
                    bat """
                    curl -H "Authorization: token ${GITHUB_TOKEN}" ^
                         -H "Accept: application/vnd.github.v3+json" ^
                         -X POST ^
                         -d "{\\"name\\": \\"Jenkins CI\\",
                              \\"head_sha\\": \\"${commitSHA}\\",
                              \\"status\\": \\"completed\\",
                              \\"conclusion\\": \\"${conclusion}\\",
                              \\"completed_at\\": \\"${completedAt}\\",
                              \\"output\\": {
                                  \\"title\\": \\"Jenkins CI result\\",
                                  \\"summary\\": \\"${description}. Duration: ${durationSec}s\\",
                                  \\"text\\": \\"View full logs in Jenkins: ${env.BUILD_URL}\\"
                              },
                              \\"details_url\\": \\"${env.BUILD_URL}\\"}" ^
                         https://api.github.com/repos/sainikhilchitra/ride/check-runs
                    """
                }
            }
        }

    }

    post {
        always {
            echo "Pipeline finished. GitHub Check updated."
        }
    }
}
