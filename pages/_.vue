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
    const path = route.path.replace(/_/g, ' ')
    const paths = path.split('/')

    if (paths) {
      if (paths[1]) {
        const result = this.$store.state.images.find(item => item.folder === paths[1])
        if (paths[2]) {
          if (result) { this.images = result.subfolders.find(item => item.subfolder === paths[2]).images }
        } else if (result) { this.images = result.images }
      } else {
        this.images = this.$store.state.images.find(item => item.folder === 'all').images
      }
    }
    // this.images = images
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
