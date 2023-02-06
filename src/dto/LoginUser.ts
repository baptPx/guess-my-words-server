import * as yup from 'yup'

const loginUserValidator = yup.object({
    username: yup.string().trim().min(2).required(),
    password: yup.string().trim().min(2).required()
})
interface LoginUserInputDTO extends yup.InferType<typeof loginUserValidator> {}

interface LoginUserOutputDTO {
    token: string;
    username: string;
    id: number;
}

export { loginUserValidator, LoginUserInputDTO, LoginUserOutputDTO }