export interface PaginatedResult<T> {
  data: T[]
  payload: {
    pagination: {
      page: number
      items_per_page: number
      total: number
      lastPage: number
      prev: number | null
      next: number | null
    }
  }
}

export type PaginateOptions = {
  page?: number | string
  items_per_page?: number | string
}
export type PaginateFunction = <T, K>(
  model: any,
  args?: K,
  options?: PaginateOptions,
) => Promise<PaginatedResult<T>>

export const paginator = (
  defaultOptions: PaginateOptions,
): PaginateFunction => {
  return async (
    model,
    args: any = { where: undefined, include: undefined },
    options,
  ) => {
    const page = Number(options?.page || defaultOptions?.page) || 1
    const items_per_page =
      Number(options?.items_per_page || defaultOptions?.items_per_page) || 10

    const skip = page > 0 ? items_per_page * (page - 1) : 0
    const [total, data] = await Promise.all([
      model.count({ where: args.where }),
      model.findMany({
        ...args,
        take: items_per_page,
        skip,
      }),
    ])
    const lastPage = Math.ceil(total / items_per_page)

    return {
      data,
      payload: {
        pagination: {
          page,
          items_per_page,
          total,
          lastPage,
          prev: page > 1 ? page - 1 : null,
          next: page < lastPage ? page + 1 : null,
        },
      },
    }
  }
}
