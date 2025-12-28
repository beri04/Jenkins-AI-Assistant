pipeline{
    agent any 
    
    environment{
        IMAGE_NAME = 'saks04/numbers-util'
        IMAGE_TAG = "latest"
    }

    stages{
        stage("Checkout"){
            steps{
                echo "Cloning Repo"
                checkout scm
            }
        }
        stage("Building"){
            steps{
                echo "Building Java Project..."
                sh 'mvn clean compile'
            }
        }
        stage("Test"){
            steps{
                echo "Testing of the project"
                sh 'mvn test'
            }
            post{
                always{
                    echo '📊 Publishing JUnit test results...'
                    junit 'target/surefire-reports/*.xml'
                }
            }
        }
        stage('Docker build and Docker push'){
            steps{
                echo "building image"
                sh 'docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .'

                echo "Pushing image to hub"
                withCredentials([usernamePassword(credentialsId: 'dockerhub-cred', usernameVariable: 'DOCKER_USER',passwordVariable: 'DOCKER_PASS')]) {
                    sh """
                        echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                        docker push ${IMAGE_NAME}:${IMAGE_TAG}
                    """
                }
            }
        }
    }
    post{
        success{
            echo 'pipeline Completed'
        }
        failure{
            echo 'pipeline failed, check logs'
        }
        always{
            echo "Done ✅"
            cleanWs()
        }
    }
}