class IncomingUserParamValidator {
  constructor(params){
    this.apply(params)
  }

  apply = (params) => {
    if (!params.password || params.password.length < 1) {
      throw "InvalidArgumentException"
    }
  }
}

module.exports = IncomingUserParamValidator
