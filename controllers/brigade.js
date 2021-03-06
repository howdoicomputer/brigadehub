var Brigade = require('../models/Brigade')

/**
 * GET /brigade
 * Brigade page.
 */
exports.getBrigade = function (req, res) {
  res.render(res.locals.brigade.theme.slug + '/views/brigade', {
    title: 'Brigade',
    brigade: res.locals.brigade
  })
}

/**
 * POST /brigade
 * Sign in using email and password.
 */
exports.postBrigade = function (req, res, next) {
  /* req.assert('name', 'Password cannot be blank').notEmpty()
  req.assert('slug', 'Slug cannot be blank').notEmpty()
  req.assert('github', 'Github Group cannot be blank').notEmpty()
  req.assert('theme-slug', 'Theme cannot be blank').notEmpty()

  var errors = req.validationErrors()

  if (errors) {
    req.flash('errors', errors)
    return res.redirect('/brigade')
  } */
  console.log(req.body)
  res.locals.brigade.name = req.body.name
  res.locals.brigade.location.general = req.body.location
  res.locals.brigade.url = req.body.url
  res.locals.brigade.github = req.body.github
  res.locals.brigade.theme.logo = req.body.logo
  res.locals.brigade.theme.slug = req.body['theme-slug']
  Brigade.find({slug: res.locals.brigade.slug}, function (err, results) {
    if (err) {
      console.error(err)
      req.flash('error', { msg: 'An error has occurred. Check console.' })
    }
    var thisBrigade = results[0]
    if (req.body.name) { // brigade form updated
      thisBrigade.name = req.body.name
      thisBrigade.location.general = req.body.location
      thisBrigade.url = req.body.url
      thisBrigade.github = req.body.github
      thisBrigade.copy.description = req.body.description
    } else if (req.body['theme-slug']) { // social media keys updated
      thisBrigade.theme.slug = req.body['theme-slug']
      thisBrigade.theme.logo = req.body.logo
      thisBrigade.theme.show.title = req.body['show-title'] === 'on'
      thisBrigade.theme.show.events = req.body['show-events'] === 'on'
      thisBrigade.theme.show.projects = req.body['show-projects'] === 'on'
      thisBrigade.theme.show.blog = req.body['show-blog'] === 'on'
      thisBrigade.theme.show.about = req.body['show-about'] === 'on'
      thisBrigade.theme.show.login = req.body['show-login'] === 'on'
    } else { // social media keys updated
      thisBrigade.auth.github.clientId = req.body['github-client-id']
      thisBrigade.auth.github.clientSecret = req.body['github-client-secret']
    }
    thisBrigade.save(function (err, results) {
      if (err) {
        console.error(err)
        req.flash('error', { msg: 'An error has occurred. Check console.' })
      }
      req.flash('success', { msg: "Success! You've updated your brigade." })
      res.redirect('/brigade')
    })
  })
}
