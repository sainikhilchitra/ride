pipeline {
    agent { label "windows" }  // Use Windows agent

    options {
        // Keep only the last 5 builds and artifacts
        buildDiscarder(logRotator(
            artifactNumToKeepStr: '5', 
            numToKeepStr: '5'
        ))
        // Prevent concurrent builds
        disableConcurrentBuilds()  // Fixed spelling
    }

    stages {
        stage('Hello') {
            steps {
                echo "hello"
            }
        }
    }
}
