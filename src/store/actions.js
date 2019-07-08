import * as types from './mutation-types'

export const logout = ({ commit }) => {
  commit(types.LOGOUT)
}
export const setUser = ({ commit }, user) => {
  commit(types.SETUSER, user)
}
export const increateTag = ({ commit }, tagObj) => {
  commit(types.INCREATE_TAG, tagObj)
}
export const updateMenuList = ({ commit }) => {
  commit(types.UPDATE_MENULIST)
}
export const setCurrentPageName = ({ commit }, name) => {
  commit(types.SET_CURRENTPAGENAME, name)
}
export const removeTag = ({ commit }, name) => {
  commit(types.REMOVE_TAG, name)
}
export const closePage = ({ commit }, name) => {
  commit(types.CLOSE_PAGE, name)
}
export const closeCurrentTag = ({ commit }) => {
  commit(types.CLOSE_CURRENT_TAG, name)
}
export const closeOtherTag = ({ commit }) => {
  commit(types.CLOSE_OTHER_TAGS, name)
}
export const closeAllTag = ({ commit }) => {
  commit(types.CLOSE_ALL_TAGS)
}
export const setContextMenuOpenedTag = ({ commit }, name) => {
  commit(types.SET_CONTEXTMENUOPENEDTAG, name)
}
export const setCurrentEditForm = ({ commit }, formObj) => {
  commit(types.SET_CURRENTEDITFORM, formObj)
}
export const setCurrentEditFormData = ({ commit }, dataObj) => {
  commit(types.SET_CURRENTEDITFORMDATA, dataObj)
}
export const setCurrentEditChildForm = ({ commit }, formObj) => {
  commit(types.SET_CURRENTEDITCHILDFORM, formObj)
}
export const setCurrentEditChildFormData = ({ commit }, dataObj) => {
  commit(types.SET_CURRENTEDITCHILDFORMDATA, dataObj)
}
export const setSelectData = ({ commit }) => {
  commit(types.SET_SELECTDATA)
}
export const updateSelectData = ({ commit }, obj) => {
  commit(types.UPDATE_SELECTDATA, obj)
}
export const setPositionList = ({ commit }) => {
  commit(types.SET_POSITIONLIST)
}
export const setUserStatusList = ({ commit }) => {
  commit(types.SET_USERSTATUS)
}
export const setOneSelectData = ({ commit }, obj) => {
  commit(types.SET_ONE_SELECTDATA, obj)
}
