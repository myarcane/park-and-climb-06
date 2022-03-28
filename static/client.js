const form = document.getElementById('submit-new-parking')
const table = document.getElementById('parkings-list')
const googleMapsEnpoint = 'https://www.google.com/maps/search/?api=1'
const inputParkingName = document.getElementById('parking-name')
const inputParkingGeo = document.getElementById('parking-geo')
const textAreaCragsList = document.getElementById('crags-list')

const displayParkingTables = (parkingsData) => {
    const addParkingTable = (parkingName, { lat, lng }, cragsList = null) => {
        const googleMapsLink = `${googleMapsEnpoint}&query=${lat},${lng}`
        return `<tr><td>${parkingName}</td><td><a target="_blank" href="${googleMapsLink}">${lat},${lng}</a></td><td>${
            cragsList ? cragsList : ''
        }</td></tr>`
    }

    const htmlList = parkingsData.reduce((acc, { parking, geo, crags }) => {
        return acc + addParkingTable(parking, geo, crags)
    }, '')

    table.tBodies[0].innerHTML = htmlList
}

const sendNewParkingData = (data) => {
    fetch('/newgeo', {
        method: 'POST',
        headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(function (response) {
            if (response.ok) {
                window.location.reload()
                return
            }
            throw new Error('Request failed.')
        })
        .catch(function (error) {
            console.log(error)
        })
}

const init = () => {
    displayParkingTables(parkingCoordinates)
    form.addEventListener('submit', (event) => {
        event.preventDefault()
        const formData = {
            parking: inputParkingName.value,
            geo: inputParkingGeo.value,
            crags: textAreaCragsList.value,
        }

        sendNewParkingData(formData)
    })
}

init()
