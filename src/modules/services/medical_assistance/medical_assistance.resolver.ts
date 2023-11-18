import { ConsultaMedica } from '@prisma/client';

import { IContextValue } from '../../../main/types'

interface ConsultaMedicaArgs {
    fecha: Date,
    hora: Date,
    valoracion: string,
    examen_fisico:  string,
    diagnostico:    string,
    beneficiarioId: string
}

class MedicalAssistanceResolver{

    //endpoint que contesta laendpoint 
    async index(source, args, context: IContextValue, info): Promise<Array<ConsultaMedica>> {
        return await context.db.consultaMedica.findMany({
            where: {
                OR: [{status:1},{status:0}]
            }
        })
        }
    
        async findOne(source, { id }: { id: string }, context: IContextValue, info): Promise<ConsultaMedica> {
            return await context.db.consultaMedica.findUnique({
                where: { id }
            })
        }
        async create(source, { data }: { data: ConsultaMedicaArgs }, context: IContextValue, info) {
            console.log(data)
            return await context.db.consultaMedica.create({
                data: {
                        fecha: data.fecha,
                        hora: data.hora,
                        valoracion: data.valoracion,
                        examen_fisico: data.examen_fisico,
                        diagnostico: data.diagnostico,
                        beneficiarioId: data.beneficiarioId
               }
            })
        }
    
        //async update(source, { id, data }: { id: string, data: { } }, context: IContextValue, info) {
            // nostrar los datos que llegan console.log(data)
         //   console.log(data)
         //   return await context.db.consultaMedica.update({
          //      where: { id },
          //      data: {
           //    }
          //  })
        //}
    
        async delete(source, { id }: { id: string }, context: IContextValue, info) {
            return await context.db.consultaMedica.update({
                where: {id},
                data: {
                    status: -1
                }
    
                //1 activo
                //0 inactivo
                //-1 eliminado
            })
        }
    
    
}

export default MedicalAssistanceResolver