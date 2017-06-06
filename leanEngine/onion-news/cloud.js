const AV = require('leanengine');
const qiniu = require('qiniu');
qiniu.conf.ACCESS_KEY = 'rzEKTY7VtC-omB-EWnUmnz3aeZR816thc694szcK';
qiniu.conf.SECRET_KEY = 'pspMY3-nnpIbUkU8T2kHycKwIlr8Tt2kRhROt0GY';

/**
 * 一个简单的云代码方法
 */
AV.Cloud.define('hello', function(request) {
  return 'Hello world!';
});
AV.Cloud.define('genUpToken', function(req, res) {
  const bucket = req && req.params['bucket'] ? req.params['bucket'] : 'hidoge',
      putPolicy = new qiniu.rs.PutPolicy(bucket);
  //putPolicy.callbackUrl = callbackUrl;
  //putPolicy.callbackBody = callbackBody;
  //putPolicy.returnUrl = returnUrl;
  //putPolicy.returnBody = returnBody;
  //putPolicy.asyncOps = asyncOps;
  //putPolicy.expires = expires;
  const aToken = putPolicy.token();
  return res.success(aToken);
});