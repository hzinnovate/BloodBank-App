window.addEventListener('load', async e =>{

    if ('serviceWorker' in navigator) {
        await navigator.serviceWorker.register('../sw.js')
            .then(() => {
                console.log('service worker')
            })
            .catch((err) => {
                console.log(err.message)
            })
    }
})


