<template>
  <div>
    <div v-if="items.length > 0" class="gallery">
      <figure :class="{ 'loading': isLoading}" class="main-image-box" @click="isImageModalActive = true">
        <img :src="require(`../assets/webp/${mainImage}`)" class="main-image">
        <img :src="require(`../assets/webp/${backgroundImage}`)" style="display:none" @load="backgroundImageLoaded">
      </figure>
      <div
        id="thumbnails"
        ref="thumbnails"
        class="scrolling-wrapper"
        @wheel="handleScroll"
      >
        <div
          v-for="(item,index) in items"
          :id="'thumb_'+index"
          :key="item.thumbnail"
          class="thumbnail"
          :class="{ 'selected': selectedIndex === index}"
          @click="selectThumbnail(index)"
        >
          <b-img-lazy class="" :src="require(`../assets/webp/${item.thumbnail}`)" blank-src="@/assets/placeholder.webp" v-bind="mainProps" />
        </div>
      </div>
    </div>
    <b-modal v-model="isImageModalActive" full-screen>
      <img v-if="mainImage !== ''" :src="require(`../assets/webp/${mainImage}`)" class="modal-image">
    </b-modal>
  </div>
</template>

<script>
const VueScrollTo = require('vue-scrollto')

const options = {
  container: '#thumbnails',
  easing: 'ease-in',
  offset: -5,
  force: true,
  x: true,
  y: false
}

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
      isImageModalActive: false,
      mainProps: {
        center: true,
        fluidGrow: true,
        blank: true,
        blankColor: '#bbb',
        width: 214,
        height: 120
      }
    }
  },
  watch: {
    selectedImage (newVal) {
      this.selectedIndex = newVal
    },
    selectedIndex (newVal) {
      this.loadMainImage(newVal)
      this.$nextTick(() => {
        VueScrollTo.scrollTo('#thumb_' + newVal, 200, options)
      })
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

@media screen and (max-width: 1023px)  and (orientation:landscape){

  .gallery{
    margin-left:1.2rem
  }
  .thumbnail{
    max-height: 60px!important;
    height: 60px!important;
    width: 120px!important;
  }

  .thumbnail img{
    max-height: 60px!important;
    height: 60px!important;
      width: 120px!important;
  }

  .main-image{
    max-height: calc(100vh)!important;
  }

  .scrolling-wrapper{
    margin-left: -0.5rem;
    margin-right: -0.5rem;
  }
}

@media screen and (max-width: 1023px)  and (orientation:portrait){
.gallery{
  width: 100vw;
  height: calc(100vh - 30px);
  margin-left:1.2rem
}

.main-image{
  max-height: calc(100vh - 120px)!important;
}

.thumbnail{
  max-height: 60px!important;
  height: 60px!important;
  width: 120px!important;
}

.thumbnail img{
  max-height: 60px!important;
  height: 60px!important;
    width: 120px!important;
}

.scrolling-wrapper{
  margin-left: -0.5rem;
  margin-right: -0.5rem;
}
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
    width: 214px;
    margin:.25rem;
    cursor: pointer;
  }

.thumbnail img{
  max-height: 120px;
  height: 120px;
  object-fit: contain;
   object-position: center;
  width:214px;
  filter: drop-shadow(0px 0px 5px rgba(0,0,0,0.30));
}

.thumbnail:hover img{
  filter: brightness(80%);
-webkit-filter: brightness(80%);
}

.loading img{
  position: relative;
  filter: blur(25px);
  height: calc(100vh - 100px - 120px);
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
