<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRouter } from "vue-router"
import { useRoute } from 'vue-router'
import { useGithubStore } from '@/stores/github'

const store = useGithubStore()
const route = useRoute()
const router = useRouter()
const userDetail = ref({})
const repoDetail = ref({})
const contributorsDetail = ref({})
const topContributors = ref([])

let cardAvatar = ref('')
let cardColor = ref('')
let username = ref('')
let repo = ref('')

async function getUser() {
  try {
    await store.getUser(username)
    userDetail.value = store.getUserDetail
  } catch (err) {
    if (import.meta.env.NODE_ENV === "development") {
      window.console.log(err.message);
    }
  }
}

async function getUserRepo() {
  const githubInfo = {
    username: username,
    repo: repo
  }

  try {
    await store.getUserRepo(githubInfo)
    repoDetail.value = store.getRepoDetail
  } catch (err) {
    if (import.meta.env.NODE_ENV === "development") {
      window.console.log(err.message);
    }
  }
}

async function getUrlQueryParams() {
  await router.isReady()
  cardAvatar = route.query.avatar
  cardColor = route.query.color
  username = route.query.username
  repo = route.query.repo
}

async function getContributors() {
  const githubInfo = {
    username: username,
    repo: repo
  }

  try {
    await store.getContributors(githubInfo)
    contributorsDetail.value = store.getContributorsDetail
    for (let [index, item] of contributorsDetail.value.entries()) {
      topContributors.value.push({
        name: item.login,
        avatar: item.avatar_url,
        commits: item.contributions,
        htmlUrl: item.html_url,
      })
      if (index + 1 == '2') break;
    }
  } catch (err) {
    if (import.meta.env.NODE_ENV === "development") {
      window.console.log(err.message);
    }
  }
}

function formatStar(count) {
  if (count) {
    let star = count.toLocaleString()
    return star
  }
}

onMounted(async () => {
  await getUrlQueryParams()
  await getUser()
  await getUserRepo()
  await getContributors()
})

function externalLink(url) {
  window.open(url, '_blank', 'noreferrer')
}

function shareTwitter() {
    const url = window.location.href;
    window.open(`https://twitter.com/intent/tweet?text=${repoDetail.value.name} - ${repoDetail.value.description}&url=${encodeURIComponent(url)}`);
    return false;
};
</script>

<template>
  <div class="flex w-full items-center justify-center flex-col">
    <div class="relative flex w-[400px] flex-col rounded-xl overflow-hidden bg-gray-200  text-gray-700 shadow-lg mb-5">
      <div class="mb-3 flex justify-between p-2 relative h-[80px]" :style="{ backgroundColor: `#${cardColor}` }">
        <div class="flex items-end absolute bottom-[-15px] left-[15px]">
          <div class="w-[80px] mr-2 rounded-md overflow-hidden shadow-md bg-white">
            <a class="cursor-pointer" @click="externalLink(userDetail.html_url)">
              <img :src="userDetail.avatar_url" :alt="userDetail.name">
            </a>
          </div>
          <div class="flex flex-col items-start">
            <div v-if="repoDetail.stargazers_count"
              class="font-medium flex items-center justify-center rounded-lg bg-white text-sm shadow-md mb-3">
              <div class=" bg-yellow-400 px-2 py-1 mr-1 rounded-l-lg text-white"><i class="fa-solid fa-star"></i> Stars
              </div>
              <div class="px-2">{{ formatStar(repoDetail.stargazers_count) }}</div>
            </div>
            <a @click="externalLink(userDetail.html_url)"
              class="cursor-pointer text-md text-gray-500 bg-white rounded-md h-[30px] flex items-center justify-center p-3 shadow-md">
              @{{ userDetail.name }}</a>
          </div>
        </div>
        <div class="flex items-end absolute bottom-[-15px] right-[15px]">
          <img class="w-[60px] h-[60px] rounded-full bg-white p-1 shadow-md" :src="`${store.avatarURL}${cardAvatar}`"
            :alt="userDetail.name">
        </div>
      </div>

      <div class="flex flex-col flex-wrap w-full p-4">

        <div class="flex w-full bg-white py-2 px-3 rounded-md mb-5 shadow-md">
          <a @click="externalLink(repoDetail.html_url)" class="cursor-pointer font-medium flex items-center">{{ repoDetail.name }}</a>
          <span class="font-light flex items-center">
            <i class="fa-solid fa-circle text-[8px] mx-2"></i> {{ repoDetail.description }}
          </span>
        </div>

        <div v-if="topContributors.length > 0" class="flex items-center w-full flex-wrap justify-between rounded-md">
          <div class="flex w-full justify-between items-center mb-2">
            <div class="font-medium w-2/4 flex">Top Contributors</div>
          </div>

          <div class="grid gap-4 grid-cols-2 w-full">
            <div class="flex bg-white shadow-md rounded-md p-3" v-for="item in topContributors">
              <img @click="externalLink(item.htmlUrl)" :src="item.avatar" :alt="item.name" class="rounded-full w-[40px] h-[40px] cursor-pointer">
              <div class="flex items-center flex-col ml-2">
                <a @click="externalLink(item.htmlUrl)" class="w-full text-[14px] text-gray-800 font-bold cursor-pointer">{{ item.name }}</a>
                <div class="w-full text-[14px] text-gray-400">{{ item.commits }} commits</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex w-[400px] flex-wrap items-center justify-between mb-5">
      <button @click="router.push('/')" class="flex items-center rounded-lg bg-green-500 py-3 px-6 text-md font-bold text-white">
        <i class="fa-solid fa-arrow-up-right-from-square text-[18px] mr-2"></i> GENERATE YOUR CARD
      </button>
      <button @click="shareTwitter()" class="flex items-center rounded-lg bg-blue-500 py-3 px-6 text-md font-bold text-white">
        <i class="fa-brands fa-square-x-twitter text-[18px] mr-2"></i> Tweet
      </button>
    </div>
  </div>

  
</template>

<style lang="scss" scoped>

</style>