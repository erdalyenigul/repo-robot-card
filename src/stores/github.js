import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import axios from "axios";

export const useGithubStore = defineStore('github', () => {

  const repoDetail = ref({});
  const getRepoDetail = computed(() => repoDetail.value);
  const getUserRepo = async (data) => {
    const { username, repo } = data;
    const res = await axios.get(`https://api.github.com/repos/${username}/${repo}`);
    const response = res.data;
    repoDetail.value = response;
    return response;
  };

  const userDetail = ref({});
  const getUserDetail = computed(() => userDetail.value);
  const getUser = async (username) => {
    const res = await axios.get(`https://api.github.com/users/${username}`);
    const response = res.data;
    userDetail.value = response;
    return response;
  };

  const contributorsDetail = ref({});
  const getContributorsDetail = computed(() => contributorsDetail.value);
  const getContributors = async (data) => {
    const { username, repo } = data;
    const res = await axios.get(`https://api.github.com/repos/${username}/${repo}/contributors`);
    const response = res.data;
    contributorsDetail.value = response;
    return response;
  };  

  const avatarURL = ref('https://robohash.org/');
  const generateAvatar = ref(['e', 'r', 'd', 'a', 'l', 'y', 'e', 'n', 'i', 'g', 'u', 'l']);

  return { getUserRepo, getRepoDetail, getUser, getUserDetail, generateAvatar, avatarURL, getContributorsDetail, getContributors }
})
