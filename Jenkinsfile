pipeline{
  agent { label "linux"}
  options {
    buildDiscarder logRotator(artifactDaysToKeepStr : '' ,artifactNumToKeepStr : '5' ,daysToKeepStr : '' ,numToKeepStr : '5' )
    disableConcurrentBuils()
  }
  stages{
    stage('Hello'){
      steps{
        echo "hello"
      }
    }
  }
}
