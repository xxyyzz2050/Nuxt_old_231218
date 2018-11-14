module.exports = {
  agent: 'ObjectId',
  uq: 'number', //combine all related flw with uq number
  referrer: 'string', //=php: $_SERVER['referrer']
  url: ['string'], //[host(inc. subDomain), path,queries]
  post: ['map'],
  ip: 'string', //may change every site access
  port: 'number',
  proxy: 'boolean'
}
