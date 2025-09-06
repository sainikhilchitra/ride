pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'swiftride:latest'
        GITHUB_TOKEN = credentials('github-token') // token of your GitHub App installation
    }

    stages {
        stage('Run Tests in Docker') {
            steps {
                script {
                    // Run tests inside Docker and capture output
                    def testOutput = bat(script: """
                        docker run --rm ${DOCKER_IMAGE} npm test -- --reporters=default --reporters=jest-junit
                    """, returnStdout: true).trim()

                    // Print full test output
                    echo "==== Full Test Output ===="
                    echo testOutput

                    // Parse summary lines
                    def summaryLines = testOutput.split('\\r?\\n').findAll { 
                        it.contains('Test Suites') || it.contains('Tests:') || it.contains('Time:') 
                    }.join(' | ')

                    // Determine pass/fail
                    def passed = testOutput.contains('0 failed')
                    env.TEST_STATE = passed ? "success" : "failure"
                    env.TEST_DESC = passed ? "All tests passed" : "Some tests failed"
                    env.TEST_SUMMARY = summaryLines

                    echo "==== Test Summary ===="
                    echo summaryLines
                }
            }
        }

        stage('Post Status & Comment to GitHub PR') {
            when {
                expression { return env.CHANGE_ID != null }
            }
            steps {
                script {
                    def commitSHA = env.GIT_COMMIT
                    def prNumber = env.CHANGE_ID

                    // Post commit status
                    bat """
                    curl -H "Authorization: token ${GITHUB_TOKEN}" ^
                         -H "Accept: application/vnd.github.v3+json" ^
                         -X POST ^
                         -d "{\\"state\\": \\"${env.TEST_STATE}\\", \\"context\\": \\"Jenkins CI\\", \\"description\\": \\"${env.TEST_DESC}: ${env.TEST_SUMMARY}\\"}" ^
                         https://api.github.com/repos/sainikhilchitra/ride/statuses/${commitSHA}
                    """

                    // Post PR comment
                    bat """
                    curl -H "Authorization: token ${GITHUB_TOKEN}" ^
                         -H "Accept: application/vnd.github.v3+json" ^
                         -X POST ^
                         -d "{\\"body\\": \\"Jenkins Test Results:\\n${env.TEST_DESC}\\n${env.TEST_SUMMARY}\\"}" ^
                         https://api.github.com/repos/sainikhilchitra/ride/issues/${prNumber}/comments
                    """
                }
            }
        }
    }

    post {
        always {
            echo "Pipeline finished."
        }
        failure {
            echo "Pipeline finished with failures."
        }
        success {
            echo "Pipeline finished successfully."
        }
    }
}
