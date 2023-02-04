import { CreateMapDTO } from "../dto/CreateMap"

const add = (a: number, b: number) : number => {
    return a + b
}

const uploadMap = (file: any, createMapDTO: CreateMapDTO) => {
    
}

module.exports = {
    add,
    uploadMap
}