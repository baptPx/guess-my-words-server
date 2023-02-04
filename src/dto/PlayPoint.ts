import * as yup from 'yup'

const addAnswer = yup.object({
    answer: yup.string().trim().required()
})
interface AddAnswerRequestDTO extends yup.InferType<typeof addAnswer> {}

export {addAnswer, AddAnswerRequestDTO}