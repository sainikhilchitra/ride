pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'swiftride:latest'
        TEST_RESULTS_DIR = "${WORKSPACE}\\test-results"
        GITHUB_TOKEN = credentials('github-token') // set your GitHub token in Jenkins credentials
    }

    stages {
        stage('Prepare') {
            steps {
                script {
                    if (!fileExists(TEST_RESULTS_DIR)) {
                        bat "mkdir \"${TEST_RESULTS_DIR}\""
                    }
                }
            }
        }

        stage('Run Tests in Docker') {
            steps {
                script {
                    // Run tests and capture output
                    bat """
                    docker run --rm -v "${TEST_RESULTS_DIR}:/tests" ${DOCKER_IMAGE} npm test -- --reporters=default --reporters=jest-junit 1> "${TEST_RESULTS_DIR}\\test-output.txt" 2>&1
                    """
                }
            }
        }

        stage('Parse Test Summary') {
            steps {
                script {
                    def summaryFile = "${TEST_RESULTS_DIR}\\test-output.txt"
                    if (fileExists(summaryFile)) {
                        def summaryText = readFile(summaryFile)
                        echo "==== Test Output Summary ===="
                        echo summaryText.split('\\r?\\n').findAll { 
                            it.contains('Test Suites') || it.contains('Tests:') || it.contains('Time:')
                        }.join('\n')
                    } else {
                        echo "No test output found."
                    }
                }
            }
        }

        stage('Post Status to GitHub PR') {
            when {
                expression { return env.CHANGE_ID != null } // only for PR builds
            }
            steps {
                script {
                    def summaryFile = "${TEST_RESULTS_DIR}\\test-output.txt"
                    def summaryText = fileExists(summaryFile) ? readFile(summaryFile) : ""
                    def passed = summaryText.contains('0 failed')
                    def state = passed ? "success" : "failure"
                    def description = passed ? "All tests passed" : "Some tests failed"
                    def commitSHA = env.GIT_COMMIT

                    bat """
                    curl -H "Authorization: token ${GITHUB_TOKEN}" ^
                         -H "Accept: application/vnd.github.v3+json" ^
                         -X POST ^
                         -d "{\\"state\\": \\"${state}\\", \\"context\\": \\"Jenkins CI\\", \\"description\\": \\"${description}\\"}" ^
                         https://api.github.com/repos/sainikhilchitra/ride/statuses/${commitSHA}
                    """
                }
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'test-results/**', allowEmptyArchive: true
            echo "Test logs archived."
        }
        failure {
            echo "Pipeline finished with failures."
        }
        success {
            echo "Pipeline finished successfully."
        }
    }
}
