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
                        dir('Backend/demo') {
                            script {
                                echo "🏃 Ejecutando pruebas unitarias y build del Backend (Gradle)..."
                                // Esto corre tests y construye el JAR
                                sh 'chmod +x gradlew'
                                sh './gradlew clean'
                                sh './gradlew --no-daemon build -Dspring.profiles.active=test'
                            }
                            // Ahora sí, construye y sube la imagen Docker
                            script {
                                def image = docker.build("${DOCKERHUB_NAMESPACE}/toolrent:backend-v1", "Backend")
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
            // Archiva el reporte de pruebas unitarias del backend
            archiveArtifacts artifacts: 'Backend/build/reports/tests/**/*', allowEmptyArchive: true
            // Limpieza de Docker
            sh 'docker system prune -f'
        }
    }
}