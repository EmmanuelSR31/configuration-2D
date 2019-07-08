export const currentMenuType = state => {
  return state.currentMenuTypeID ? state.menuTypeList[state.currentMenuTypeID] : {}
}
export const getNameByID = state => ids => {
  let names = []
  state.menuTypeList.forEach(function (value, index, arr) {
    if (ids.includes(value.id)) {
      names.push(value.name)
    }
  })
  return names
}
