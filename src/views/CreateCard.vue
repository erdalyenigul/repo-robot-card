<script setup>
import { reactive, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useGithubStore } from '@/stores/github'
import { useRouter } from "vue-router"

const router = useRouter()
const { getRepoDetail } = storeToRefs(useGithubStore())
const store = useGithubStore()
const pureColor = ref('#3b82f6');
const selectedAvatar = ref('');
const setActive = ref(null);
const linkErrorMsg = ref('');
const envLink = ref('');
const isVisibleLink = ref(false);
const qParam = reactive({
  username: '',
  repo: ''
});

envLink.value = import.meta.env.VITE_SHARE_DOMAIN

const githubInfo = reactive({
  username: '',
  repo: ''
})

async function generateLink() {
  if (generateLinkBtnCheck()) {
    isVisibleLink.value = false
    linkErrorMsg.value = ''
    try {
      const response = await store.getUserRepo(githubInfo)
      qParam.username = getRepoDetail.value.owner.login
      qParam.repo = getRepoDetail.value.name
      isVisibleLink.value = true
    } catch(err) {
      isVisibleLink.value = false
      linkErrorMsg.value = err.message
      return
    }
  } else {
    isVisibleLink.value = false
    linkErrorMsg.value = 'Required fields are missing'
  }
}
const error = ref({
  username: false,
  repo: false,
  avatar: false
})

function generateLinkBtnCheck() {
  githubInfo.username == '' ? error.value.username = true : error.value.username = false
  githubInfo.repo == '' ? error.value.repo = true : error.value.repo = false
  selectedAvatar.value == '' ? error.value.avatar = true : error.value.avatar = false
  if (
    githubInfo.username &&
    githubInfo.repo &&
    selectedAvatar.value
  ) {
    return true
  } else {
    return false
  }
}

function getSelectedAvatar(item, index) {
  setActive.value = index
  selectedAvatar.value = item
  console.log(selectedAvatar.value)
}

function shareCard(qParam) { 
  router.push({ 
    name: 'ShareCard', 
    query: { 
      username: qParam.username,
      repo: qParam.repo,
      avatar: selectedAvatar.value,
      color: pureColor.value.split('#')[1]
    } 
  })
}

</script>

<template>
  <div class="flex w-full items-center justify-center">
    <div class="bg-gray-100 w-full p-4 rounded-xl max-w-[500px]">

      <div class="flex justify-between items center border-b border-gray-200 pb-2 mb-5">
        <div class="flex items-center justify-center">
          <p class="text-xl font-bold text-gray-800">Create Github Repo Robot Card</p>
        </div>
      </div>

      <div class="flex w-full items-center gap-3 mb-5">
        <div class="flex items-center border-2 py-2 px-3 rounded-2xl w-2/4" :class="{ 'validateError' : error.username }">
          <i class="fa-brands fa-github"></i>
          <input v-model="githubInfo.username" class="pl-2 w-full bg-transparent outline-none border-none" type="text"
            placeholder="Github Username" />
        </div>
        <div>/</div>
        <div class="flex items-center border-2 py-2 px-3 rounded-2xl w-2/4" :class="{ 'validateError' : error.repo }">
          <i class="fa-solid fa-code-branch"></i>
          <input v-model="githubInfo.repo" class="pl-2 w-full bg-transparent outline-none border-none" type="text"
            placeholder="Repo" />
        </div>
      </div>

      <div class="flex w-full items-center justify-between mb-5">
        <div class="flex text-[16px]">Select Template Color</div>
        <div class="flex w-[220px] items-center border-2 rounded-2xl h-[40px] overflow-hidden">
          <input type="color" v-model="pureColor" id="colorPicker">
          <div class="ml-2 px-2 py-1">{{ pureColor }}</div>
        </div>
      </div>

      <div class="flex w-full flex-wrap">
        <div class="flex w-full text-[16px] mb-3">Select Avatar</div>
        <div class="flex w-full flex-wrap rounded-t-lg" :class="{ 'validateError' : error.avatar }">
          <a @click="getSelectedAvatar(item, index)"
            :style="setActive == index ? { backgroundColor : pureColor } : ''"
            :class="{ 'avatarActive': setActive == index }" class="flex w-[8.3%] cursor-pointer"
            v-for="(item, index) in store.generateAvatar" :key="index">
            <img :src="`${store.avatarURL}${item}`" alt="">
          </a>
        </div>
      </div>

      <div class="flex w-full flex-wrap">
        <button @click="generateLink()"
          class="btn w-full rounded-b-lg ">GENERATE LINK</button>
      </div>

      <div v-if="isVisibleLink" class="flex w-full flex-wrap mt-5">
        <div class="w-[calc(100%-100px)] border-gray-400 border-[1px] flex p-2 rounded-l-md justify-center text-[14px] break-all">
          {{ `${envLink}share?username=${qParam.username}&repo=${qParam.repo}&avatar=${selectedAvatar}&color=${pureColor.split('#')[1]}` }}
        </div>
        <button @click="shareCard(qParam)"
          class="btn w-[100px] rounded-r-lg"><i class="fa-solid fa-arrow-up-right-from-square mr-2"></i> OPEN</button>
      </div>

      <div v-if="linkErrorMsg" class="flex w-full items-center justify-center mt-5 mb-3 text-red-700">
        <span class="mr-2 text-[20px]"><i class="fa-solid fa-circle-exclamation"></i></span>
        <span>{{ linkErrorMsg }}</span>
      </div>

    </div>
  </div>
</template>

<style scoped>
.avatarActive{border-radius: 10px 10px 0 0;}
</style>
