pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'swiftride:latest'
        GITHUB_TOKEN = credentials('github-token') // Jenkins credential ID
        REPO_OWNER = 'sainikhilchitra'
        REPO_NAME = 'ride'
    }

    stages {
        stage('Prepare') {
            steps {
                script {
                    // Ensure test-results directory exists
                    bat "if not exist test-results mkdir test-results"
                }
            }
        }

        stage('Run Tests in Docker') {
            steps {
                script {
                    // Run tests but continue even if they fail
                    catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                        bat """
                        docker run --rm -v "%CD%\\\\test-results:/tests" ${DOCKER_IMAGE} ^
                            npm test -- --reporters=default --reporters=jest-junit ^
                            1>test-results/test-output.txt 2>&1
                        """
                    }
                }
            }
        }

        stage('Parse Test Summary') {
            steps {
                script {
                    // Read test output
                    def summary = [:]
                    def lines = readFile('test-results/test-output.txt').split('\r?\n')

                    summary.total = 0
                    summary.passed = 0
                    summary.failed = 0
                    summary.tests = []

                    lines.each { line ->
                        def m1 = line =~ /Tests:\s+(\d+) passed, (\d+) total/
                        def m2 = line =~ /Tests:\s+(\d+) failed, (\d+) passed, (\d+) total/
                        def m3 = line =~ /✓ (.+) \((\d+) ms\)/
                        if (m1) {
                            summary.passed = m1[0][1].toInteger()
                            summary.total = m1[0][2].toInteger()
                        } else if (m2) {
                            summary.failed = m2[0][1].toInteger()
                            summary.passed = m2[0][2].toInteger()
                            summary.total = m2[0][3].toInteger()
                        } else if (m3) {
                            summary.tests << m3[0][1]
                        }
                    }

                    // Build markdown summary
                    def markdown = """\
                    |**Jenkins CI Test Summary**
                    |- Total: ${summary.total}
                    |- Passed: ${summary.passed}
                    |- Failed: ${summary.failed}
                    |- Tests:
                    ${summary.tests.collect{ "- ${it}" }.join('\n')}
                    """.stripMargin()

                    // Save markdown to file (optional)
                    writeFile file: 'test-results/summary.md', text: markdown
                    env.TEST_SUMMARY = markdown
                }
            }
        }

        stage('Post Comment to GitHub PR') {
            steps {
                script {
                    // Only run if this is a PR
                    if (env.CHANGE_ID) {
                        def prNumber = env.CHANGE_ID
                        def apiUrl = "https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues/${prNumber}/comments"
                        bat """
                        curl -H "Authorization: token ${GITHUB_TOKEN}" ^
                             -H "Accept: application/vnd.github.v3+json" ^
                             -X POST ^
                             -d "{\\"body\\": \\"${env.TEST_SUMMARY.replaceAll('"','\\\\\\"')}\\n\\"}" ^
                             ${apiUrl}
                        """
                    } else {
                        echo "Not a pull request, skipping GitHub comment."
                    }
                }
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'test-results/**', allowEmptyArchive: true
            echo "Artifacts archived."
        }
    }
}
