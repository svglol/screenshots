<template>
  <img :src="mainImage" :class="{ 'loading': isLoading, 'fullscreen' : fullscreen} " @load="onLoad">
</template>

<script>

export default {
  props: {
    image: {
      type: Object,
      required: true
    },
    fullscreen: {
      type: Boolean
    }
  },
  data () {
    return {
      isLoading: true,
      selectedIndex: 0,
      mainImage: '',
      backgroundLoad: ''
    }
  },
  watch: {
    image (newVal) {
      this.loadImage()
    }
  },
  mounted () {
    this.loadImage()
  },
  methods: {
    loadImage () {
      if (this.image) {
        this.isLoading = true
        this.mainImage = require(`../assets/webp/${this.image.src300}`)
        const imageWidth = window.innerWidth

        if (imageWidth <= 300) {
          this.backgroundLoad = require(`../assets/webp/${this.image.src300}`)
        } else if (imageWidth <= 1000) {
          this.backgroundLoad = require(`../assets/webp/${this.image.src1000}`)
        } else if (imageWidth <= 2560) {
          this.backgroundLoad = require(`../assets/webp/${this.image.src2000}`)
        } else {
          this.backgroundLoad = require(`../assets/webp/${this.image.src}`)
        }

        if (this.fullscreen) {
          this.isLoading = false
          this.mainImage = this.backgroundLoad
          this.backgroundLoad = require(`../assets/webp/${this.image.src}`)
        }

        const highResImage = new Image()
        const that = this
        highResImage.onload = function () {
          that.mainImage = that.backgroundLoad
        }
        highResImage.src = this.backgroundLoad
      }
    },
    onLoad () {
      if (this.backgroundLoad === this.mainImage) {
        this.isLoading = false
      }
    }
  }
}
</script>

<style scoped lang="scss">
.loading{
  position: relative;
  filter: blur(25px);
  height: calc(100vh - 100px - 120px);
  overflow: hidden;
}

.fullscreen{
  width: 100vw;
  object-fit: contain;
}
</style>
