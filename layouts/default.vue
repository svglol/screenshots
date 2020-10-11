<template>
  <div>
    <section class="main-content columns">
      <!-- Desktop Nav Sidebar -->
      <div class="column sidebar is-hidden-mobile">
        <div style="display:flex; justify-content: center;">
          <div>
            <h2>Matt Trotman</h2>
          </div>
          <div>
            <ul class="socialMenu">
              <li v-for="item in socialMenu" :key="item.icon">
                <a :href="item.link" target="_blank">
                  <font-awesome-icon :icon="['fab',item.icon]" />
                </a>
              </li>
            </ul>
          </div>
        </div>
        <hr>
        <ul>
          <li
            v-for="(item, index) in images"
            :key="item.folder"
          >
            <nuxt-link
              :to="generateLink(images[index].folder)"
              exact-active-class="is-active"
              @click.native="openLink(index)"
            >
              <div
                class="list-item"
              >
                <b-img-lazy class="shadow" :src="getImgUrl(item,false)" blank-src="@/assets/placeholder.webp" :class="{ 'active': activeIndex === index }" />
                <span class="menu-item">  {{ item.folder }} </span>
              </div>
            </nuxt-link>
            <ul v-show="activeIndex === index" class="submenu">
              <li v-for="(subItem,subIndex) in item.subfolders" :key="subItem.subfolder">
                <nuxt-link
                  :to="generateLink(images[index].folder, images[index].subfolders[subIndex].subfolder)"
                  exact-active-class="is-active"
                  @click.native="openLink(index,subIndex)"
                >
                  <b-img-lazy class="shadow" :src="getImgUrl(subItem,true)" blank-src="@/assets/placeholder.webp" :class="{ 'active': activeSubIndex === subIndex }" />
                  <span class="sub-menu-item">  {{ subItem.subfolder }} </span>
                </nuxt-link>
              </li>
            </ul>
          </li>
        </ul>
      </div>

      <!-- Mobile Nav Bar -->
      <b-navbar class="is-hidden-tablet is-primary">
        <template slot="brand">
          <nuxt-link to="">
            <h2 style="margin-left:1.5rem">
              Matt Trotman
            </h2>
          </nuxt-link>

          <ul class="socialMenu">
            <li v-for="item in socialMenu" :key="item.icon">
              <a :href="item.link" target="_blank">
                <font-awesome-icon :icon="['fab',item.icon]" />
              </a>
            </li>
          </ul>
        </template>
        <template slot="start">
          <b-navbar-item
            v-for="(item,index) in images"
            :key="item.folder"
            exact-active-class="is-active"
            tag="nuxt-link"
            :to="generateLink(images[index].folder)"
          >
            {{ item.folder }}
          </b-navbar-item>
        </template>
      </b-navbar>

      <div class="container column" style="padding-left:0">
        <nuxt />
      </div>
    </section>
  </div>
</template>

<script>

export default {
  data () {
    return {
      images: [],
      activeIndex: 0,
      activeSubIndex: 0,
      socialMenu: [
        { icon: 'twitter', link: 'https://www.twitter.com/svglol' },
        { icon: 'instagram', link: 'https://www.instagram.com/svglol' },
        { icon: 'github', link: 'https://www.github.com/svglol' }
      ]
    }
  },
  mounted () {
    // this.importAll(require.context('../assets/webp/', true, /\.webp$/))
    this.images = this.$store.state.images

    // Get Active index/subindex
    const paths = this.$route.params.pathMatch.split('/')
    paths.forEach((path, i) => {
      path = path.replace(/_/g, ' ')
      if (i === 0) {
        // active index
        this.images.forEach((item, j) => {
          if (item.folder === path) {
            this.activeIndex = j
          }
        })
      } else if (i === 1) {
        // active subindex
        if (this.images[this.activeIndex]) {
          this.images[this.activeIndex].subfolders.forEach((item, j) => {
            if (item.subfolder === path) {
              this.activeSubIndex = j
            }
          })
        }
      }
    })
  },
  methods: {
    getImgUrl (item, subItem) {
      // get thumbnail image
      let num = 0
      if (subItem) {
        num = Math.floor(0.67 * (item.images.length))
      } else {
        num = Math.floor(0.34 * (item.images.length))
      }
      const image = item.images[num].thumbnail
      return image
    },
    openLink (index, subIndex) {
      this.activeIndex = index
      this.activeSubIndex = subIndex
    },
    generateLink (folder, subfolder) {
      if (!subfolder) {
        if (folder === 'all') { return '/' }
        return '/' + folder.replace(/ /g, '_')
      }
      // return '/' + folder
      return '/' + folder.replace(/ /g, '_') + '/' + subfolder.replace(/ /g, '_')
    }
  }
}
</script>

<style scoped lang="scss">
$primary: #dddddd;

.container{
  max-width: calc(100vw - 300px);
  padding: 0;
  margin: 0;
}

.navbar.has-shadow{
  box-shadow: 0 0 black;
}

.sidebar{
  max-width: 300px;
  background-color: rgba(0,0,0,0.5);
  padding: 0rem;
  padding-left: .75rem;
  padding-right: .75rem;
  margin-left: .75rem;
  height: calc(100vh);
  overflow-y:auto;
}

.navbar.is-primary{
   background-color: rgba(0,0,0,0.5);
}

.navbar {
   border-bottom: 2px solid white;
}

.navbar-brand{
  margin-left: 1.5rem;
  margin-right: 1rem;
}

ul li{
  position: relative;
}

li a:hover {
  color:$primary
}
.list-item{
    position: relative;
}

li img{
  filter: brightness(20%);
-webkit-filter: brightness(20%);
max-height: 50px;
width: 100%;
object-fit: cover;
}

.submenu li img {
  filter: brightness(20%);
-webkit-filter: brightness(20%);
max-height: 30px;
width: 100%;
object-fit: cover;
}

.submenu li:hover img {
  filter: brightness(6%);
-webkit-filter: brightness(40%);
}

.list-item:hover img{
  filter: brightness(60%);
-webkit-filter: brightness(40%);
}

.active{
  filter: brightness(60%)!important;
-webkit-filter: brightness(60%)!important;
}

.submenu{
    margin-left: 2rem;
}

.menu-item{
  width: 90%;
  max-height: 50px;
  position: absolute;
  top: 50%;
  left: 50%;
  color:$primary;
  transform: translate(-50%, -50%);
    text-transform: uppercase;
    font-size: 135%;
}

.sub-menu-item{
  width: 90%;
  max-height: 30px;
  position: absolute;
  top: 50%;
  left: 50%;
    color:$primary;
  transform: translate(-50%, -50%);
    text-transform: uppercase;
    font-size: 100%;
}

.main-content{
  margin-top:0px
}

h2{
  line-height: 52px;
  height: 52px;
  font-size: 1.75rem;
  text-transform: uppercase;
  color:$primary;
}

.socialMenu{
  list-style-type: none;
margin: .25rem;
padding: 0;
overflow: hidden;
  text-align:center;
height:100%
}

.socialMenu li{
 float: left;
 background: none;
    vertical-align: middle;
    margin-top: .65rem;
    margin-left: .5rem;
}
.socialMenu li svg{
  font-size: 1.5rem;
  margin-top: auto;
  margin-bottom: auto;
  text-align:center;
  height: 100%
}

.socialMenu li:hover svg{
  color:darken($primary,50)
}

hr {
  margin-top:0rem;
  margin-bottom: .5rem;
  margin-right: -.75rem;
  margin-left: -.75rem;
  color:darken(white, 50)
}

.navbar-item, .navbar-link{
  margin-left: 1rem;
  color:$primary;
  text-transform: uppercase;
}

a.navbar-item:focus, a.navbar-item:focus-within, a.navbar-item:hover, a.navbar-item.is-active, .navbar-link:focus, .navbar-link:focus-within, .navbar-link:hover, .navbar-link.is-active {
    background-color: rgba(0,0,0,0.2);
}
</style>
