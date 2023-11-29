import { CognitoUserPool } from 'amazon-cognito-identity-js'

const poolData = {
  UserPoolId: 'us-east-1_5N4SwiCiH', // Your user pool id here
  ClientId: '77pkpp73fkpm1h4r586knd48vm', // Your client id here
}

const UserPool = new CognitoUserPool(poolData)

export default UserPool
