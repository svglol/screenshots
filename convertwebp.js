const path = require('path')
const fs = require('fs')
const glob = require('glob')
const sharp = require('sharp')
const ProgressBar = require('progress')

glob('assets/images/**/*.png', function (er, files) {
  if (er) { throw er }

  // fs.rmdirSync('assets/webp', { recursive: true })
  const bar = new ProgressBar(':bar', { total: files.length })

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
  })
})
