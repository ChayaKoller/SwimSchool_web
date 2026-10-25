import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createStudent, getStudentById, getStudentReports, getStudents, updateStudent } from "./api"
import type { StudentFilter } from "../../types/types"
import { queryKeys } from "../queryKeys"

export function useStudents(filter:StudentFilter){
   return useQuery({
        queryKey:queryKeys.students.list(filter),
        queryFn:()=>getStudents(filter),
        placeholderData: keepPreviousData
    })
}
export function useStudent(id:number|undefined){
   return useQuery({
        queryKey:queryKeys.students.detail(id!),
        queryFn:()=>getStudentById(id!),
        enabled: id !== undefined
    })
}
export function useStudentReports(id:number|undefined){
   return useQuery({
        queryKey:queryKeys.students.reports(id!),
        queryFn:()=>getStudentReports(id!),
        enabled: id !== undefined
    })
}
export function useCreateStudent(){
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn:createStudent,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.students.all })
    })
}
export function useUpdateStudent(){
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn:updateStudent,
        onSuccess: (_data, { id }) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.students.all })
            queryClient.invalidateQueries({ queryKey: queryKeys.students.detail(id) })
        }
    })
}
