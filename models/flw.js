module.exports = [
  {
    vst: { type: 'ObjectId', ref: 'vst' },
    uq: 'number', //combine all related flw with uq number
    referrer: 'string', //=php: $_SERVER['referrer']
    url: ['string'], //[host(inc. subDomain), path,queries]
    post: ['Map'],
    ip: ['string'], //may change every site access; ip may be array
    port: 'number',
    proxy: 'boolean',
    user: { type: 'ObjectId', ref: 'person' } //if logged in
  }
  //  { vst: 1 }
]
