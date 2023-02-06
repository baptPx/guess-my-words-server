import * as yup from 'yup'

const createMap = yup.object({
    title: yup.string().trim().min(2).required(),
    description: yup.string().trim().min(2)
})
interface CreateMapInputDTO extends yup.InferType<typeof createMap> {}

interface CreateMapOutputDTO {
    title: string,
    description: string,
    fileName: string,
    userId: number
}
export { createMap, CreateMapInputDTO, CreateMapOutputDTO }