pipeline {
    agent{
       label 'host'
    }
    stages{
        stage('Checkout') { // for display purposes
            // Get some code from a GitHub repository
            steps{
                checkout([$class: 'GitSCM', branches: [[name: '*/master']], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[credentialsId: 'git-oschina', url: 'https://git.oschina.net/power1128/clerk.git']]])
            }
            
        }
        stage('Build') {
            steps{
                // Run the maven build
              sh 'cd /var/jenkins/workspace/clerk && cnpm install && npm run build'
              
              
            }
          
       }
       stage('Upload') {
           steps{
               
              script{
                  def tag = sh returnStdout: true, script: 'git describe'
                  env.PROJECT_VERSION = tag.trim()
                  docker.withRegistry("http://registry-vpc.cn-hangzhou.aliyuncs.com", "aliyun-docker-repo"){
                        docker.build('sumang/clerk:${PROJECT_VERSION}').push(env.PROJECT_VERSION)
                    }
              }
           }
           
       }
       stage('Deploy Staging'){
           steps{
               sh '\\cp -r /var/jenkins/workspace/clerk/dist/* /var/www/clerk/'
           }
       }
       stage('Deploy Prod'){
           steps{
               sshagent(['ecs']) {
                    sh 'ssh -o StrictHostKeyChecking=no root@172.16.87.162 docker service update --with-registry-auth hxy_clerk-frontend --image registry-vpc.cn-hangzhou.aliyuncs.com/sumang/clerk:${PROJECT_VERSION}'
                }
               
           }
       }
        
    }

}
