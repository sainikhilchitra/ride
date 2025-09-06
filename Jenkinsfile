pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'swiftride:latest'
        GITHUB_TOKEN = credentials('github-token') // GitHub App token
    }

    stages {

        stage('Run Tests in Docker') {
            steps {
                script {
                    echo "==== Running Tests in Docker ===="
                    // Run tests live, output directly to console
                    bat """
                        docker run --rm -v "${WORKSPACE}/test-results:/tests" ${DOCKER_IMAGE} sh -c "npm test -- --reporters=default --reporters=jest-junit | tee /tests/test-output.txt"
                    """
                    echo "==== Test Execution Complete ===="
                }
            }
        }

        stage('Parse Test Summary') {
            steps {
                script {
                    def summaryFile = "${WORKSPACE}/test-results/test-output.txt"

                    if (!fileExists(summaryFile)) {
                        error "Test output file not found!"
                    }

                    def testOutput = readFile(summaryFile)

                    // Parse key summary lines
                    def summaryLines = testOutput.split('\\r?\\n').findAll { 
                        it.contains('Test Suites') || it.contains('Tests:') || it.contains('Time:')
                    }.join(' | ')

                    // Determine pass/fail
                    def passed = testOutput.contains('0 failed')
                    env.TEST_STATE = passed ? "success" : "failure"
                    env.TEST_DESC = passed ? "✅ All tests passed" : "❌ Some tests failed"
                    env.TEST_SUMMARY = summaryLines

                    // Print developer-friendly summary to console
                    echo "==== Test Summary ===="
                    echo env.TEST_DESC
                    echo summaryLines
                }
            }
        }

        stage('Post Status & PR Comment to GitHub') {
            when {
                expression { return env.CHANGE_ID != null } // Only for PRs
            }
            steps {
                script {
                    def commitSHA = env.GIT_COMMIT
                    def prNumber = env.CHANGE_ID

                    echo "Posting commit status to GitHub..."
                    bat """
                    curl -H "Authorization: token ${GITHUB_TOKEN}" ^
                         -H "Accept: application/vnd.github.v3+json" ^
                         -X POST ^
                         -d "{\\"state\\": \\"${env.TEST_STATE}\\", \\"context\\": \\"Jenkins CI\\", \\"description\\": \\"${env.TEST_DESC}: ${env.TEST_SUMMARY}\\"}" ^
                         https://api.github.com/repos/sainikhilchitra/ride/statuses/${commitSHA}
                    """

                    echo "Posting comment to PR #${prNumber}..."
                    // Markdown formatted comment
                    def prComment = """
**Jenkins Test Results**  

${env.TEST_DESC}  

**Summary:**  
\`\`\`
${env.TEST_SUMMARY}
\`\`\`
"""
                    bat """
                    curl -H "Authorization: token ${GITHUB_TOKEN}" ^
                         -H "Accept: application/vnd.github.v3+json" ^
                         -X POST ^
                         -d "{\\"body\\": \\"${prComment.replaceAll('"', '\\"')}\\"}" ^
                         https://api.github.com/repos/sainikhilchitra/ride/issues/${prNumber}/comments
                    """
                }
            }
        }

    }

    post {
        always {
            echo "Pipeline finished. Check console output and PR for results."
        }
        failure {
            echo "Pipeline finished with failures."
        }
        success {
            echo "Pipeline finished successfully."
        }
    }
}
