// src/aws-config.js
import AWS from 'aws-sdk'

AWS.config.update({
  region: 'us-east-1',
})

const cognito = new AWS.CognitoIdentityServiceProvider({
  apiVersion: '2016-04-19',
  region: 'us-east-1',
})

export default cognito
