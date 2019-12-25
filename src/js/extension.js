(() => {
  const image = document.querySelector('body > img')
  const isActive = (image !== null && image.length === 1) || document.body.innerHTML === ""
  
  if (isActive === true) {
    //  check cookie ->
    //    if doesn't have cookie ->
    //      send Login Page
    //    if have cookie ->
    //      transfer login cookie ->
    //        refresh login Page ->
    //          displaying index complete ->
    //            stop working
    //          still displaying kokomade ->
    //            displaying permission error and self-destructure

    if (window.sessionStorage.getItem('alreadyLogin') !== null) {
      chrome.runtime.sendMessage({
        action: 'sessionReset'
      }, response => {
        window.sessionStorage.removeItem('alreadyLogin', null)
        location.reload()
      })
    } else {
      chrome.runtime.sendMessage({
        action: 'checkCookieExists'
      }, (response) => {
        if (response.fallback === 'redirectLoginPage') {
          location.href = 'https://forums.e-hentai.org/index.php?act=Login&CODE=00'
        } else {
          chrome.runtime.sendMessage({
            action: response.fallback
          }, response => {
            window.sessionStorage.setItem('alreadyLogin', true)
            location.reload()
          })
        }
      })
    }
  }
})()
