import {get, post} from './http'

// 判断管理员是否登录成功
export const getLoginStatus = (params) => post(`admin/login/status`, params)

// 查询所有歌手
export const getAllSinger = () => get(`singer/allSinger`)
// 添加歌手
export const setSinger = (params) => post(`singer/add`, params)
// 修改歌手
export const updateSinger = (params) => post(`singer/update`, params)
// 删除歌手
export const delSinger = (id) => get(`singer/delete?id=${id}`)

//根据歌手id查询歌曲
export const songOfSingerId = (id) => get(`song/singer/detail?singerId=${id}`)
// 修改歌曲
export const updateSong = (params) => post(`song/update`, params)
// 删除歌曲
export const deleteSong = (id) => get(`song/delete?id=${id}`)


// 查询所有歌单
export const getAllSongList = () => get(`songList/allSongList`)
// 添加歌单
export const setSongList = (params) => post(`songList/add`, params)
// 修改歌单
export const updateSongList = (params) => post(`songList/update`, params)
// 删除歌单
export const delSongList = (id) => get(`songList/delete?id=${id}`)






