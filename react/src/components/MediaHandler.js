import Swal from 'sweetalert2'
export default class MediaHandler {
    getPermissions() {
        return new Promise ((res, rej) => {
            navigator.mediaDevices.getUserMedia({video:true, audio:true})
                .then((stream) => {
                    res(stream)
                })
                .catch((err) => {
                    Swal.fire({
                    type: 'error',
                    title: 'Unable to Access Camera',
                    text: 'Please Allow Camera, Microphone'
                    }).then(result => {
                    })
                    
                    // throw new Error(`Unable to fetch Stream ${err}`)
                })
            })

        
    }
}