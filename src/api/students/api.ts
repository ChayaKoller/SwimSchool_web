import type { StudentFilter } from "../../types/types";
import type { CreateStudentRequest, ReportDto,  StudentDetailsDto, StudentListItemDtoPagedResult, UpdateStudentRequest } from "../../types/typesDtos";
import { http } from "../http";



export async function getStudents(filter:StudentFilter){
    const {data}=await http.get<StudentListItemDtoPagedResult>("/students",{params:filter})
    return data
}
export async function getStudentById(id:number){
    const {data}=await http.get<StudentDetailsDto>(`/students/${id}`)
    return data
}
export async function getStudentReports(id:number){
    const {data}=await http.get<ReportDto[]>(`/students/${id}/reports`)
    return data
}
export async function createStudent(body: CreateStudentRequest) {
    const { data } = await http.post<StudentDetailsDto>("/students", body);
    return data;
}
export async function updateStudent({body,id}:{id:number,body:UpdateStudentRequest}){
    const {data}=await http.put<StudentDetailsDto>(`/students/${id}` ,body)
    return data
}
