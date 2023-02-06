import * as yup from 'yup'

const createUserValidator = yup.object({
    username: yup.string().trim().min(2).required(),
    password: yup.string().trim().min(2).required()
})
interface CreateUserDTO extends yup.InferType<typeof createUserValidator> {}

interface CreateUserOutputDTO {
    token: string;
    username: string;
    id: number;
}

export {createUserValidator, CreateUserDTO, CreateUserOutputDTO}