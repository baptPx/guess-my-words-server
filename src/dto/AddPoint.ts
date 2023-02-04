import * as yup from 'yup'

const addPoint = yup.object({
    x: yup.number().required(),
    y: yup.number().required(),
    width: yup.number().required(),
    label: yup.string().required(),
    possibleAnswers: yup.string().required()
})
interface AddPointRequestDTO extends yup.InferType<typeof addPoint> {}

interface AddPointResponseDTO {
    x: number;
    y: number;
    width: number;
    id: number;
    label: number;
    possibleAnswers: number;
}
export {addPoint, AddPointRequestDTO, AddPointResponseDTO}