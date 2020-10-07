<template>
  <div>
    <div v-if="items.length > 0" class="gallery is-hidden-mobile">
      <figure :class="{ 'loading': isLoading}" class="main-image-box shadow" @click="isImageModalActive = true">
        <img :src="mainImage" class="main-image">
        <img :src="backgroundImage" style="display:none" @load="backgroundImageLoaded">
      </figure>
      <div
        ref="thumbnails"
        class="scrolling-wrapper"
        @wheel="handleScroll"
      >
        <div
          v-for="(item,index) in items"
          :key="item.thumbnail"
          class="thumbnail"
          :class="{ 'selected': selectedIndex === index}"
          @click="selectThumbnail(index)"
        >
          <b-img-lazy class="shadow" :src="item.thumbnail" />
          <!-- <img
            v-lazy-load
            class="shadow"
            :data-src="item.thumbnail"
          > -->
        </div>
      </div>
      </figure>
    </div>
    <div class="is-hidden-tablet" style="margin:1.5rem;width:100vw">
      <div
        v-for="(item) in items"
        :key="item.thumbnail"
        class="thumbnail-mobile"
        @click="selectImageMobile(item.src)"
      >
        <b-img-lazy class="shadow" :src="item.thumbnail" />
      </div>
    </div>
    <b-modal v-model="isImageModalActive" full-screen>
      <img :src="mainImage" class="modal-image">
    </b-modal>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true
    },
    selectedImage: {
      type: Number,
      required: true,
      default: 0
    }
  },
  data () {
    return {
      isLoading: true,
      selectedIndex: 0,
      mainImage: '',
      backgroundImage: '',
      isImageModalActive: false
    }
  },
  watch: {
    selectedImage (newVal) {
      this.selectedIndex = newVal
    },
    selectedIndex (newVal) {
      this.loadMainImage(newVal)
    },
    items () {
      this.loadMainImage(this.selectedIndex)
    }
  },
  mounted () {
  },
  methods: {
    selectThumbnail (index) {
      if (index !== this.selectedIndex) {
        this.isLoading = true
        this.selectedIndex = index
        let url = ''
        if (JSON.stringify(window.location).includes('?')) {
          url = window.location.href.split('?')[0]
        } else {
          url = window.location
        }
        history.replaceState({}, null, url + '?image=' + index)
      }
    },
    onImgLoad () {
      this.isLoading = false
    },
    handleScroll (e) {
      e = window.event || e
      const delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)))
      this.$refs.thumbnails.scrollLeft -= (delta * 222)
    },
    backgroundImageLoaded () {
      this.mainImage = this.backgroundImage
      this.isLoading = false
    },
    loadMainImage (newVal) {
      if (this.items.length > 0) {
        this.isLoading = true
        this.mainImage = this.items[newVal].thumbnail
        this.backgroundImage = this.items[newVal].src
      }
    },
    selectImageMobile (src) {
      this.mainImage = src
      this.isImageModalActive = true
    }
  }
}
</script>

<style scoped lang="scss">

.gallery{
  padding: 0rem;
  height: calc(100vh);
  display:flex;
  flex-direction: column;
}

.modal-image{
  padding: 1rem;
  max-height: 100vh;
  margin-left:auto;
  margin-right: auto;
}

.main-image{
  max-width: 100%;
  object-fit: contain;
  max-height: calc(100vh - 100px - 120px);
  display: block;
}

.scrolling-wrapper {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
}

  .thumbnail {
    flex: 0 0 auto;
    max-height: 120px;
    margin:.25rem;
    cursor: pointer;
  }

  .thumbnail-mobile img{
    width: 98%;
    object-fit:contain;
    margin-bottom: .5rem;
  }

.thumbnail img{
  max-height: 120px;
  height: 120px;
  object-fit: contain;
  width:auto;
  /* filter: brightness(50%);
-webkit-filter: brightness(50%); */
}

.thumbnail:hover img{
  filter: brightness(80%);
-webkit-filter: brightness(80%);
}

.loading img{
  position: relative;
  filter: blur(25px);
  height: calc(100vh - 100px - 120px);
 // transform: scale(2);
  // overflow:hidden;
}

.loading{
  overflow: hidden;
}

.main-image-box{
   cursor: pointer;
  overflow: hidden;
width: fit-content;
margin-left: auto;
margin-right: auto;
margin-top: auto;
margin-bottom: auto;
}
</style>
