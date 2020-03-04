// Utility file to parse an unwieldy JSON file into a pretty javascript object


// Takes one location entry and returns it in usable form
function parseLocation(loc){
    var lat = parseFloat(loc.lat)
    var lng = parseFloat(loc.lng)

    var result = {
        pos: [lat, lng],
        timeStart: parseInt(loc.timeStartMs,10),
        timeEnd: parseInt(loc.timeEndMs,10),
        count: parseInt(loc.count,10)
    }

    return result
}

// Takes one image entry and returns it in usable form
function parseImage(pic) {
    var lat = parseFloat(pic.lat)
    var lng = parseFloat(pic.lng)

    var result = {
        pos: [lat, lng],
        time: parseInt(pic.timestamp),
        file: pic.fileName
    }
    return result
}

function parseChapter(rawData, chapterId){
    var data ={
        name: rawData.name,
        description: rawData.description,
        start: parseInt(rawData.start,10),
        end: parseInt(rawData.end,10),
        id: chapterId
    }

    var locations = []
    for(var index in rawData.children){
        var child = parseLocation(rawData.children[index])
        child.id = index
        locations.push(child)
    }
    data.locations = locations

    var images = []
    for(var imgIndex in rawData.images){
        var imgData = parseImage(rawData.images[imgIndex])
        imgData.id = imgIndex
        imgData.chapterId = chapterId
        images.push(imgData)
    }
    data.images = images

    return data
}

export default function parseData(rawData){
    var data = []

    for(var index in rawData){
        var child = parseChapter(rawData[index], index)
        data.push(child)
    }

    return data
}