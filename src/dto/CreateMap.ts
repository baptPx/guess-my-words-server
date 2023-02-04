import * as yup from 'yup'

const createMap = yup.object({
    title: yup.string().trim().min(2).required(),
    description: yup.string().trim().min(2)
})
interface CreateMapDTO extends yup.InferType<typeof createMap> {}

export {createMap, CreateMapDTO}