chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const {action, data} = message
  const tabId = sender.tab.id

  switch (action) {
    case 'checkCookieExists':
      chrome.cookies.get({
        name: 'ipb_member_id',
        url: 'https://www.e-hentai.org'
      }, (cookie) => {
        if (cookie === null) {
          sendResponse({
            response: true,
            fallback: 'redirectLoginPage'
          })
        } else {
          sendResponse({
            response: true,
            fallback: 'transferCookies'
          })
        }
      })
      break

    case 'transferCookies':
      chrome.cookies.getAll({
        domain: '.e-hentai.org'
      }, (cookies) => {
        cookies.forEach(cookie => {
          if (!['ipb_', 'uconfig'].some(v => cookie.name.includes(v))) {
            return
          }
    
          chrome.cookies.set({
            url: 'https://exhentai.org/',
            name: cookie.name,
            value: cookie.value,
            domain: '.exhentai.org',
            path: '/',
            expirationDate: cookie.expirationDate
          })
        })
        sendResponse({
          response: false,
          fallback: 'endOfApplication'
        })
      })
      break

    case 'sessionReset':
      alert('currently Login session is unauthorized of access this service or invalid. trying reset of service session.')

      deleteCookies()
      sendResponse({
        response: false,
        fallback: 'checkCookieExists'
      })
      break

    default:
      break
  }

  return true // wait for response. do not touch this line.
})

function deleteCookies() {
  chrome.cookies.getAll({
    url: 'https://e-hentai.org'
  }, cookies => {
    cookies.forEach(cookie => {
      chrome.cookies.remove({
        url: 'https://e-hentai.org',
        name: cookie.name
      })
    })
  })

  chrome.cookies.getAll({
    url: 'https://exhentai.org'
  }, cookies => {
    cookies.forEach(cookie => {
      chrome.cookies.remove({
        url: 'https://exhentai.org',
        name: cookie.name
      })
    })
  })
}