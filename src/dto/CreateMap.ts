import * as yup from 'yup'

const createMap = yup.object({
    title: yup.string().trim().min(2).required(),
    description: yup.string().trim().min(2),
    file: yup.mixed()
})
interface CreateUserDTO extends yup.InferType<typeof createMap> {}

export {createMap, CreateUserDTO}