'use server'

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function createDailyReport(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: "Unauthorized" }
    }

    const student_id = formData.get("studentId") as string
    const date = formData.get("date") as string || new Date().toISOString().split('T')[0]
    const is_paid = formData.get("isPaid") === "on"
    const point_of_focus = formData.get("pointOfFocus") as string
    const new_words = formData.get("newWords") as string
    const homework = formData.get("homework") as string
    const upcoming_class = formData.get("upcomingClass") as string

    if (!student_id) {
        return { error: "Student is required" }
    }

    const { error } = await supabase.from("daily_reports").insert({
        instructor_id: user.id,
        student_id,
        date,
        is_paid,
        point_of_focus,
        new_words,
        homework,
        upcoming_class
    })

    if (error) {
        console.error("Error creating report:", error)
        return { error: "Failed to create report" }
    }

    revalidatePath("/teacher/reports")
    return { success: true }
}

export async function getStudentReports() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    const { data, error } = await supabase
        .from("daily_reports")
        .select(`
            *,
            instructor:profiles!daily_reports_instructor_id_fkey(username, avatar_url)
        `)
        .eq("student_id", user.id)
        .order("date", { ascending: false })

    if (error) {
        console.error("Error fetching student reports:", error)
        return []
    }

    return data
}

export async function getTeacherReports() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    const { data, error } = await supabase
        .from("daily_reports")
        .select(`
            *,
            student:profiles!daily_reports_student_id_fkey(username, avatar_url)
        `)
        .eq("instructor_id", user.id)
        .order("date", { ascending: false })

    if (error) {
        console.error("Error fetching teacher reports:", error)
        return []
    }

    return data
}

export async function getStudentsForTeacher() {
    // Helper to list students for the select dropdown
    // Currently getting all students, in future could limit to enrolled students
    const supabase = await createClient()

    const { data, error } = await supabase
        .from("profiles")
        .select("id, username, avatar_url")
        .eq("role", "student")
        .order("username")

    if (error) {
        return []
    }
    return data
}
