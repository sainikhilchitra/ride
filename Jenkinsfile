pipeline {
    agent any

    environment {
        TEST_RESULTS = "test-results/test-output.txt"
        DOCKER_IMAGE = "swiftride:latest"
        REPO_OWNER = "sainikhilchitra"
        REPO_NAME = "ride"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Run Tests in Docker') {
            steps {
                script {
                    // Create test-results directory
                    bat "mkdir test-results"

                    // Run tests inside Docker and redirect output to file
                    bat """
                    docker run --rm -v "%CD%\\\\test-results:/tests" ${DOCKER_IMAGE} ^
                        npm test > /tests/test-output.txt 2>&1
                    """
                }
            }
        }

        stage('Parse Test Summary') {
            steps {
                script {
                    // Read test output
                    def output = readFile(TEST_RESULTS).readLines()

                    // Find the line with test summary
                    def summaryLine = output.find { it =~ /Tests:/ } ?: "No tests found"
                    echo "Test Summary: ${summaryLine}"

                    // Save for later to post to GitHub
                    env.TEST_SUMMARY = summaryLine
                }
            }
        }

        stage('Post Status to GitHub PR') {
            steps {
                withCredentials([string(credentialsId: 'github-token', variable: 'GITHUB_TOKEN')]) {
                    script {
                        // Get current commit SHA
                        def commitSha = sh(returnStdout: true, script: "git rev-parse HEAD").trim()

                        // Post GitHub status with test summary
                        bat """
                        curl -H "Authorization: token %GITHUB_TOKEN%" ^
                             -H "Accept: application/vnd.github.v3+json" ^
                             -X POST ^
                             -d "{\\"state\\": \\"success\\", \\"context\\": \\"Jenkins CI\\", \\"description\\": \\"${TEST_SUMMARY}\\"}" ^
                             https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/statuses/${commitSha}
                        """
                    }
                }
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: TEST_RESULTS, allowEmptyArchive: true
        }
    }
}
