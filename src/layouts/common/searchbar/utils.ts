import { flattenArray } from 'src/utils/flatten-array'

import { type NavProps, type NavItemBaseProps } from 'src/components/nav-section'

// ----------------------------------------------------------------------

interface ItemProps {
  group: string
  title: string
  path: string
}

export function getAllItems ({ data }: NavProps) {
  const reduceItems = data
    .map((list) => handleLoop(list.items, list.subheader))
    .flat()

  const items = flattenArray(reduceItems).map((option) => {
    const group = splitPath(reduceItems, option.path)

    return {
      group: group && group.length > 1 ? group[0] : option.subheader,
      title: option.title,
      path: option.path
    }
  })

  return items
}

// ----------------------------------------------------------------------

interface FilterProps {
  inputData: ItemProps[]
  query: string
}

export function applyFilter ({ inputData, query }: FilterProps) {
  if (query) {
    inputData = inputData.filter(
      (item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.path.toLowerCase().includes(query.toLowerCase())
    )
  }

  return inputData
}

// ----------------------------------------------------------------------

export function splitPath (array: NavItemBaseProps[], key: string) {
  let stack = array.map((item) => ({
    path: [item.title],
    currItem: item
  }))

  while (stack.length > 0) {
    const { path, currItem } = stack.pop() as {
      path: string[]
      currItem: NavItemBaseProps
    }

    if (currItem.path === key) {
      return path
    }

    if (currItem.children?.length) {
      stack = stack.concat(
        currItem.children.map((item: NavItemBaseProps) => ({
          path: path.concat(item.title),
          currItem: item
        }))
      )
    }
  }
  return null
}

// ----------------------------------------------------------------------

export function handleLoop (array: any, subheader?: string) {
  return array?.map((list: any) => ({
    subheader,
    ...list,
    ...(list.children && {
      children: handleLoop(list.children, subheader)
    })
  }))
}

// ----------------------------------------------------------------------

type GroupsProps = Record<string, ItemProps[]>

export function groupedData (array: ItemProps[]) {
  const group = array.reduce((groups: GroupsProps, item) => {
    groups[item.group] = groups[item.group] || []

    groups[item.group].push(item)

    return groups
  }, {})

  return group
}
