pipeline {
    agent any 
    tools {
        nodejs 'nodejs'
    }
    environment  {
        SCANNER_HOME = tool 'sonar-scanner'
        DOCKER_REPO_NAME = credentials('DOCKERHUB_FRONTEND_REPO') // Fixed: removed tab character
    }
    stages {
        stage('Cleaning Workspace') {
            steps {
                cleanWs()
            }
        }

        stage('Checkout from Git') {
            steps {
                git credentialsId: 'GITHUB-APP', url: 'https://github.com/otie16/task-tracking-app-frontend.git'
            }
        }
        
        stage('Get Git SHA') {
            steps {
                script {
                    env.GIT_SHA = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                }
            }
        }
        
        stage('Sonarqube Analysis') {
            steps {
                dir('Application-Code/frontend') {
                    withSonarQubeEnv('sonar-server') {
                        withCredentials([string(credentialsId: 'SONAR_TOKEN', variable: 'SONAR_TOKEN')]) {
                            sh ''' 
                                $SCANNER_HOME/bin/sonar-scanner \
                                -Dsonar.projectName=three-tier-app-frontend \
                                -Dsonar.projectKey=three-tier-app-frontend \
                                -Dsonar.login=$SONAR_TOKEN
                            '''
                        }
                    }
                }
            }
        }

        stage('Quality Check') {
            steps {
                script {
                    waitForQualityGate abortPipeline: false, credentialsId: 'SONAR_TOKEN' 
                }
            }
        }

        stage('OWASP Dependency-Check Scan') {
            steps {
                dir('Application-Code/frontend') {
                    withCredentials([string(credentialsId: 'NVD_API_KEY', variable: 'NVD_API_KEY')]){
                        dependencyCheck additionalArguments: '--scan ./ --disableYarnAudit --disableNodeAudit', odcInstallation: 'DP-Check'
                        dependencyCheckPublisher pattern: '**/dependency-check-report.xml'
                    }
                }
            }
        }

        stage('Trivy File Scan') {
            steps {
                dir('Application-Code/frontend') {
                    sh 'trivy fs . > trivyfs.txt'
                }
            }
        }

        stage("Docker Image Build & Tag") {
            steps {
                dir('Application-Code/frontend') {
                    sh '''
                        docker system prune -f
                        docker container prune -f
                        docker build -t ${DOCKER_REPO_NAME}:${GIT_SHA} .
                    '''
                }
            }
        }

        stage("Dockerhub Image Pushing") {
            steps {
                withCredentials([usernamePassword(credentialsId: 'DOCKERHUB-CREDS', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                        docker push ${DOCKER_REPO_NAME}:${GIT_SHA}
                    '''
                }
            }
        }

        stage("TRIVY Image Scan") {
            steps {
                sh 'trivy image ${DOCKER_REPO_NAME}:${GIT_SHA} > trivyimage.txt' 
            }
        }

        stage("CD - Deploy to EC2") {
            steps {
                sshCommand remote: [
                    name: 'application-server',
                    host: '10.0.40.253',
                    user: 'ubuntu',
                    credentialId: 'server-key-id',
                    allowAnyHosts: true
                ], command: """
                    cd /home/ubuntu/app-directory

                    # Replace tag dynamically
                    sed -i 's|image: .*|image: otobongedoho18361/three-tier-app-frontend:${GIT_SHA}|' docker-compose.yml

                    # Pull and deploy updated containers
                    docker-compose down
                    docker-compose pull
                    docker-compose up -d
                """
            }
        }
    }
}




