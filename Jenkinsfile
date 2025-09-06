pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "swiftride:latest"
        GITHUB_TOKEN = credentials('github-token')
        REPO_OWNER   = "sainikhilchitra"
        REPO_NAME    = "ride"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    env.GIT_COMMIT = bat(script: 'git rev-parse HEAD', returnStdout: true).trim()
                    env.PR_NUMBER = env.CHANGE_ID
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
                docker run --rm -v "%cd%\\\\test-results:/tests" %DOCKER_IMAGE% npm test 1>test-results/test-output.txt 2>&1
                """
            }
        }

        stage('Archive Test Logs') {
            steps {
                archiveArtifacts artifacts: 'test-results/test-output.txt', fingerprint: true
            }
        }

        stage('Post PR Test Results') {
            steps {
                script {
                    if (env.PR_NUMBER) {
                        // Read test log
                        def testLog = readFile('test-results/test-output.txt')

                        // Parse test summary
                        def suiteMatch = testLog =~ /Test Suites: (\d+) failed, (\d+) passed, (\d+) total/
                        def testMatch = testLog =~ /Tests: +(\d+) failed, (\d+) passed, (\d+) total/
                        def failedTestsMatch = testLog =~ /● (.+)/
                        
                        def suitesFailed = suiteMatch ? suiteMatch[0][1] : "0"
                        def suitesPassed = suiteMatch ? suiteMatch[0][2] : "0"
                        def suitesTotal  = suiteMatch ? suiteMatch[0][3] : "0"
                        
                        def testsFailed = testMatch ? testMatch[0][1] : "0"
                        def testsPassed = testMatch ? testMatch[0][2] : "0"
                        def testsTotal  = testMatch ? testMatch[0][3] : "0"

                        def failedTests = failedTestsMatch.collect { it[1] }.join(", ")
                        if (!failedTests) { failedTests = "None" }

                        def state = testsFailed == "0" ? "success" : "failure"
                        def description = testsFailed == "0" ? "All tests passed" : "${testsFailed} tests failed"
                        def comment = """**Jenkins CI Test Result**
                        
- Test Suites: ${suitesPassed} passed, ${suitesFailed} failed, ${suitesTotal} total
- Tests: ${testsPassed} passed, ${testsFailed} failed, ${testsTotal} total
- Failed Tests: ${failedTests}

Full log: [test-output.txt](test-results/test-output.txt)
"""

                        // Post status
                        bat """
                        curl -H "Authorization: token %GITHUB_TOKEN%" ^
                             -H "Accept: application/vnd.github.v3+json" ^
                             -X POST ^
                             -d "{\\"state\\": \\"${state}\\", \\"context\\": \\"Jenkins CI\\", \\"description\\": \\"${description}\\"}" ^
                             https://api.github.com/repos/%REPO_OWNER%/%REPO_NAME%/statuses/%GIT_COMMIT%
                        """

                        // Post PR comment
                        bat """
                        curl -H "Authorization: token %GITHUB_TOKEN%" ^
                             -H "Accept: application/vnd.github.v3+json" ^
                             -X POST ^
                             -d "{\\"body\\": \\"${comment.replaceAll('"','\\\\\\"')}\\"}" ^
                             https://api.github.com/repos/%REPO_OWNER%/%REPO_NAME%/issues/%PR_NUMBER%/comments
                        """
                    } else {
                        echo "Not a PR build. Skipping GitHub comment."
                    }
                }
            }
        }
    }
}
