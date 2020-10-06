<template lang="html">
  <div>
    <Gallery
      :items="images"
      :selected-image="selectedImage"
    />
  </div>
</template>
<script>
export default {
  data () {
    return {
      images: [],
      selectedImage: 0
    }
  },
  mounted () {
    const route = this.$route
    const images = []
    const r = require.context('../assets/webp/', true, /\.webp$/)
    const path = route.path.replace(/_/g, ' ')
    r.keys().forEach((item, i) => {
      if (item.includes(path) && !item.includes('_thumb')) {
        const image = item
        const n = image.lastIndexOf('.')
        const result = image.substr(0, n) + '_thumb' + image.substr(n)
        images.push({ src: r(item), thumbnail: r(result) })
      }
    })
    this.images = images
    if (route.query.image) {
      this.selectedImage = parseInt(route.query.image)
    }
  },
  methods: {
    getImgUrl (value) {
      const image = this.images[value]
      const n = image.lastIndexOf('/')
      const result = image.substr(0, n) + '/thumb' + image.substr(n)
      return result
    }
  }
}

</script>

<style>

</style>
