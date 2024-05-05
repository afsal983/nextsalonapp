// ----------------------------------------------------------------------

export function flattenArray<T> (list: T[], key = 'children'): T[] {
  let children: T[] = []

  const flatten = list?.map((item: any) => {
    if (item[key]?.length) {
      children = [...children, ...item[key]]
    }
    return item
  })

  return flatten?.concat(
    (children.length > 0) ? flattenArray(children, key) : children
  )
}
