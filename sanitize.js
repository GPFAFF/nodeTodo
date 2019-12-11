const sanitizeHTML = require('sanitize-html');

const sanitize = (text) => sanitizeHTML(text,{allowedTags: [], allowedAttributes: {}});

module.exports = {
  sanitize
}