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
                        dir('Backend') {
                            script {
                                echo "🏃 Ejecutando pruebas unitarias y build del Backend (Gradle)..."
                                // Esto corre tests y construye el JAR
                                sh 'chmod +x gradlew'
                                sh './gradlew --no-daemon build'
                            }
                            // Ahora sí, construye y sube la imagen Docker
                            script {
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
            sh 'docker system prune -f'
        }
    }
}