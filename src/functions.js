const createError = require('http-errors')
const debug = require('debug')('date-guide:debug')
const KikoAnswerService = require('./services/kiko-answer-service')

/**
 * 
 *
 * @param {*} options
 */
async function sendIntentOutputForAnswer (options) {
  debug('getKikoAnswerForEcho() --------')
  const { endpointBaseUrl, conversationId, messages } = options
  const kikoBotService = new KikoAnswerService({ endpointBaseUrl, conversationId })
  const metadata = messages[0].metaData
  // Your own code could start here ---
  // do something ...
  const outputMessages = metadata.intent.output // this could also be an simple string.
  // ---
  await kikoBotService.sendMessage(outputMessages, true)
    .catch((err) => { throw createError(500, 'sendMessage: ' + err.message) })
}

/**
 * Kiko subbot action router for import actions
 *
 * @param {*} req
 * @param {*} res
 */
async function postWebhookMessageSent (req, res) {
  const { conversationId, messages } = req.body
  const referer = req.get('referer') || req.query.referer
  if (!referer) throw createError(400, 'Missing referer.')
  const endpointBaseUrl = referer.replace(/\/\//g, 'https://')
  await sendIntentOutputForAnswer({ endpointBaseUrl, conversationId, messages })
  res.status(200).json({ success: true })
}

module.exports = {
  postWebhookMessageSent
}
