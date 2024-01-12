import { CognitoUserPool } from 'amazon-cognito-identity-js'

const poolData = {
  UserPoolId: 'us-east-1_5N4SwiCiH',
  ClientId: '77pkpp73fkpm1h4r586knd48vm',
}

const UserPool = new CognitoUserPool(poolData)

export default UserPool
