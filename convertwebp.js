const path = require('path')
const fs = require('fs')
const glob = require('glob')
const sharp = require('sharp')
const ProgressBar = require('progress')

glob('assets/images/**/*.png', function (er, files) {
  if (er) { throw er }

  const bar = new ProgressBar(':bar', { total: files.length })
  const imagesArr = []
  const allImages = []
  files.forEach((item, i) => {
    const fileName = path.parse(item)
    const filePath = fileName.dir.replace('/images/', '/webp/')
    fs.mkdirSync(filePath, { recursive: true })
    sharp(item)
      .withMetadata()
      .toFile(filePath + '/' + fileName.name + '.webp')
      .then((info) => { bar.tick() })

    sharp(item)
      .resize({ width: 450 })
      .toFile(filePath + '/' + fileName.name + '_thumb.webp', (err, info) => {
        if (err) { throw err }
      })

    // filePath = filePath.replace('assets/', './_nuxt/assets/')
    const _src = filePath + '/' + fileName.name + '.webp'
    const _thumbnail = filePath + '/' + fileName.name + '_thumb.webp'

    const folders = []

    let _path = item
    _path = _path.replace('assets/images/', '')
    _path.indexOf(1)
    _path = _path.split('/')
    _path.forEach((item, i) => {
      if (item !== '.' && item.match(/\.(jpeg|jpg|png|gif|webp)/g) === null) {
        folders.push(item)
      }
    })

    const folder = folders[0]
    const subfolder = folders[1]
    // set into map by folder
    let imageSet = imagesArr.find(el => el.folder === folder)
    if (imageSet) {
      imageSet.images.push({ src: _src, thumbnail: _thumbnail })
    } else {
      const images = [{ src: _src, thumbnail: _thumbnail }]
      imagesArr.push({ folder, images, subfolders: [] })
    }

    imageSet = imagesArr.find(el => el.folder === folder)
    // set into subfolders
    if (subfolder) {
      const subImageSet = imageSet.subfolders.find(el => el.subfolder === subfolder)
      if (subImageSet) {
        subImageSet.images.push({ src: _src, thumbnail: _thumbnail })
      } else {
        const images = [{ src: _src, thumbnail: _thumbnail }]
        imageSet.subfolders.push({ subfolder, images })
      }
    }
    allImages.push({ src: _src, thumbnail: _thumbnail })
  })

  imagesArr.unshift({ folder: 'all', images: allImages })

  fs.writeFile('./static/data.json', JSON.stringify({ images: imagesArr }), function (err) {
    if (err) {
      throw err
    }
  })
})
