// Ensure that Service Worker is supported

if('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('../sw.js')
            .then((reg) => {
                if(reg.installing) {
                    console.log('Service Worker: Installing');
                } else if(reg.waiting) {
                    console.log('Service Worker: Waiting');
                } else if(reg.active) {
                    console.log('Service Worker: Active');
                }
                console.log(`Service Worker: Registered with scope: ${reg.scope}`)
            })
            .catch(err => console.log(`Service Worker: Error: ${err}`));
    });
}
