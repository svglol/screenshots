// import imagesData from '~/static/data.json'
export const state = () => ({
  images: loadImages()
})

// function loadImages () {
//   const r = require.context('../assets/webp/', true, /\.webp$/)

//   imagesData.images.forEach((item) => {
//     item.images.forEach((image) => {
//       // assets/webp/Brady Meyers/brady-belle.webp
//       // ./Brady Meyers/brady-belle.webp

//       image.src = r(image.src.replace('assets/webp/', './'))
//       image.thumbnail = r(image.thumbnail.replace('assets/webp/', './'))
//     })
//     if (item.subfolders) {
//       item.subfolders.forEach((subItem) => {
//         subItem.images.forEach((image) => {
//           image.src = r(image.src.replace('assets/webp/', './'))
//           image.thumbnail = r(image.thumbnail.replace('assets/webp/', './'))
//         })
//       })
//     }
//   })
//   return imagesData.images
// }

function loadImages () {
  const imagesArr = []
  const r = require.context('../assets/webp/', true, /\.webp$/)

  r.keys().forEach((item, i) => {
    const folders = []
    if (!item.includes('_thumb')) {
      const image = item
      const n = image.lastIndexOf('.')
      const thumbnail = image.substr(0, n) + '_thumb' + image.substr(n)

      let path = item
      path.indexOf(1)
      path = path.split('/')
      path.forEach((item, i) => {
        if (item !== '.' && item.match(/\.(jpeg|jpg|png|gif|webp)/g) === null) {
          folders.push(item)
        }
      })

      const folder = folders[0]
      const subfolder = folders[1]
      // set into map by folder
      let imageSet = imagesArr.find(el => el.folder === folder)
      if (imageSet) {
        imageSet.images.push({ src: r(item), thumbnail: r(thumbnail) })
      } else {
        const images = [{ src: r(item), thumbnail: r(thumbnail) }]
        imagesArr.push({ folder, images, subfolders: [] })
      }

      imageSet = imagesArr.find(el => el.folder === folder)
      // set into subfolders
      if (subfolder) {
        const subImageSet = imageSet.subfolders.find(el => el.subfolder === subfolder)
        if (subImageSet) {
          subImageSet.images.push({ src: r(item), thumbnail: r(thumbnail) })
        } else {
          const images = [{ src: r(item), thumbnail: r(thumbnail) }]
          imageSet.subfolders.push({ subfolder, images })
        }
      }
    }
  })

  // add all images to an all image link
  const allImages = []
  r.keys().forEach((item, i) => {
    if (!item.includes('_thumb')) {
      const image = item
      const n = image.lastIndexOf('.')
      const thumbnail = image.substr(0, n) + '_thumb' + image.substr(n)
      allImages.push({ src: r(item), thumbnail: r(thumbnail) })
    }
  })
  imagesArr.unshift({ folder: 'all', images: allImages })

  return imagesArr
}
