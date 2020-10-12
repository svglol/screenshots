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
    let filePath = fileName.dir.replace('/images/', '/webp/')
    fs.mkdirSync(filePath, { recursive: true })

    try {
      if (!fs.existsSync(filePath + '/' + fileName.name + '.webp')) {
        sharp(item)
          .withMetadata()
          .toFile(filePath + '/' + fileName.name + '.webp')
          .then((info) => { bar.tick() })
      } else {
        bar.tick()
      }
    } catch (err) {
      console.error(err)
    }

    try {
      if (!fs.existsSync(filePath + '/' + fileName.name + '_300.webp')) {
        sharp(item)
          .resize({ width: 300 })
          .toFile(filePath + '/' + fileName.name + '_300.webp', (err, info) => {
            if (err) { throw err }
          })
      }
    } catch (err) {
      console.error(err)
    }

    try {
      if (!fs.existsSync(filePath + '/' + fileName.name + '_1000.webp')) {
        sharp(item)
          .resize({ width: 1000 })
          .toFile(filePath + '/' + fileName.name + '_1000.webp', (err, info) => {
            if (err) { throw err }
          })
      }
    } catch (err) {
      console.error(err)
    }

    try {
      if (!fs.existsSync(filePath + '/' + fileName.name + '_2000.webp')) {
        sharp(item)
          .resize({ width: 2000 })
          .toFile(filePath + '/' + fileName.name + '_2000.webp', (err, info) => {
            if (err) { throw err }
          })
      }
    } catch (err) {
      console.error(err)
    }

    filePath = filePath.replace('assets/webp/', '')
    const _src = filePath + '/' + fileName.name + '.webp'
    const _300 = filePath + '/' + fileName.name + '_300.webp'
    const _1000 = filePath + '/' + fileName.name + '_1000.webp'
    const _2000 = filePath + '/' + fileName.name + '_2000.webp'
    const { mtimeMs } = fs.statSync('./' + item)

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
      imageSet.images.push({ src: _src, src300: _300, src1000: _1000, src2000: _2000, time: mtimeMs })
    } else {
      const images = [{ src: _src, src300: _300, src1000: _1000, src2000: _2000, time: mtimeMs }]
      imagesArr.push({ folder, images, subfolders: [] })
    }

    imageSet = imagesArr.find(el => el.folder === folder)
    // set into subfolders
    if (subfolder) {
      const subImageSet = imageSet.subfolders.find(el => el.subfolder === subfolder)
      if (subImageSet) {
        subImageSet.images.push({ src: _src, src300: _300, src1000: _1000, src2000: _2000, time: mtimeMs })
      } else {
        const images = [{ src: _src, src300: _300, src1000: _1000, src2000: _2000, time: mtimeMs }]
        imageSet.subfolders.push({ subfolder, images })
      }
    }
    allImages.push({ src: _src, src300: _300, src1000: _1000, src2000: _2000, time: mtimeMs })
  })

  imagesArr.unshift({ folder: 'all', images: allImages })

  imagesArr.forEach((item) => {
    item.images.sort(function (a, b) { return b.time - a.time })
    if (item.subfolders) {
      item.subfolders.forEach((sub) => {
        sub.images.sort(function (a, b) { return b.time - a.time })
      })
    }
  })

  fs.writeFile('./static/data.json', JSON.stringify({ images: imagesArr }), function (err) {
    if (err) {
      throw err
    }
  })
})
