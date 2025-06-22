pipeline {
    agent any

    environment {
        DOCKER_BUILDKIT = '1'
    }

    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/olfagaidi/EmpreinteCarbonePFE-Monolith.git'
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    sh 'docker-compose build'
                }
            }
        }

        stage('Run Containers') {
            steps {
                script {
                    sh 'docker-compose up -d'
                }
            }
        }

        stage('Tests (à personnaliser)') {
            steps {
                echo 'Ajouter des tests ici si nécessaire'
            }
        }

        stage('Cleanup') {
            steps {
                echo 'Nettoyage si besoin...'
            }
        }
    }

    post {
        failure {
            echo '🚨 Le pipeline a échoué.'
        }
        success {
            echo '✅ Pipeline exécuté avec succès.'
        }
    }
}
