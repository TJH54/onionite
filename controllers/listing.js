const tor = require('../lib/tor');

const orderValues = [
  'consensus_weight',
  'first_seen'
];

module.exports = (req, res, next) => {

  let title = 'Top nodes by consensus weight';
  const query = {
    limit: 10
  };
  if(req.query.s) {
    title = `Search results for "${req.query.s}":`;
    query.search = req.query.s;
  } else {
    query.order = '-consensus_weight';
    query.running = true;
  }
  if(req.query.p) {
    query.offset = (query.limit * req.query.p) - query.limit;
  }
  if(req.query.order && orderValues.includes(req.query.order)) {
    query.order = req.query.order;
  }

  tor.listNodes(query)
    .then(nodes => res.render('listing.html', {
      pageTitle: req.query.s ? `Search: ${req.query.s}` : false,
      title: title,
      nodes: nodes,
      numOfNodes: query.limit,
      orderValues: orderValues
    }))
    .catch(err => {
      if(err.statusCode == 400 && req.query.s) {
        err.statusMessage = 'Bad Search Query';
      }
      next(err);
    });
}
