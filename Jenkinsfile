pipeline {
    agent any

    environment {
        DOCKERHUB_NAMESPACE = 'fabimessidev'
    }

    stages {
        stage('🏗️ Build & Push Images') {
            parallel {
                stage('Frontend') {
                    steps {
                        dir('Frontend') {
                            script {
                                def image = docker.build("${DOCKERHUB_NAMESPACE}/toolrent:frontend-v1")
                                docker.withRegistry('https://registry.hub.docker.com', 'dockerhub-credentials') {
                                    image.push("frontend-v1")
                                    image.push("frontend-latest")
                                }
                                echo "✅ Frontend image pushed to DockerHub"
                            }
                        }
                    }
                }

                stage('Backend') {
                    steps {
                        // ✅ PASO 1: Build del código (en Backend/demo)
                        dir('Backend/demo') {
                            script {
                                echo "🏃 Ejecutando pruebas unitarias y build del Backend (Gradle)..."
                                sh 'chmod +x gradlew'
                                sh './gradlew clean'
                                sh './gradlew --no-daemon build -Dspring.profiles.active=test'
                                echo "✅ Backend tests and build completed"
                            }
                        }
                        
                        // ✅ PASO 2: Build Docker (en Backend, donde está el Dockerfile)
                        dir('Backend') {
                            script {
                                echo "🐳 Building Docker image..."
                                def image = docker.build("${DOCKERHUB_NAMESPACE}/toolrent:backend-v1")
                                docker.withRegistry('https://registry.hub.docker.com', 'dockerhub-credentials') {
                                    image.push("backend-v1")
                                    image.push("backend-latest")
                                }
                                echo "✅ Backend image pushed to DockerHub"
                            }
                        }
                    }
                }
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline completed successfully!'
        }
        failure {
            echo '❌ Pipeline failed!'
        }
        always {
            archiveArtifacts artifacts: 'Backend/demo/build/reports/tests/**/*', allowEmptyArchive: true
            sh 'docker system prune -f'
        }
    }
}